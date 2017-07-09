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
      let message = `No matches found for ${filePath} \n`;
      this.log(message, "green", true);
      return;
    }

    this.log(`\nPrinting matches for file - ${filePath}\n\n`, "red", true);

    for (const [source, dups] of dupsMap.entries()) {
      const { code: sourceCode } = generate(source);

      this.log(`Found ${dups.length + 1} matches\n`, "cyan", true);

      let message = `\nLoc - ${this.getLocation(source)}\n`;
      this.log(`${message}${sourceCode}\n`);

      this.log(
        dups.map(dup => {
          let message = `\nLoc - ${this.getLocation(dup)}\n`;
          return `${message}${generate(dup).code}\n`;
        })
      );

      this.newline();
    }
  }

  newline() {
    this.log("\n");
    for (let i = 0; i < process.stdout.columns; i++) {
      this.log(SEPARATOR);
    }
    this.log("\n");
  }
};
