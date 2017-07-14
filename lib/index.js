"use strict";

const { parse } = require("babylon");
const cpa = require("./cpa");
const Reporter = require("./reporter");

module.exports = function cparun(code, filename) {
  const root = parse(code, {
    sourceFilename: filename
  }).program;

  return cpa(root);
};
