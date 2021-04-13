# Generic makefile shared by all the grammars via a symlink.

# Build and test the grammar
.PHONY: test
test:
	npx tree-sitter generate
	rm -f package.json
	npx tree-sitter test

.PHONY: clean
clean:
	git clean -dfX
