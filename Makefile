#
# Check that the examples work or fail as expected.
# We want them to match and validate the snippets shown in the documentation.
#
.PHONY: examples
examples:
	$(MAKE) -C examples
	$(MAKE) -C examples test
