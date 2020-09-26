module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  // ESLint指定解析器 默认使用Espree作为其解析器
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  // ESLint 附带有大量的规则。你可以使用注释或配置文件修改你项目中要使用的规则
  // https://www.npmjs.com/package/@typescript-eslint/eslint-plugin
  // 要改变一个规则设置，你必须将规则 ID 设置为下列值之一：
  // "off" 或 0 - 关闭规则
  // "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出)
  // "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)

  settings: {
    react: {
      // React version. "detect" automatically picks the version you have installed.
      // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
      // default to latest and warns if missing
      // It will default to "detect" in the future
      version: 'detect',
    },
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-empty-interface': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/camelcase': 0,
    // 函数需要标注返回值类型
    '@typescript-eslint/explicit-module-boundary-types': 0,
    // 建议使用 let 或 const 而不是 var
    'no-var': 'warn',
  },
};
