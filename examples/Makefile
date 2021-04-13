#
# For those who prefer to call 'make' and 'make test'.
# See 'package.json' for the actual build commands.
#

.PHONY: test
test:
	# I couldn't find a way to have 'test-all' run as part of
	# 'npm install' while preserving its output.
	npm install
	./test-all
