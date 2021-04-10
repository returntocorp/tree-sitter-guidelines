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

After that, if you want to work on a single example `hello`, you can
call `tree-sitter` directly:
```
cd grammars/hello
npx tree-sitter generate
npx tree-sitter test
```
