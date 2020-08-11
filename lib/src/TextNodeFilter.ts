interface TextNodeFilter {
  /**
   * Whether ignores invisible nodes. Defaults to `true`.
   * @remarks
   * An HTML element is visible if both of below assertions are true:
   * - The element is visible as defined by the CSS rules - it must
   * has an `offsetParent`.
   * - The element has intersection with the viewport - it is on the screen.
   */
  ignoreInvisibleNodes: boolean;

  /**
   * Ignore text nodes whose text length is less than specified value.
   * Defaults to `3`.
   * @remarks
   */
  minTextLength: number;

  /**
   * Whether ignores the leading and trailing invisible chars before
   * counting the text length. Defaults to `true`.
   */
  trimInvisibleChars: boolean;
}

interface TextNodeSelector extends TextNodeFilter {
  /**
   * Specify CSS selector string of the root nodes to match.
   * This string must be a valid CSS selector string; if it's not,
   * a SyntaxError exception is thrown. Multiple selectors may be
   * specified by separating them using commas.
   *
   * Defaults to the `document.documentElement`.
   */
  selectors: string;
}

interface DescendantTextNodeFilter extends TextNodeFilter {
  /**
   * A root Node to traversal from. Typically this will be an
   * element owned by the document.
   */
  root: Node;
}
