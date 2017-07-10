const { readFileSync } = require("fs");
const path = require("path");
const { parse } = require("babylon");
const cpa = require("./lib/cpa");

const getBundle = (context, file) =>
  readFileSync(path.join(context, file), "utf-8");

const findSimilar = (context, file) => {
  const input = getBundle(context, file);
  const ast = parse(input, {
    sourceFilename: file
  }).program;
  return cpa.run(ast, file);
};

module.exports = findSimilar;
