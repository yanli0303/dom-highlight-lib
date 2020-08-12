import { isElementVisible } from './isElementVisible';
import { isRectPartiallyVisible } from './isRectPartiallyVisible';
import { trimInvisibleChars as trim } from './trimInvisibleChars';

/**
 * Tells whether the specified text node satisfies the given filters.
 * @param textNode The text node to test.
 * @param filters The text node filters.
 * @returns `true` if the text node satisfies all of the give filters;
 * otherwise `false`.
 */
export const testTextNode = (textNode: Node, filters: TextNodeFilter) => {
  const { minTextLength, trimInvisibleChars, ignoreInvisibleNodes } = filters;
  const text = textNode.nodeValue || '';
  if (minTextLength > 0) {
    const s = trimInvisibleChars ? trim(text) : text;
    if (s.length < minTextLength) {
      return false;
    }
  }

  if (ignoreInvisibleNodes) {
    const { parentElement } = textNode;
    if (!parentElement || !isElementVisible(parentElement)) {
      return false;
    }

    if (!isRectPartiallyVisible(parentElement.getBoundingClientRect())) {
      return false;
    }
  }

  return true;
};

/**
 * Gets all text nodes in the specified root node.
 * @param filters The text node filters.
 * @returns An array of text nodes that satisfy given filters.
 */
export const getDescendantTextNodes = (filters: DescendantTextNodeFilter) => {
  const walker = document.createTreeWalker(
    filters.root,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  const textNodes = [];
  while (walker.nextNode()) {
    if (testTextNode(walker.currentNode, filters)) {
      textNodes.push(walker.currentNode);
    }
  }
  return textNodes;
};

/**
 * Gets all text nodes on the page.
 * @param param0 The text node selector.
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
