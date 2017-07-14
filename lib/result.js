/**
 * Generate a Result Map out of duplicates array
 *
 * Result is of the type
 *
 * result = Map<Source, Array<Node> >
 * where Source = ASTNode <Object>
 *   and Node   = ASTNode <Object>
 */
"use strict";

const chalk = require("chalk");
const path = require("path");
const generate = require("babel-generator").default;
const SEPARATOR = "-";

module.exports = class Result {
  constructor() {
    this.result = new Map();
  }

  add(...results) {
    for (const r of results) {
      const { duplicates, file } = r;
      for (const dups of duplicates) {
        const currentPattern = dups[0].pattern;
        if (this.result.has(currentPattern)) {
          this.result
            .get(currentPattern)
            .push(...dups.map(dup => ({ file, node: dup })));
        } else {
          this.result.set(
            currentPattern,
            dups.map(dup => ({ file, node: dup }))
          );
        }
      }
    }
  }

  toString({ colors = true } = {}) {
    const dups = [...this.result.values()];
    let str = "";

    if (dups.length === 0) {
      str += "No matches found";
      return str;
    }

    str += title(`Found ${dups.length} matches\n`);

    for (const [i, val] of dups.entries()) {
      str += subtitle(`\nDuplicate ${i}\n\n`);
      for (const { file, node } of val) {
        str += `${file} → ${this.getLocAndCode(node)}\n\n`;
      }
    }

    return str;

    function title(message) {
      return colors ? chalk.cyan(chalk.bold(message)) : message;
    }
    function subtitle(message) {
      return colors ? chalk.bold(message) : message;
    }
  }

  getPath(file) {
    if (file.charAt(0) !== "/") {
      return path.resolve(process.cwd(), file);
    }
    return path.relative(process.cwd(), file);
  }

  getLocation(node) {
    const { loc: { start, end } } = node;
    return `${start.line}:${end.line}`;
  }

  getLocAndCode(node) {
    let message = `${this.getLocation(node)}\n`;
    const { code } = generate(node, { comments: false });
    return `${message}${code}`;
  }

  newline() {
    this.log("\n");
    for (let i = 0; i < process.stdout.columns; i++) {
      this.log(SEPARATOR);
    }
    this.log("\n");
  }
};
