module.exports = {
  globals: {
    browser: true
  },
  extends: [
    "eslint-config-yan"
  ],
  rules: {
    "prettier/prettier": "off",

    // disable ESLint v7 rules for now
    "default-case-last": "off",
    "no-loss-of-precision": "off",
    "no-promise-executor-return": "off",
    "no-unreachable-loop": "off",
    "no-useless-backreference": "off"
  }
}
