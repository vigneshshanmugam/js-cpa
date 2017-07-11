jest.mock("chalk");

const findMatches = require("../");
const { parse } = require("babylon");
const path = require("path");
const fs = require("fs");

const fixturesDir = path.join(__dirname, "fixtures");

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
  const noMatch = findMatches(path.join(fixturesDir, "nomatch.js"));
  expect(result).toMatchSnapshot();
});

test("should print matches with largest subexpression in the tree", () => {
  const match = findMatches(path.join(fixturesDir, "match.js"));
  expect(result).toMatchSnapshot();
});

test("should print no matches again", () => {
  const match = findMatches(path.join(fixturesDir, "nomatch.js"));
  expect(result).toMatchSnapshot();
});
