Guidelines for improving tree-sitter parsers
==
[![CircleCI badge](https://circleci.com/gh/returntocorp/tree-sitter-guidelines.svg?style=svg)](https://app.circleci.com/pipelines/github/returntocorp/tree-sitter-guidelines)

This is for people who wish to help with fixing or extending
[tree-sitter](https://tree-sitter.github.io/) parsers, such as
[tree-sitter-javascript](https://github.com/tree-sitter/tree-sitter-javascript)
or [tree-sitter-ruby](https://github.com/tree-sitter/tree-sitter-ruby).
Not all tree-sitter parsers are managed by the [tree-sitter
organization on GitHub](https://github.com/tree-sitter) but most
guidelines should apply there as well.

Contribution workflow
--

1. Locate the public git repository for the language of interest
   e.g. tree-sitter-foo for language Foo.
2. File a GitHub issue if there isn't one already describing the fix
   you want to implement.
3. Fork and clone the git repository, start a new branch.
4. Check that everything's working for you with `npm install && npm
   tests`.
5. Add tests to the test suites in `corpus/` or `test/corpus`.
6. Modify the source code, typically in `grammar.js`, `src/scanner.c`,
   or `src/scanner.cc` until it works or ask for help.
7. When the tests pass and everything looks good, make a pull
   request. The criteria for acceptance are:
   - All tests pass in CI.
   - There are sufficient tests for the new fix/feature.
   - Grammar rules preferably should not have been renamed.
   - The parser size hasn't grown too much (check the value
     of `STATE_COUNT` in `src/parser.c`).

Sample parsing problems
--

This a growing collection of problems that a grammar developer may
face, with tips on how to deal with them. Each example comes with
complete and valid source code to be found in the
[`examples/grammars`](examples/grammars) folder.

### Simple grammar with no difficulty

This is full `grammar.js` file, which parses a word followed by a
number, with optional whitespace.

```js
module.exports = grammar({
  name: "hello",
  rules: {
    program: $ => seq(
      $.ident,
      $.num
    ),
    ident: $ => /[a-z]+/,
    num: $ => /[0-9]+/
  }
});
```

Valid input:
```
hello 123
```

```
hello
123
```

Source code: [hello](examples/grammars/hello)
