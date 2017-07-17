"use strict";

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const chalk = require("chalk");
const CPA = require("./cpa");
const Reporter = require("./reporter");

const files = process.argv.slice(2);

const cpa = new CPA();

files.map(file => cpa.add(fs.readFileSync(file, "utf-8").toString(), file));

const report = new Reporter(cpa.findOptimalDuplicates());

process.stdout.write(report.toString());
