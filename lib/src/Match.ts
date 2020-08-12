import { Token } from './Token';

/**
 * The data structure regards a single text node.
 */
export interface Match {
  /**
   * Matched tokens, falsy value means tokens aren't populated yet.
   */
  tokens?: Token[];

  /**
   * The references to the corresponding text nodes.
   */
  nodeRefs: NodeRef[];
}

export interface NodeRef {
  /**
   * Text node.
   * TODO: convert to weak ref.
   */
  node: Node;

  /**
   * Ranges corresponding to the matched tokens.
   */
  ranges: Range[];
}
