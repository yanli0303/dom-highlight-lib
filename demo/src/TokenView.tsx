import React from 'react';

import { Card } from './Card';

export const TokenView = ({ data }: { data: Card | null }) => {
  if (!data) {
    return null;
  }

  return (
    <div
      className="token-view"
      style={{
        background: data.token.color,
        top: data.rect.bottom,
        left: data.rect.left,
      }}
    >
      <ul>
        <li>Card ID: {data.token.id}</li>
        <li>Title: {data.token.keyword}</li>
      </ul>
    </div>
  );
};
