import React from 'react';
import { render } from 'react-dom';

import { Highlighter } from './Highlighter';
import { Highlights } from './Highlights';
import { Token } from './Token';
import { getTextNodes } from './utils';

/**
 * Start highlighter.
 *
 * @param match The asynchronous function that find tokens
 * in give paragraphs.
 * @param minBatchTextLength Controls how often to invoke the
 * `match` function according to the total number of characters
 * in the paragraphs.
 * @param className The CSS class name for the highlights container.
 * @param throttleUpdates  Throttle updates,
 * update at most once every specified milliseconds.
 */
export const start = (
  match: (paragraphs: string[]) => Promise<Token[][]>,
  showToken: (token: Token, rect: DOMRect, event: Event) => void,
  hideToken: (token: Token, rect: DOMRect, event: Event) => void,
  minBatchTextLength: number = 1000,
  className: string = '',
  throttleUpdates: number = 500
) => {
  const highlighter = new Highlighter(getTextNodes, match, minBatchTextLength);

  const highlights = document.createElement('highlights');
  highlights.setAttribute('class', className);
  document.body.appendChild(highlights);
  render(
    <Highlights
      highlighter={highlighter}
      throttleUpdates={throttleUpdates}
      className={className}
      onMouseEnterItem={showToken}
      onMouseLeaveItem={hideToken}
    />,
    highlights
  );
};
