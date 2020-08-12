import { Token } from './Token';

export interface HighlighterConfig extends TextNodeSelector {
  /**
   * The asynchronous function that find tokens
   * in give paragraphs.
   */
  match: (paragraphs: string[]) => Promise<Token[][]>;

  /**
   * Controls how often to invoke the
   * `match` function according to the total number of characters
   * in the paragraphs. Defaults to`1000`.
   */
  minBatchTextLength: number;
}
