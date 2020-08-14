/* eslint-disable complexity */

/**
 * Tells whether the given DOMRect intersects with the viewport.
 * @param param0 The DOMRect to test.
 * @returns Returns `true` if any pixel in the DOMRect is visible on the screen,
 * even it is under the scrollbars; otherwise `false`;
 */
export const isRectPartiallyVisible = ({
  left,
  right,
  top,
  bottom,
}: DOMRect) => {
  const vw = window.innerWidth || document.documentElement.clientWidth;
  const vh = window.innerHeight || document.documentElement.clientHeight;

  if (top >= 0 && top <= vh) {
    return (left >= 0 && left <= vw) // top left
      || (right >= 0 && right <= vw); // top right
  }

  if (bottom >= 0 && bottom <= vh) {
    return (left >= 0 && left <= vw) // bottom left
    || (right >= 0 && right <= vw); // bottom right
  }

  return false
};
