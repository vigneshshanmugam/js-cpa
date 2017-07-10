#!/usr/bin/env node

const findMatches = require("./index");

const filename = process.argv[2];
if (!filename) {
  console.error("No filename specified");
  process.exit(0);
}

findMatches(process.cwd(), filename);
