import React from 'react';

export const Highlight = ({ token, rect }: { token: Token; rect: DOMRect }) => (
  <div
    style={{
      position: 'fixed',
      top: rect.top - 1,
      left: rect.left,
      width: rect.width,
      height: rect.height - 2,
      borderBottom: `2px solid ${token.color}`,
    }}
  >
    <div style={{ background: token.color }}>
      <ul>
        <li>Card ID: {token.id}</li>
        <li>Title: {token.keyword}</li>
      </ul>
    </div>
  </div>
);
