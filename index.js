const { readFileSync } = require("fs");
const path = require("path");
const { parse } = require("babylon");
const cpa = require("./lib/cpa");

const getBundle = (file) =>
  readFileSync(file, "utf-8");

const findMatches = (file) => {
  const input = getBundle(file);
  const ast = parse(input, {
    sourceFilename: file
  }).program;
  return cpa.run(ast, file);
};

module.exports = findMatches;
