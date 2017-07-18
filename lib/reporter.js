const chalk = require("chalk");
const unpad = require("./unpad");

module.exports = class Reporter {
  constructor(duplicates) {
    this.duplicates = duplicates;
  }

  toString({ colors = true, newline = true } = {}) {
    const dups = this.duplicates;
    let str = "";

    if (dups.length === 0) {
      str += "No matches found\n";
      return str;
    }

    str += title(`Found ${dups.length} matches\n`);

    for (const [i, val] of dups.entries()) {
      str += title2(`\nDuplicate ${i + 1}\n\n`);
      for (const { id, node } of val) {
        str += subtitle(`${id}:${this.getLocation(node)}\n`);
        str += this.getCode(node) + "\n\n";
      }
      if (newline && i !== dups.length - 1) str += this.newline();
    }

    return str;

    function title(message) {
      return colors ? chalk.cyan(chalk.bold(message)) : message;
    }
    function title2(message) {
      return colors ? chalk.yellow(chalk.bold(message)) : message;
    }
    function subtitle(message) {
      return colors ? chalk.dim(message) : message;
    }
  }

  getLocation(node) {
    const { loc: { start, end } } = node;
    return `${start.line}:${end.line}`;
  }

  getCode(node) {
    return unpad(node.sourceCode);
  }

  newline() {
    let ret = "";
    for (let i = 0; i < process.stdout.columns; i++) {
      ret += "-";
    }
    return ret;
  }
};
