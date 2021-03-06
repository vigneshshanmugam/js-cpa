"use strict";

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const readline = require("readline");
const program = require("commander");
const mkdirp = require("mkdirp");

const CPA = require("./cpa");
const Reporter = require("./reporter");
const HTMLReporter = require("./html-reporter");

program
  .version(require("../package.json").version)
  .usage("[options] <file ...>")
  .option(
    "-f, --filelist",
    "read filelist from STDIN stream - if/when you cross ARG_MAX. eg: ls *.js | js-cpa -f"
  )
  .option("-m, --module", "parse files with sourceType=module")
  .option(
    "-l, --language <language>",
    "language (js|ts|flow)",
    /^(js|ts|flow)$/i,
    "js"
  )
  .option(
    "-t, --threshold <n>",
    "Threshold (in bytes)",
    x => parseInt(x, 10),
    100
  )
  .option("-C, --no-colors", "Disable colors in output")
  .option(
    "-R, --report <type>",
    "Generate HTML report",
    /^(html|term)$/i,
    "term"
  )
  .option(
    "-o, --report-file <location>",
    "/path/to/report.html",
    "./js-cpa-report.html"
  )
  .parse(process.argv);

const cpaOpts = {
  sourceType: program.module ? "module" : "script",
  language: program.language,
  threshold: program.threshold
};

if (program.filelist) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  const cpa = new CPA(cpaOpts);
  const errors = [];

  rl.on("line", input => {
    clearBuffer();
    currentProgress(input);
    try {
      cpa.add(fs.readFileSync(input, "utf-8").toString(), { filename: input });
    } catch (err) {
      errors.push({ file: input, err });
    }
  });

  rl.on("close", () => {
    clearBuffer();
    try {
      if (program.report === "html") {
        generateHTMLReport(cpa, program.reportFile);
      } else {
        print(cpa);
      }
    } catch (err) {
      errors.push({ err });
    }

    if (errors.length > 0) {
      process.stderr.write(
        "The following files were ignored because of errors:\n"
      );

      errors.map(e =>
        process.stderr.write(e.file + "\n" + e.err.message + "\n")
      );

      const otherErrors = errors.filter(e => !e.file);

      if (otherErrors.length > 0) {
        process.stderr.write("Other errors:\n");
        otherErrors.map(e => {
          process.stderr.write(e.message + "\n");
        });
      }

      process.exit(1);
    }
  });
} else if (process.stdin.isTTY) {
  const files = program.args;
  if (files.length < 1) {
    throw new Error("Need at least 1 file to process");
  }
  const cpa = new CPA(cpaOpts);
  for (const file of files) {
    cpa.add(fs.readFileSync(file, "utf-8").toString(), { filename: file });
  }
  if (program.report === "html") {
    generateHTMLReport(cpa, program.reportFile);
  } else {
    print(cpa);
  }
} else {
  // handle piped content
  const inputChunks = [];
  process.stdin.resume();
  process.stdin.setEncoding("utf-8");
  process.stdin.on("data", chunk => inputChunks.push(chunk));
  process.stdin.on("end", () => {
    const code = inputChunks.join();
    const cpa = new CPA(cpaOpts);
    cpa.add(code, { filename: "dummy" + Math.ceil(Math.random() * 10) });
    if (program.report === "html") {
      generateHTMLReport(cpa, program.reportFile);
    } else {
      print(cpa);
    }
  });
}

function print(cpa) {
  const duplicates = cpa.findOptimalDuplicates();
  const report = new Reporter(duplicates);
  process.stdout.write(report.toString({ colors: program.colors }));
  process.exit(0);
}

function generateHTMLReport(cpa, reportFile) {
  const duplicates = cpa.findOptimalDuplicates();
  const sources = cpa.getSource();
  const report = new HTMLReporter(duplicates, sources);

  report
    .renderFile()
    .then(({ type, warning, html }) => {
      if (type === HTMLReporter.TYPE_WARNING) {
        warn(warning);
        process.exit(1);
      } else if (type === HTMLReporter.TYPE_RESULT) {
        mkdirp.sync(path.dirname(reportFile));
        fs.writeFileSync(reportFile, html, "utf-8");
        write("CPA report generated at " + reportFile);
        process.exit(0);
      } else {
        error("Unknown Error from HTML Reporter");
        process.exit(1);
      }
    })
    .catch(err => {
      error(err.message);
      process.exit(1);
    });

  function warn(message) {
    process.stderr.write(
      program.colors ? chalk.yellow(chalk.bold(message)) : message
    );
  }
  function write(message) {
    process.stderr.write(program.colors ? chalk.green(message) : message);
  }
  function error(message) {
    process.stderr.write(program.colors ? chalk.red(message) : message);
  }
}

function clearBuffer() {
  process.stderr.clearLine();
}

function currentProgress(file) {
  process.stderr.write(`Current File: ${file}\r`);
}
