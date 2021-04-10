Guidelines for improving tree-sitter parsers
==

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

...
