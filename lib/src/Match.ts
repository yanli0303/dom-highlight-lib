import { Token } from './Token';

/**
 * The data structure regards a single text node.
 */
export interface Match {
  /**
   * Text node.
   * TODO: convert to weak ref.
   */
  node: Node;

  /**
   * Hash value of the node text content.
   */
  nodeValueHash: number;

  /**
   * Matched tokens.
   */
  tokens: Token[];

  /**
   * Ranges corresponding to the matched tokens.
   */
  ranges: Range[];
}
