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
