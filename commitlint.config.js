module.exports = {
    extends: ['@commitlint/config-conventional'],
    parserPreset: {
        parserOpts: {
            headerPattern: /[\s|^]?(\w*)(?:\((.*)\))?!?: (.*)$/,
            headerCorrespondence: ['type', 'scope', 'subject']
        }
    },
    rules: {
        'body-leading-blank': [1, 'always'],
        'body-max-line-length': [1, 'always', 100],
        'footer-leading-blank': [1, 'always'],
        'footer-max-line-length': [1, 'always', 100],
        'header-max-length': [1, 'always', 100],
        'scope-case': [1, 'always', 'lower-case'],
        'subject-case': [
            2,
            'never',
            ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
        ],
        'subject-empty': [2, 'never'],
        'subject-full-stop': [2, 'never', '.'],
        'type-case': [1, 'always', 'lower-case'],
        'type-empty': [2, 'never']
    },
};

