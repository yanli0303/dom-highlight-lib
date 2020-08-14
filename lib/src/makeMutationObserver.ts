import { Highlighter } from './Highlighter';
import { isDescendant } from './utils';

const getNodes = (selectorOrRefs: (string | Node)[]): Node[] =>
  selectorOrRefs
    .map(it => {
      if (typeof it === 'string') {
        return it ? Array.from(document.querySelectorAll(it)) : [];
      }

      return [it];
    })
    .flat(2);

export const makeMutationObserver = (
  highlighter: Highlighter,
  done: () => void,
  ignoreMutations: (string | Node)[] = [],
) =>
  new MutationObserver((mutations: MutationRecord[]) => {
    const ignoreNodes = getNodes(ignoreMutations);
    let records = mutations;
    if (ignoreNodes) {
      records = records.filter(
        ({ target }) =>
          target &&
          !ignoreNodes.some(it => it === target || isDescendant(it, target)),
      );
    }

    if (records.length === 0) {
      return;
    }

    const removed = records.map(it => Array.from(it.removedNodes)).flat(2);
    if (removed.length > 0) {
      highlighter.removeNodes(removed);
    }

    let sequence = Promise.resolve();
    const changeRecords = records.filter(it => it.type === 'characterData');
    if (changeRecords.length > 0) {
      sequence = sequence.then(() =>
        highlighter.updateNodes(changeRecords.map(it => it.target)),
      );
    }

    const addedNodes = records.map(it => Array.from(it.addedNodes)).flat(2);
    if (addedNodes.length > 0) {
      sequence = sequence.then(() => highlighter.addNodes(addedNodes));
    }

    sequence.then(done).catch(error => {
      console.error('Failed to process MutationRecords', records, error);
    });
  });
