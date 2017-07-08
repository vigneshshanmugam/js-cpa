const { readFileSync } = require("fs");
const { parse } = require("babylon");
const cpa = require("./lib/cpa");

const filename = process.argv[2];
if (!filename) {
  console.error("No filename specified");
  process.exit(0);
}
const input = readFileSync(filename, "utf-8");

const ast = parse(input, {
  sourceFilename: filename
}).program;

cpa.run(ast, filename);
