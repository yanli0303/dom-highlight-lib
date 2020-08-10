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

  return (
    (top >= 0 && top <= vh && left >= 0 && left <= vw) || // top left
    (bottom >= 0 && bottom <= vh && left >= 0 && left <= vw) || // bottom left
    (top >= 0 && top <= vh && right >= 0 && right <= vw) || // top right
    (bottom >= 0 && bottom <= vh && right >= 0 && right <= vw) // bottom right
  );
};
