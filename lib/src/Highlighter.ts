/* eslint-disable no-await-in-loop,no-restricted-syntax */

import stringHash from 'string-hash';

import { Match } from './Match';
import { Token } from './Token';

export class Highlighter {
  matches: Match[] = [];

  constructor(
    readonly getTextNodes: () => Node[],
    readonly match: (paragraphs: string[]) => Promise<Token[][]>,
    readonly minBatchTextLength: number = 1000
  ) {}

  /**
   * Split given nodes into two groups:
   * - Unchanged: the nodes whose value unchanged since last scan.
   * - Changed and new: the newly found and changed nodes.
   * @param nodes The nodes to group.
   */
  private groupNodes(nodes: Node[]) {
    const oldMatchMap = new Map<number, Match>();
    this.matches.forEach(it => {
      oldMatchMap.set(it.nodeValueHash, it);
    });

    const unchanged: Match[] = [];
    const changedAndNew: Match[] = [];
    nodes.forEach(node => {
      const nodeValue = node.nodeValue || '';
      const nodeValueHash = stringHash(nodeValue);
      const oldMatch = oldMatchMap.get(nodeValueHash);
      const match: Match = {
        node,
        nodeValueHash,
        tokens: oldMatch ? oldMatch.tokens : [],
        ranges: [],
      };
      if (oldMatch) {
        unchanged.push(match);
      } else {
        changedAndNew.push(match);
      }
    });

    return { unchanged, changedAndNew };
  }

  /**
   * Perform `match` for every item and set `item.tokens`.
   * @param items The items to update tokens.
   */
  async setTokens(items: Match[]) {
    const l = items.length;
    let batch: Match[] = [];
    let batchTextLength = 0;
    for (let i = 0; i < l; i += 1) {
      const match = items[i];
      batch.push(match);
      batchTextLength += (match.node.nodeValue || '').length;
      if (i === l - 1 || batchTextLength > this.minBatchTextLength) {
        const tokenGroups = await this.match(
          batch.map(n => n.node.nodeValue || '')
        );
        for (let j = 0; j < batch.length; j += 1) {
          batch[j].tokens = tokenGroups[j];
        }
        batch = [];
        batchTextLength = 0;
      }
    }
  }

  async scan() {
    this.matches.forEach(m => m.ranges.forEach(r => r.detach()));

    const nodes = await this.getTextNodes();
    const { unchanged, changedAndNew } = this.groupNodes(nodes);

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log(
        `Highlighter.scan: unchanged=${unchanged.length}, changed and new: ${changedAndNew.length}`
      );
    }

    await this.setTokens(changedAndNew);
    this.matches = [...unchanged, ...changedAndNew];
  }

  updateHighlights() {
    const makeRange = (m: Match, t: Token) => {
      const r = document.createRange();
      r.setStart(m.node, t.start);
      r.setEnd(m.node, t.end);
      return r;
    };

    for (const m of this.matches) {
      m.ranges.forEach(r => r.detach());
      m.ranges = m.tokens.map(t => makeRange(m, t));
    }
  }
}
