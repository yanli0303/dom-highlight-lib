import { isElementVisible } from './isElementVisible';
import { isRectIntersectViewport } from './isRectIntersectViewport';
import { trimInvisibleChars as trim } from './trimInvisibleChars';

/**
 * Gets all text nodes on the page.
 * @param visibleOnly Exclude invisible text nodes.
 * @param trimInvisibleChars Whether to delete both leading and
 * trailing invisible characters before counting node text length.
 * @param minLength Exclude text nodes whose text length is less than give value.
 * @returns An array of text nodes that satisfy given conditions.
 */
export const getTextNodes = (
  visibleOnly = true,
  trimInvisibleChars = true,
  minLength = 3
) => {
  const walker = document.createTreeWalker(
    document.documentElement,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  const nodes = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const text = node.nodeValue || '';
    if (minLength > 0) {
      const s = trimInvisibleChars ? trim(text) : text;
      if (s.length < minLength) {
        continue;
      }
    }

    if (visibleOnly) {
      const { parentElement } = node;
      if (!parentElement || !isElementVisible(parentElement)) {
        continue;
      }

      if (!isRectIntersectViewport(parentElement.getBoundingClientRect())) {
        continue;
      }
    }

    nodes.push(node);
  }

  return nodes;
};
