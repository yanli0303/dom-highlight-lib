// eslint-disable-next-line no-control-regex
const REGEX_TRIM_CONTROL_CHARS = /^[\u0000-\u001F\u21B5\s]+|[\u0000-\u001F\u21B5\s]+$/gm;

/**
 * Trim both leading and trailing control characters from every line.
 * @remarks
 *  New line characters (`\r` and `\n`) are left untouched.
 * @param s The string to trim.
 * @returns A new string with both leading and trailing control characters deleted from every line.
 */
export const trimInvisibleChars = (s: string) =>
  s.replace(REGEX_TRIM_CONTROL_CHARS, '');
