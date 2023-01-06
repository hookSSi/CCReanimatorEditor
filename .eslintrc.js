module.exports = {
    "env": {
        "commonjs": true
    },
    "extends": ["prettier", "eslint:recommended", "eslint-config-prettier", "plugin:@typescript-eslint/recommended"],
    "parser": "@typescript-eslint/parser",
    "plugins": ["@typescript-eslint", "only-warn"],
    "overrides": [
        {
            "files": ["assets/**/*.ts", "test/**/*.test.ts"],
        }
    ]
}
