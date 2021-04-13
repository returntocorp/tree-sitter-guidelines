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
