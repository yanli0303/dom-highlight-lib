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

  onMouseEnterItem: (token: Token, rect: DOMRect, event: Event) => void;
  onMouseLeaveItem: (token: Token, rect: DOMRect, event: Event) => void;
}

const SCROLL = 'scroll' as const;
const RESIZE = 'resize' as const;
let UPDATE_HANDLER: any = null;
let mutationObserver: MutationObserver | null = null;

const deleteEventListeners = () => {
  if (UPDATE_HANDLER) {
    document.removeEventListener(SCROLL, UPDATE_HANDLER);
    window.removeEventListener(RESIZE, UPDATE_HANDLER);
    UPDATE_HANDLER = null;
  }
};

export const Highlights = ({
  highlighter,
  throttleUpdates,
  onMouseEnterItem,
  onMouseLeaveItem,
}: HighlightsProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    deleteEventListeners();

    const updateHighlights = (e: any) => {
      console.log(
        `Re-scan triggered by ${typeof e === 'object' && e.type ? e.type : e}`
      );
      highlighter.scan().then(() => setCount(v => v + 1));
    };
    const uu = throttle(updateHighlights, throttleUpdates);

    UPDATE_HANDLER = uu;

    mutationObserver = new MutationObserver((...args: any[]) => {
      console.log(`DOM change:`, args);
      uu('MutationObserver');
    });
    mutationObserver.observe(document.documentElement, {
      attributes: false,
      childList: true,
      subtree: true,
    });

    updateHighlights('page load');
    document.addEventListener('scroll', uu);
    window.addEventListener('resize', uu);
  }, [highlighter, throttleUpdates, setCount]);

  // eslint-disable-next-line no-console
  console.log(`Rendering highlights...#${count}`);

  highlighter.updateHighlights();
  return (
    <>
      {highlighter.matches
        .map((m, mi) =>
          m.ranges.filter(Boolean).map((r, ri) => {
            const token = m.tokens[ri];
            return Array.from(r.getClientRects()).map((rect, ri) => (
              <Highlight
                key={[mi, token.id, ri].join('-')}
                token={token}
                rect={rect}
                onMouseEnter={onMouseEnterItem}
                onMouseLeave={onMouseLeaveItem}
              />
            ));
          })
        )
        .flat(3)}
    </>
  );
};
