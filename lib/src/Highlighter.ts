/* eslint-disable no-await-in-loop,no-restricted-syntax,no-console */
import stringHash from 'string-hash';

import { HighlighterConfig } from './HighlighterConfig';
import { Match, NodeRef } from './Match';
import { Token } from './Token';
import {
  getDescendantTextNodes,
  getTextNodes,
  isDescendant,
  testTextNode,
} from './utils';

export class Highlighter {
  /**
   * The current matches in a `Map`.
   * - Key is the hash value of the node text content, different
   * nodes with same text content share same key.
   * - Value is an array of `Match` (different DOM nodes).
   */
  matches: Map<number, Match> = new Map();

  constructor(readonly config: HighlighterConfig) {}

  detachRanges() {
    this.matches.forEach(m =>
      m.nodeRefs.forEach(n => n.ranges.forEach(r => r.detach))
    );
  }

  async setTokens(matches: Match[]) {
    const nonEmptyMatches: Match[] = [];
    matches.forEach(m => {
      if (m.nodeRefs.length === 0) {
        m.tokens = [];
      } else {
        nonEmptyMatches.push(m);
      }
    });

    const tokenGroups = await this.config.match(
      nonEmptyMatches.map(m => m.nodeRefs[0].node.nodeValue || '')
    );
    for (let i = 0; i < nonEmptyMatches.length; i += 1) {
      nonEmptyMatches[i].tokens = tokenGroups[i];
    }
  }

  setNodes(textNodes: Node[]): Promise<void> {
    this.detachRanges();
    const oldMatches = this.matches;
    const newMatches: Map<number, Match> = new Map();
    textNodes.forEach(node => {
      const nodeValueHash = stringHash(node.nodeValue || '');
      const nodeRef: NodeRef = { node, ranges: [] };

      const oldMatch = oldMatches.get(nodeValueHash);
      const newMatch = newMatches.get(nodeValueHash);
      if (newMatch) {
        newMatch.nodeRefs.push(nodeRef);
      } else {
        newMatches.set(nodeValueHash, {
          tokens: oldMatch?.tokens,
          nodeRefs: [nodeRef],
        });
      }
    });

    this.matches = newMatches;
    return this.match();
  }

  /**
   * Find tokens for matches.
   * @param forceUpdate If `false`, skip the matches that have tokens;
   * otherwise ignore existing tokens.
   */
  match(forceUpdate: boolean = false): Promise<void> {
    const promises: Promise<void>[] = [];
    let matches = Array.from(this.matches.values());
    if (!forceUpdate) {
      matches = matches.filter(m => !m.tokens);
    }

    const { minBatchTextLength = 1000 } = this.config;
    let batch: Match[] = [];
    let batchTextLength = 0;
    for (const match of matches) {
      if (match.nodeRefs.length > 0) {
        batch.push(match);
        batchTextLength += (match.nodeRefs[0].node.nodeValue || '').length;
        if (batchTextLength > minBatchTextLength) {
          promises.push(this.setTokens(batch));
          batch = [];
          batchTextLength = 0;
        }
      }
    }

    if (batch.length > 0) {
      promises.push(this.setTokens(batch));
    }

    return Promise.all(promises).then(() => {});
  }

  addNodes(rootNodes: Node[]): Promise<void> {
    let numberOfNewNodes = 0;
    rootNodes
      .map(node =>
        getDescendantTextNodes({
          root: node,
          ...this.config,
        })
      )
      .flat(2)
      .forEach(node => {
        const nodeValueHash = stringHash(node.nodeValue || '');
        const nodeRef: NodeRef = { node, ranges: [] };
        const match = this.matches.get(nodeValueHash);
        if (match) {
          if (!match.nodeRefs.some(it => it.node === node)) {
            match.nodeRefs.push(nodeRef);
            numberOfNewNodes += 1;
          }
        } else {
          this.matches.set(nodeValueHash, { nodeRefs: [nodeRef] });
          numberOfNewNodes += 1;
        }
      });

    console.log(`addNodes: found ${numberOfNewNodes} new text nodes`);
    if (numberOfNewNodes > 0) {
      return this.match();
    }

    return Promise.resolve();
  }

  removeNodes(rootNodes: Node[]) {
    let numberOfRemovedNodes = 0;
    const removedMatchKeys: number[] = [];
    this.matches.forEach((match, key) => {
      match.nodeRefs = match.nodeRefs.filter(ref => {
        if (
          testTextNode(ref.node, this.config) &&
          !rootNodes.some(r => r === ref.node || isDescendant(r, ref.node))
        ) {
          return true;
        }

        numberOfRemovedNodes += 1;
        ref.ranges.forEach(r => r.detach());
        return false;
      });

      if (match.nodeRefs.length === 0) {
        removedMatchKeys.push(key);
      }
    });

    removedMatchKeys.forEach(key => {
      this.matches.delete(key);
    });

    console.log(`removeNodes: removed ${numberOfRemovedNodes} text nodes`);
  }

  updateNodes(rootNodes: Node[]): Promise<void> {
    this.removeNodes(rootNodes);
    return this.addNodes(rootNodes);
  }

  scan(): Promise<void> {
    const nodes = getTextNodes(this.config);
    return this.setNodes(nodes);
  }

  updateHighlights() {
    const makeRange = (ref: NodeRef, t: Token) => {
      const r = document.createRange();
      r.setStart(ref.node, t.start);
      r.setEnd(ref.node, t.end);
      return r;
    };

    this.matches.forEach(m =>
      m.nodeRefs.forEach(ref => {
        ref.ranges.forEach(r => r.detach());
        ref.ranges = (m.tokens || []).map(t => makeRange(ref, t));
      })
    );
  }
}
