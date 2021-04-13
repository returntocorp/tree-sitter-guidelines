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
