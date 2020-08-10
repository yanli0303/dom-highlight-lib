import React from 'react';

import { Token } from './Token';

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
      height: rect.height - 2,
      borderBottom: `2px solid ${token.color}`,
    }}
  />
);
