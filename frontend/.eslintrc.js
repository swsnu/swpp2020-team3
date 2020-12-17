module.exports = {
    "parser": "babel-eslint",
    "env": {
        "browser": true,
        "es6": true,
        "node": true,
        "jest": true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "react/prop-types":0,
        "react/display-name":0,
        "no-unused-vars": 0,
        "no-mixed-spaces-and-tabs":0,
        "no-control-regex":0,
        "react/jsx-key":0,
        "no-undef":0,
    }
};
