import React from 'react';
import { render } from 'react-dom';

import { Highlighter } from './Highlighter';
import { HighlighterConfig } from './HighlighterConfig';
import { Highlights } from './Highlights';
import { Token } from './Token';

interface StartOptions {
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
   * The CSS class name for the highlights container.
   * Defaults to empty string.
   */
  className?: string;

  /**
   * Throttle updates, update at most once every specified milliseconds.
   * Defaults to `500`.
   */
  throttleUpdates?: number;

  /**
   * A selector or an array of `Node` that do nothing when they mutate.
   */
  ignoreMutations: (string | Node)[];
}

/**
 * Initialize and start the highlighter.
 */
export const start = (
  options: StartOptions & HighlighterConfig & TextNodeSelector
) => {
  const highlighter = new Highlighter(options);
  const highlights = document.createElement('highlights');
  if (options.className) {
    highlights.setAttribute('class', options.className);
  }
  document.body.appendChild(highlights);

  render(
    <Highlights
      highlighter={highlighter}
      throttleUpdates={options.throttleUpdates || 500}
      onMouseEnterItem={options.showToken}
      onMouseLeaveItem={options.hideToken}
      ignoreMutations={[...options.ignoreMutations, highlights]}
    />,
    highlights
  );
};
