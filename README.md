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

This is a growing collection of problems that a grammar developer may
face, with tips on how to deal with them. Please [create an
issue](https://github.com/returntocorp/tree-sitter-guidelines/issues)
for questions you'd like to be covered. Each example comes with
complete and valid source code to be found in the
[`examples/grammars`](examples/grammars) folder. To try out the
examples by yourself, clone this git repo and run
`make`. You'll need nodejs and possibly other things. Look into the CI
setup ([`.circleci/config.yaml`](.circleci/config.yaml)) for a
reproducible build on ubuntu.

The main reference for writing tree-sitter grammars remains the
[official tree-sitter
documentation](https://tree-sitter.github.io/tree-sitter/creating-parsers). In
particular, it documents the various constructs available to define grammars.

### Simple grammar with no difficulty

This is a full `grammar.js` file which parses a word followed by a
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

Valid inputs:
```
hello 123
```

```
hello123
```

```
hello
123
```

Source code: [hello](examples/grammars/hello)

### Static conflict

The following grammar fails to compile due to a conflict. The conflict
is called "static" because it is detected when compiling the
grammar, not when parsing some input.

```js
module.exports = grammar({
  name: "static_conflict_fail",
  rules: {
    // entry point
    exp: $ => choice(
      $.exp1,
      $.exp2,
      $.ident
    ),

    exp1: $ => seq($.exp, $.exp),
    exp2: $ => seq($.exp, $.exp),

    ident: $ => /[a-z]+/
  }
});
```

The example makes it clear there will be a conflict because the rules
`exp1` and `exp2` are identical and used as an alternative for
`exp`. `tree-sitter generate` shows where the conflict occurs and
makes suggestions for resolving it:

```
Unresolved conflict for symbol sequence:

  exp  exp  •  ident  …

Possible interpretations:

  1:  (exp1  exp  exp)  •  ident  …
  2:  (exp2  exp  exp)  •  ident  …
  3:  exp  (exp1  exp  •  exp)
  4:  exp  (exp2  exp  •  exp)

Possible resolutions:

  1:  Specify a higher precedence in `exp1` and `exp2` than in the other rules.
  2:  Specify a higher precedence in `exp1` than in the other rules.
  3:  Specify a higher precedence in `exp2` than in the other rules.
  4:  Specify a left or right associativity in `exp1` and `exp2`
  5:  Add a conflict for these rules: `exp1`, `exp2`
```

There's a lot going on in this message. We'll take a closer look
later. For now, let's just assume that the resolution is obvious.

We solve the conflict statically by
specifying that rule `exp1` has precedence over rule `exp2`. We use
the newer way (since tree-sitter 0.19), which consists in specifying
groups of rules. Within each group, a rule has a higher priority than
all the rules that follow. Our solution is:

```js
module.exports = grammar({
  name: "static_conflict_solved",

  // Partial ordering of rules by precedence.
  precedences: $ => [
    [
      // strongest
      $.exp1, // stronger than the next element in the group
      $.exp2,
      // weakest
    ]
  ],

  rules: {
    // entry point
    exp: $ => choice(
      $.exp1,
      $.exp2,
      $.ident
    ),

    exp1: $ => seq($.exp, $.exp),
    exp2: $ => seq($.exp, $.exp),

    ident: $ => /[a-z]+/
  }
});
```

The input `a b c d` is then parsed into the following tree:
```
(exp
  (exp1
    (exp
      (exp1
        (exp
          (exp1
            (exp (ident))
            (exp (ident)))
        )
        (exp (ident))
      )
    )
    (exp (ident))
  )
)
```

Note that the default is left associativity. If we show only
the parentheses around each `exp1`, the parse tree is `(((a b) c) d)`.
Right associativity can be specified with a `prec.right` annotation
and it would give us `(a (b (c d)))` instead (refer to the tree-sitter
manual).

Source code:
* [static-conflict-fail](examples/grammars/static-conflict-fail)
* [static-conflict-solved](examples/grammars/static-conflict-solved)
