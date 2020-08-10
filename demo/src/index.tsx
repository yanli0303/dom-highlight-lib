import './index.css';

import { start, Token } from 'dom-highlight-lib';
import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';

interface TokenView {
  token: Token;
  rect: DOMRect;
}

const radomColor = () => {
  const colors = ['red', 'pink', 'orange', 'purple', 'blue', 'black', 'green'];
  const int = Math.floor(Math.random() * 1000) % colors.length;
  return colors[int];
};

let id = 0;
const regex = /\w+/gm;
const match = (paragraphs: string[]) =>
  new Promise<Token[][]>(function(resolve, reject) {
    const match = (text: string) => {
      const tokens: Token[] = [];
      let m = regex.exec(text);
      while (m !== null) {
        tokens.push({
          id: id.toString(),
          color: radomColor(),
          start: m.index,
          end: m.index + m[0].length,
          keyword: m[0],
        });
        id += 1;
        m = regex.exec(text);
      }
      return tokens;
    };

    setTimeout(() => {
      try {
        const result = paragraphs.map(match);
        resolve(result);
      } catch (e) {
        reject(e);
      }
    }, 5);
  });

const App = () => {
  const [data, setData] = useState<TokenView | null>(null);

  useEffect(() => {
    const showToken = (token: Token, rect: DOMRect) => {
      setData({ token, rect });
    };
    const hideToken = () => setData(null);
    start(match, showToken, hideToken, 20, 'dh-underline', 500);
  }, [setData]);

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
        <li>Card ID: ${data.token.id}</li>
        <li>Title: ${data.token.keyword}</li>
      </ul>
    </div>
  );
};

render(<App />, document.getElementById('root'));
