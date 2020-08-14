import React from 'react';

import { Token } from './Token';

const UNDERLINE_OFFSET_BOTTOM = 1 as const;

export const Highlight = ({
  token,
  rect,
  onMouseEnter,
  onMouseLeave,
}: {
  token: Token;
  rect: DOMRect;
  onMouseEnter: (token: Token, rect: DOMRect, event: Event) => void;
  onMouseLeave: (token: Token, rect: DOMRect, event: Event) => void;
}) => (
  <div
    onMouseEnter={(event: any) => onMouseEnter(token, rect, event)}
    onMouseLeave={(event: any) => onMouseLeave(token, rect, event)}
    style={{
      position: 'fixed',
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height - UNDERLINE_OFFSET_BOTTOM,
      borderBottom: `2px solid ${token.color}`,
      zIndex: 2147483647,
    }}
  />
);
