import throttle from 'lodash/throttle';
import React, { useEffect, useState } from 'react';

import { Highlight } from './Highlight';
import { Highlighter } from './Highlighter';
import { Token } from './Token';

/**
 * `Highlights` properties.
 */
interface HighlightsProps {
  /**
   * The Highlighter instance.
   */
  highlighter: Highlighter;

  /**
   * Throttle updates, update at most once every specified milliseconds.
   */
  throttleUpdates: number;

  /**
   * The CSS class name for the highlights container.
   */
  className: string;

  onMouseEnterItem: (token: Token, rect: DOMRect, event: Event) => void;
  onMouseLeaveItem: (token: Token, rect: DOMRect, event: Event) => void;
}

const SCROLL = 'scroll' as const;
const RESIZE = 'resize' as const;
let UPDATE_HANDLER: any = null;

const deleteEventListeners = () => {
  if (UPDATE_HANDLER) {
    document.removeEventListener(SCROLL, UPDATE_HANDLER);
    window.removeEventListener(RESIZE, UPDATE_HANDLER);
    UPDATE_HANDLER = null;
  }
};

export const Highlights = (props: HighlightsProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    deleteEventListeners();

    const update = () =>
      props.highlighter.scan().then(() => setCount(v => v + 1));

    update();
    UPDATE_HANDLER = throttle(update, props.throttleUpdates);
    document.addEventListener('scroll', UPDATE_HANDLER);
    window.addEventListener('resize', UPDATE_HANDLER);
  }, [props.highlighter, props.throttleUpdates, setCount]);

  console.log(`Rendering highlights...#${count}`);

  props.highlighter.updateHighlights();
  return (
    <React.Fragment>
      {props.highlighter.matches
        .map(m =>
          m.ranges.filter(Boolean).map((r, ri) => {
            const token = m.tokens[ri];
            return Array.from(r.getClientRects()).map((rect, ri) => (
              <Highlight
                key={token.id + ri}
                token={token}
                rect={rect}
                onMouseEnter={props.onMouseEnterItem}
                onMouseLeave={props.onMouseLeaveItem}
              />
            ));
          })
        )
        .flat(3)}
    </React.Fragment>
  );
};
