/* eslint-disable no-continue */

import { isElementVisible } from './isElementVisible';
import { isRectPartiallyVisible } from './isRectPartiallyVisible';
import { trimInvisibleChars as trim } from './trimInvisibleChars';

/**
 * Gets all text nodes in the specified root node.
 * @param param0 The text node filters.
 * @returns An array of text nodes that satisfy given filters.
 */
export const getDescendantTextNodes = ({
  root,
  ignoreInvisibleNodes,
  trimInvisibleChars,
  minTextLength,
}: DescendantTextNodeFilter) => {
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
 * @returns An array of text nodes that satisfy given filters.
 */
export const getTextNodes = ({
  selectors = '',
  ignoreInvisibleNodes = true,
  trimInvisibleChars = true,
  minTextLength = 3,
}: TextNodeSelector) => {
  const docE = document.documentElement;
  const roots = selectors
    ? Array.from(docE.querySelectorAll(selectors))
    : [docE];

  return roots
    .map(root =>
      getDescendantTextNodes({
        root,
        ignoreInvisibleNodes,
        trimInvisibleChars,
        minTextLength,
      })
    )
    .flat(2);
};
