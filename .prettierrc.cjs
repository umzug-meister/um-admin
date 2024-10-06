// prettier.config.js, .prettierrc.js, prettier.config.mjs, or .prettierrc.mjs

/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */

module.exports = {
  plugins: [require.resolve('@trivago/prettier-plugin-sort-imports')],
  printWidth: 120,
  trailingComma: 'all',
  singleQuote: true,
  importOrder: ['@mui/(.*)$', 'react', '(.*)$\\.css', '^[./]', '.*(.*)$'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
