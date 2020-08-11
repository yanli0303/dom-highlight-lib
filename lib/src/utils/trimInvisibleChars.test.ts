/* eslint-disable no-irregular-whitespace */
import { trimInvisibleChars } from './trimInvisibleChars';

it('single line', () => {
  expect(trimInvisibleChars(' 　\u0000a\u0001b\u21B5 　')).toEqual('a\u0001b');
});

it('new line characters must be reserved', () => {
  expect(
    trimInvisibleChars(` 　\u0000a\u0001b\u21B5 　
    \u0000a\u0001b\u21B5 　`)
  ).toEqual('a\u0001b\na\u0001b');
});
