import React from 'react';
import { render } from 'react-dom';

import { Highlighter } from './Highlighter';
import { Highlights } from './Highlights';
import { Token } from './Token';
import { getTextNodes } from './utils';

interface Options {
  /**
   * The asynchronous function that find tokens
   * in give paragraphs.
   */
  match: (paragraphs: string[]) => Promise<Token[][]>;

  /**
   * Defines what to do when the user mouse hover on a token.
   * @param token The token.
   * @param rect The `DOMRect` where the user hovered on.
   * Note that a token might have more than one `DOMRect`s.
   * @param event The mouse event.
   */
  showToken: (token: Token, rect: DOMRect, event: Event) => void;

  /**
   * Defines what to do when the user moves mouse out of a token.
   * @param token The token.
   * @param rect The `DOMRect` where the user moved mouse out from.
   * Note that a token might have more than one `DOMRect`s.
   * @param event The mouse event.
   */
  hideToken: (token: Token, rect: DOMRect, event: Event) => void;

  /**
   * Specify CSS selector string of the root nodes to match.
   * This string must be a valid CSS selector string; if it's not, a SyntaxError
   * exception is thrown. Multiple selectors may be specified by separating
   * them using commas.
   *
   * Defaults to the `document.documentElement`.
   */
  selectors?: string;

  /**
   * Whether ignores invisible nodes. Defaults to `true`.
   * @remarks
   * An HTML element is visible if both of below assertions are true:
   * - The element is visible as defined by the CSS rules - it must
   * has an `offsetParent`.
   * - The element has intersection with the viewport - it is on the screen.
   */
  ignoreInvisibleNodes?: boolean;

  /**
   * Ignore text nodes whose text length is less than specified value.
   * Defaults to `3`.
   * @remarks
   */
  minTextLength?: number;

  /**
   * Whether ignores the leading and trailing invisible chars before
   * counting the text length. Defaults to `true`.
   */
  trimInvisibleChars?: boolean;

  /**
   * Controls how often to invoke the
   * `match` function according to the total number of characters
   * in the paragraphs. Defaults to`1000`.
   */
  minBatchTextLength?: number;

  /**
   * The CSS class name for the highlights container.
   * Defaults to empty string.
   */
  className?: string;

  /**
   * Throttle updates, update at most once every specified milliseconds.
   * Defaults to `500`.
   */
  throttleUpdates?: number;
}

/**
 * Start highlighter.
 *
 * @param selectors
 * @param minBatchTextLength
 * @param className The CSS class name for the highlights container.
 * @param throttleUpdates  Throttle updates,
 * update at most once every specified milliseconds.
 */
export const start = ({
  match,
  showToken,
  hideToken,
  selectors = '',
  ignoreInvisibleNodes = true,
  minTextLength = 3,
  trimInvisibleChars = true,
  minBatchTextLength = 1000,
  className = '',
  throttleUpdates = 500,
}: Options) => {
  const findTextNodes = () =>
    getTextNodes(
      selectors,
      ignoreInvisibleNodes,
      trimInvisibleChars,
      minTextLength
    );
  const highlighter = new Highlighter(findTextNodes, match, minBatchTextLength);

  const highlights = document.createElement('highlights');
  if (className) {
    highlights.setAttribute('class', className);
  }
  document.body.appendChild(highlights);

  render(
    <Highlights
      highlighter={highlighter}
      throttleUpdates={throttleUpdates}
      onMouseEnterItem={showToken}
      onMouseLeaveItem={hideToken}
    />,
    highlights
  );
};
