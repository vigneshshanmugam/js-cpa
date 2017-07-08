const chalk = require("chalk");
const path = require("path");
const generate = require("babel-generator").default;
const SEPARATOR = "-";

module.exports = class Reporter {
  constructor(file) {
    this.file = file;
  }

  log(msg, color = "grey", bold = false) {
    let fn = bold ? chalk.bold[color] : chalk[color];
    process.stdout.write(fn(msg));
  }

  getPath(file) {
    if (file.charAt(0) !== "/") {
      return path.resolve(process.cwd(), file);
    }
    return path.relative(process.cwd(), file);
  }

  getLocation(node) {
    const { loc: { start, end } } = node;
    return `${start.line} : ${end.line}`;
  }

  print(dupsMap) {
    let filePath = this.getPath(this.file);
    if (dupsMap.size === 0) {
      let message = `No duplicates found on ${filePath} \n`;
      this.log(message, "green", true);
      return;
    }

    this.log(`\nPrinting duplicates for file - ${filePath}\n\n`, "red", true);

    for (const [source, dups] of dupsMap.entries()) {
      const { code: sourceCode } = generate(source);

      this.log(sourceCode, "white");

      this.log(`\nhas ${dups.length} following duplicates\n`, "cyan");

      this.log(
        dups.map(dup => {
          let message = `\nLoc - ${this.getLocation(dup)}\n`;
          return `${message}${generate(dup).code}`;
        })
      );

      this.newline();
    }
  }

  newline() {
    console.log("\n");
    for (let i = 0; i < process.stdout.columns; i++) {
      this.log(SEPARATOR);
    }
    console.log("\n");
  }
};
