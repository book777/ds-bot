const common = { 
  maxLength: 120, // same for .editorconfig["max_line_length"]
  indent: 2 
};

// https://prettier.io/docs/en/options.html
const prettierOptions = {
  "arrowParens": "avoid",
  "trailingComma": "none",
  "endOfLine": "auto",
  "semi": true,
  "tabWidth": common.indent,
  "indentSize": common.indent,
  "singleQuote": false,
  "printWidth": common.maxLength
};

module.exports = {
  "rules": {
    "prettier/prettier": [
      "error",
      prettierOptions
    ],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "sort-imports": "off", // Managed by simple-import-sort
    "import/order": "off", // Managed by simple-import-sort
    "semi": "off", // Managed by prettier
    "indent": ["off", common.indent], // Managed by prettier
    "no-multiple-empty-lines": ["error", {
      "max": 2,
      "maxBOF": 0,
      "maxEOF": 0
    }],
    "space-before-function-paren": [
      "error",
      {
        "anonymous": "always",
        "named": "never",
        "asyncArrow": "always"
      }
    ],
    "arrow-parens": [
      "error",
      "as-needed"
    ],
    "arrow-spacing": [
      "error",
      {
        "before": true,
        "after": true
      }
    ],
    "comma-dangle": [
      "error",
      "never"
    ],
    "no-useless-catch": "warn",
    "no-debugger": "warn",
    "no-console": "off",
    "max-lines": ["warn", {
      "max": 400,
      "skipBlankLines": true,
      "skipComments": true
    }],
    "no-unused-vars": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn", // Checks effect dependencies
    "react/jsx-curly-brace-presence": [
      "error",
      {
        "children": "never",
        "props": "never"
      }
    ],
    "react/prop-types": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/semi": "off" // Managed by prettier
  },
  "overrides": [
    {
      "files": [
        "*.js",
        "*.jsx"
      ],
      "rules": {
        "no-unused-vars": "warn",
        "no-console": "off"
      }
    },
    {
      "files": [
        "*.ts",
        "*.tsx"
      ],
      "rules": {
        "@typescript-eslint/no-var-requires": "error",
        "@typescript-eslint/no-empty-function": "error",
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/explicit-function-return-type": [
          "off",
          {
            "allowExpressions": true
          }
        ]
      }
    }
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "requireConfigFile": false,
    "babelOptions": {
      "presets": [
        "@babel/preset-react"
      ]
    },
    "ecmaFeatures": {
      "jsx": true
    },
    "tsconfigRootDir": __dirname
  },
  "plugins": [
    "prettier",
    "simple-import-sort",
    "@typescript-eslint",
    "react-hooks",
    "react"
  ],
  "extends": [
    "plugin:prettier/recommended",
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:react/recommended"
  ],
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "root": true,
  "env": {
    "es6": true,
    "browser": true,
    "node": true,
    "commonjs": true,
    "jest": true
  }
};
