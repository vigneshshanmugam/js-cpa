"use strict";

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const program = require("commander");

const CPA = require("./cpa");
const Reporter = require("./reporter");

program
  .version(require("../package.json").version)
  .option(
    "-f, --filelist",
    "Read filelist from stdio stream - if/when you cross ARG_MAX. eg: ls *.js | js-cpa -f"
  )
  .option("-m, --module", "Parse files with sourceType=module")
  .parse(process.argv);

const cpaOpts = {
  sourceType: program.module ? "module" : "script"
};

if (program.filelist) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  const cpa = new CPA(cpaOpts);

  rl.on("line", input => {
    clearBuffer();
    currentProgress(input);
    cpa.add(fs.readFileSync(input, "utf-8").toString(), input);
  });

  rl.on("close", input => {
    clearBuffer();
    print(cpa);
    process.exit(0);
  });
} else if (process.stdin.isTTY) {
  const files = program.args;
  if (files.length < 1) {
    throw new Error("Need at least 1 file to process");
  }
  const cpa = new CPA(cpaOpts);
  for (const file of files) {
    cpa.add(fs.readFileSync(file, "utf-8").toString(), file);
  }
  print(cpa);
} else {
  // handle piped content
  const inputChunks = [];
  process.stdin.resume();
  process.stdin.setEncoding("utf-8");
  process.stdin.on("data", chunk => inputChunks.push(chunk));
  process.stdin.on("end", () => {
    const code = inputChunks.join();
    const cpa = new CPA(cpaOpts);
    cpa.add(code, "dummy" + Math.ceil(Math.random() * 10));
    print(cpa);
    process.exit(0);
  });
}

function print(cpa) {
  const report = new Reporter(cpa.findOptimalDuplicates());
  process.stdout.write(report.toString());
}

function clearBuffer() {
  process.stderr.write(
    Array.from({ length: process.stdout.columns - 1 }).join(" ") + "\r"
  );
}

function currentProgress(file) {
  process.stderr.write(`Current File: ${file}\r`);
}
