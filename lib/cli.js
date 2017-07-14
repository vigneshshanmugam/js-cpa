"use strict";

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const chalk = require("chalk");

const cpa = require("./index");
const Reporter = require("./reporter");
const Result = require("./result");

const files = process.argv.slice(2);

const r = new Result();

files
  .map(file => [file, cpa(fs.readFileSync(file, "utf-8").toString())])
  .map(([file, duplicates]) => r.add({ duplicates, file }));

// const r = new Reporter(file);
// r.print(result);
// console.log(merge({ duplicates, file }));

// r.add({ duplicates, file });

console.log(r.toString());
