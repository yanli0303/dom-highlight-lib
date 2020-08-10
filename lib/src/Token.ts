/**
 * Represents an underline item.
 */
export interface Token {
  /**
   * The unique ID.
   */
  readonly id: string;

  /**
   * Underline color.
   */
  readonly color: string;

  /**
   * The start position of input string.
   */
  readonly start: number;

  /**
   * The end position of input string.
   */
  readonly end: number;

  /**
   * Optional copy of matched word.
   */
  readonly keyword: string | undefined;
}
