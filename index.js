const { readFileSync } = require("fs");
const { parse } = require("babylon");
const Dedupe = require("./lib/dedupe");

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

const dedupe = new Dedupe(ast);

dedupe.run();
