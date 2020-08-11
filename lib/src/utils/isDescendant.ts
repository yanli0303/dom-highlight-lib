/**
 * Tells whether the first node is an ancestor of the second.
 * @param ancestor The first node.
 * @param descendant The second node.
 * @returns `true` if the first node is an ancestor of the second;
 * otherwise `false`.
 */
export const isDescendant = (ancestor: Node, descendant: Node) => {
  let parent = descendant.parentNode;
  while (parent !== null) {
    if (parent === ancestor) {
      return true;
    }
    parent = parent.parentNode;
  }

  return false;
};
