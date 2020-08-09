import React from 'react';
import { render } from 'react-dom';

import { Highlighter } from './Highlighter';
import { Highlights } from './Highlights';
import { getTextNodes } from './utils';

export const start = (
  match: (nodes: Node[]) => Promise<Alert[][]>,
  minBatchTextLength: number = 1000
) => {
  const highlighter = new Highlighter(getTextNodes, match, minBatchTextLength);
  const highlights = document.createElement('highlights');
  document.body.appendChild(highlights);
  render(<Highlights highlighter={highlighter} />, highlights);
};
