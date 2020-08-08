/**
 * Tells whether an HTMLElement is visible.
 * @remarks
 * - An HTMLElement is visible doesn't mean people can see it on the screen.
 * - The implementation is based on `jQuery`'s `:visible` selector. See
 *   https://github.com/jquery/jquery/blob/d0ce00cdfa680f1f0c38460bc51ea14079ae8b07/src/css/hiddenVisibleSelectors.js
 * - Alternatively, if not considering `position: fixed`, use `e.offsetParent !== null`. See
 *   https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
 * @param e The HTMLElement to test.
 * @returns Returns `true` if the HTMLElement is visible as defined by CSS rules;
 * otherwise `false`.
 */
export const isElementVisible = (e: HTMLElement) =>
  !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
