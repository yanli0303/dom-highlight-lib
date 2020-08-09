import throttle from 'lodash/throttle';
import React, { useEffect, useState } from 'react';

import { Highlighter } from './Highlighter';

export const Highlights = ({ highlighter }: { highlighter: Highlighter }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    highlighter.scan().then(() => setCount(v => v + 1));

    const update = throttle(() => {
      console.log('Updating highlights...');
      highlighter.updateHighlights();
      setCount(v => v + 1);
    }, 500);

    document.addEventListener('scroll', update);
    window.addEventListener('resize', update);
  }, [highlighter, setCount]);

  console.log(`Rendering highlights...#${count}`);
  return (
    <div>
      {highlighter.matches
        .map(m =>
          m.ranges.filter(Boolean).map((r, index) => {
            const alert = m.alerts[index];
            return Array.from(r.getClientRects()).map((rect, index) => (
              <div
                key={alert.id + index}
                className="dh-underline"
                style={{
                  zIndex: 999999,
                  position: 'fixed',
                  top: rect.top + rect.height - 1,
                  left: rect.left,
                  width: rect.width,
                  height: 2,
                  background: alert.color,
                }}
              >
                <div style={{ background: alert.color, color: '#ffffff' }}>
                  <ul>
                    <li>Card ID: {alert.id}</li>
                    <li>Title: {alert.keyword}</li>
                  </ul>
                </div>
              </div>
            ));
          })
        )
        .flat(3)}
    </div>
  );
};
