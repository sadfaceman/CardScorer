module.exports = [
  {
    ignores: ["node_modules/**"],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        project: "./tsconfig.eslint.json",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    },
    rules: {
      curly: ["error", "all"],
    },
  },
  {
    files: ["**/*.js"],
    rules: {
      curly: ["error", "all"],
    },
  },
];
