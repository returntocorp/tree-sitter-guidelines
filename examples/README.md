Tree-sitter parsing examples
==

This folder contains examples, some which display errors on purpose.
The grammars and the accompanying tests can be found under
[`grammars/`](grammars).

To build and test all the examples, run:
```
make
make test
```

To work on a single example `hello`, run:
```
cd hello
npx tree-sitter generate
npx tree-sitter test
```
