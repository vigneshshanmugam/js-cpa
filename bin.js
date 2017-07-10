#!/usr/bin/env node

const findSimilar = require("./index");

const filename = process.argv[2];
if (!filename) {
  console.error("No filename specified");
  process.exit(0);
}

findSimilar(process.cwd(), filename);
