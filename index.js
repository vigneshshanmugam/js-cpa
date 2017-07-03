const { readFileSync } = require("fs");
const { parse } = require("babylon");
const CPA = require("./lib/cpa");

const filename = process.argv[2];
if (!filename) {
  console.error("no filename specified");
  process.exit(0);
}
const input = readFileSync(filename, "utf-8");

const ast = parse(input, {
  ranges: false,
  location: false
}).program;

new CPA(ast).run();
