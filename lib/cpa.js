"use strict";

const { parse } = require("babylon");
const t = require("babel-types");
const dfs = require("./dfs");
const hashcons = require("./hash");

// Used to mark a node as Duplicate
// refer below findOptimalDuplicates description for more info
const DUPLICATE = Symbol("DUPLICATE");

module.exports = class CPA {
  constructor(
    { sourceType = "script", language = "js", threshold = 100 } = {}
  ) {
    // hash consing
    this.hashes = new Map();
    // to find optimal duplicates
    this.ids = new Map();
    this.sources = new Map();

    this.sourceType = sourceType;
    this.language = language;
    this.threshold = threshold;
  }

  add(
    code,
    {
      filename = "",
      sourceType = this.sourceType,
      language = this.language
    } = {}
  ) {
    this.sources.set(filename, code);

    const languagePlugins = [];
    switch (language) {
      case "flow":
        languagePlugins.push("flow");
        break;
      case "ts":
        languagePlugins.push("typescript");
        break;
    }

    const root = parse(code, {
      sourceFilename: filename,
      sourceType: sourceType,
      plugins: [
        ...languagePlugins,
        "jsx",
        "doExpressions",
        "objectRestSpread",
        "decorators2",
        "classProperties",
        "classPrivateProperties",
        "exportExtensions",
        "asyncGenerators",
        "functionBind",
        "functionSent",
        "dynamicImport",
        "numericSeparator",
        "optionalChaining",
        "importMeta",
        "bigInt"
      ]
    }).program;

    this.addNode(root, filename);
  }

  /**
   * Performs a DFS Post Order traversal from the root and
   * hashconses to `this.hashes`
   *
   * @param {ASTNode} root
   * @param {String} id
   */
  addNode(root, id /* for example filename */) {
    this.ids.set(id, root);

    dfs(root, {
      // post order traversal callback
      exit: node => {
        if (!t.isFunction(node)) {
          return;
        }

        if (node.end - node.start < this.threshold) {
          return;
        }

        if (!node.hash) {
          node.hash = hashcons(node);
        }

        if (!node.sourceCode) {
          node.sourceCode = this.sources.get(id).slice(node.start, node.end);
        }

        if (this.hashes.has(node.hash)) {
          // set the current node as a duplicate
          node[DUPLICATE] = true;
          const duplicateNode = this.hashes.get(node.hash);
          // set the previously pushed node as duplicate
          duplicateNode[0].node[DUPLICATE] = true;
          duplicateNode.push({ node, id });
        } else {
          this.hashes.set(node.hash, [{ node, id }]);
        }
      }
    });
  }

  /**
   * From the computed hashes `this.hashes`, filters the nodes that are
   * duplicates - i.e at least 2 entries for the same hash
   *
   * @return [[duplicateNode, ...], ...]
   */
  findAllDuplicates() {
    return Array.from(this.hashes.values()).filter(dups => dups.length > 1);
  }

  /**
   * This does a DFS Pre Order traversal from the root till a duplicate node
   * is reached and ignores traversing the nodes inside this duplicate node
   *
   * This is because,
   *
   * function foo() {
   *   function dup1() {}
   *   function dup2() {}
   * }
   *
   * function bar() {
   *   function dup1() {}
   *   function dup2() {}
   * }
   *
   * Here function dup1, dup2, dup3 and dup4 are duplicates but since,
   * foo and bar are already duplicates, it is not required to extract the
   * nodes inside the duplicates as it creates more noise
   *
   * @return [[duplicateNode, ...], ...]
   */
  findOptimalDuplicates() {
    const duplicates = {};
    for (const [id, root] of this.ids.entries()) {
      dfs(root, {
        // pre-order traversal callback
        enter(node) {
          if (node[DUPLICATE]) {
            if (hop(duplicates, node.hash)) {
              duplicates[node.hash].push({ node, id });
            } else {
              duplicates[node.hash] = [{ node, id }];
            }

            // skip traversing the current node's children
            // once we found that the node itself is a duplicate
            node.shouldSkip = true;
          }
        }
      });
    }
    return Object.keys(duplicates).map(key => duplicates[key]);
  }
};

function hop(o, key) {
  return Object.prototype.hasOwnProperty.call(o, key);
}
