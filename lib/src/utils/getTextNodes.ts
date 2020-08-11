/* eslint-disable no-continue */

import { isElementVisible } from './isElementVisible';
import { isRectPartiallyVisible } from './isRectPartiallyVisible';
import { trimInvisibleChars as trim } from './trimInvisibleChars';

const findAllTextNodes = (
  root: Node,
  ignoreInvisibleNodes: boolean,
  trimInvisibleChars: boolean,
  minTextLength: number
) => {
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  const nodes = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const text = node.nodeValue || '';
    if (minTextLength > 0) {
      const s = trimInvisibleChars ? trim(text) : text;
      if (s.length < minTextLength) {
        continue;
      }
    }

    if (ignoreInvisibleNodes) {
      const { parentElement } = node;
      if (!parentElement || !isElementVisible(parentElement)) {
        continue;
      }

      if (!isRectPartiallyVisible(parentElement.getBoundingClientRect())) {
        continue;
      }
    }

    nodes.push(node);
  }

  return nodes;
};

/**
 * Gets all text nodes on the page.
 * @param selectors A string containing one or more selectors to match against.
 * This string must be a valid CSS selector string; if it's not, a SyntaxError
 * exception is thrown. Multiple selectors may be specified by separating
 * them using commas.
 * @param ignoreInvisibleNodes Exclude invisible text nodes.
 * @param trimInvisibleChars Whether to delete both leading and
 * trailing invisible characters before counting node text length.
 * @param minTextLength Exclude text nodes whose text length is less than give value.
 * @returns An array of text nodes that satisfy given conditions.
 */
export const getTextNodes = (
  selectors = '',
  ignoreInvisibleNodes = true,
  trimInvisibleChars = true,
  minTextLength = 3
) => {
  const docE = document.documentElement;
  const roots = selectors
    ? Array.from(docE.querySelectorAll(selectors))
    : [docE];

  return roots
    .map(root =>
      findAllTextNodes(
        root,
        ignoreInvisibleNodes,
        trimInvisibleChars,
        minTextLength
      )
    )
    .flat(2);
};
