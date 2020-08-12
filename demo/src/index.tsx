import './index.css';

import { start, Token } from 'dom-highlight-lib';
import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';

import { Card } from './Card';
import { TokenView } from './TokenView';

const radomColor = () => {
  const colors = ['red', 'pink', 'orange', 'purple', 'blue', 'black', 'green'];
  const int = Math.floor(Math.random() * 1000) % colors.length;
  return colors[int];
};

let id = 0;

const getRegExp = () => {
  const str = localStorage.getItem('yali-dh-regex');
  if (str) {
    return new RegExp(str, 'mg');
  }

  return /\w+/gm;
};

const match = (paragraphs: string[]) => {
  const regex = getRegExp();
  return new Promise<Token[][]>(function(resolve, reject) {
    const tokenize = (text: string) => {
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
        const result = paragraphs.map(tokenize);
        resolve(result);
      } catch (e) {
        reject(e);
      }
    }, 5);
  });
};

const App = ({ container }: { container: Node }) => {
  const [data, setData] = useState<Card | null>(null);

  useEffect(() => {
    const showToken = (token: Token, rect: DOMRect) => {
      setData({ token, rect });
    };
    const hideToken = () => setData(null);
    start({
      match,
      showToken,
      hideToken,
      className: 'dh-underline',
      ignoreMutations: [container],
    });
  }, [setData, container]);

  const handleNewDOMNode = () => {
    const div = document.createElement('div');
    div.innerHTML = 'New DIV element';
    document.body.appendChild(div);
  };

  return (
    <React.Fragment>
      <button onClick={handleNewDOMNode} style={{ padding: '5px 1em' }}>
        Add New DOM Node, trigger mutation observer
      </button>
      <TokenView data={data} />
    </React.Fragment>
  );
};

const root = document.createElement('div');
root.style.margin = 'margin: 1em auto';
document.body.appendChild(root);
render(<App container={root} />, root);
