import throttle from 'lodash/throttle';
import React, { useEffect, useState } from 'react';

import { Highlight } from './Highlight';
import { Highlighter } from './Highlighter';
import { makeMutationObserver } from './makeMutationObserver';
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
   * A selector or an array of `Node` that do nothing when they mutate.
   */
  ignoreMutations: (string | Node)[];

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
    mutationObserver?.disconnect();
  }
};

export const Highlights = ({
  highlighter,
  throttleUpdates,
  ignoreMutations,
  onMouseEnterItem,
  onMouseLeaveItem,
}: HighlightsProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    deleteEventListeners();
    const flush = () => setCount(v => v + 1);

    const scan = (e: any) => {
      console.log(`${typeof e === 'object' && e.type ? e.type : e}, scanning`);
      highlighter.scan().then(flush);
    };
    const uu = throttle(scan, throttleUpdates);

    document.addEventListener('scroll', uu);
    window.addEventListener('resize', uu);
    UPDATE_HANDLER = uu;

    if (!mutationObserver) {
      mutationObserver = makeMutationObserver(
        highlighter,
        flush,
        ignoreMutations
      );
    }

    mutationObserver?.observe(document.documentElement, {
      attributes: false,
      childList: true,
      subtree: true,
    });

    scan('page load');
  }, [highlighter, throttleUpdates, setCount, ignoreMutations]);

  // eslint-disable-next-line no-console
  console.log(`Rendering highlights...#${count}`);

  highlighter.updateHighlights();
  return (
    <>
      {Array.from(highlighter.matches.values())
        .map((match, matchIndex) =>
          match.nodeRefs.map((ref, refIndex) =>
            ref.ranges.filter(Boolean).map((range, rangeIndex) => {
              const token = (match.tokens || [])[rangeIndex];
              return Array.from(
                range.getClientRects()
              ).map((rect, rectIndex) => (
                <Highlight
                  key={[
                    matchIndex,
                    refIndex,
                    token.id,
                    rangeIndex,
                    rectIndex,
                  ].join('-')}
                  token={token}
                  rect={rect}
                  onMouseEnter={onMouseEnterItem}
                  onMouseLeave={onMouseLeaveItem}
                />
              ));
            })
          )
        )
        .flat(4)}
    </>
  );
};
