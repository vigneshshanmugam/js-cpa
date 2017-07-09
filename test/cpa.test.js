jest.mock("chalk");

const cpa = require("../lib/cpa");
const { parse } = require("babylon");
const path = require("path");
const fs = require("fs");
const fixturesDir = path.join(__dirname, "fixtures");

const getBundle = file =>
  fs.readFileSync(path.join(fixturesDir, file), "utf-8");

const getOutput = file => {
  const input = getBundle(file);
  const ast = parse(input, {
    sourceFilename: file
  }).program;
  return cpa.run(ast, file);
};

let result,
  write = process.stdout.write,
  columns = process.stdout.columns;

beforeEach(() => {
  result = "";
  columns = 0;
  process.stdout.write = msg => {
    result += msg;
  };
});

afterEach(() => {
  process.stdout.write = write;
  process.stdout.columns = columns;
});

test("should print no matches found", () => {
  const noMatch = getOutput("nomatch.js");
  expect(result).toMatchSnapshot();
});

test("should print matches with largest subexpression in the tree", () => {
  const match = getOutput("match.js");
  expect(result).toMatchSnapshot();
});
