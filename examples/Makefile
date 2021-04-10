#
# For those who prefer to call 'make' and 'make test'.
# See 'package.json' for the actual build commands.
#

.PHONY: build
build:
	# I couldn't find a way to have 'build-all' run as part of
	# 'npm install' while preserving its output.
	npm install
	./build-all

.PHONY: test
test:
	npm test
