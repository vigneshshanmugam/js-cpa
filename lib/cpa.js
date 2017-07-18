"use strict";

const { parse } = require("babylon");
const t = require("babel-types");
const dfs = require("./dfs");
const hashcons = require("./hash");

module.exports = class CPA {
  constructor({ sourceType = "script", language = "js" } = {}) {
    // hash consing
    this.hashes = new Map();
    // to find optimal duplicates
    this.ids = new Map();
    this.sourceType = sourceType;
    this.language = language;
  }

  add(
    code,
    {
      filename = "",
      sourceType = this.sourceType,
      language = this.language
    } = {}
  ) {
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

  addNode(root, id /* for example filename */) {
    this.ids.set(id, root);

    dfs(root, {
      // post order traversal callback
      exit: node => {
        if (!t.isFunction(node)) {
          return;
        }
        if (!node.hash) {
          node.hash = hashcons(node);
        }

        if (this.hashes.has(node.hash)) {
          // set the current node as a duplicate
          node.isDuplicate = true;
          const duplicateNode = this.hashes.get(node.hash);
          // set the previously pushed node as duplicate
          duplicateNode[0].node.isDuplicate = true;
          duplicateNode.push({ node, id });
        } else {
          this.hashes.set(node.hash, [{ node, id }]);
        }
      }
    });
  }

  findAllDuplicates() {
    return Array.from(this.hashes.values()).filter(dups => dups.length > 1);
  }

  findOptimalDuplicates() {
    const duplicates = {};
    for (const [id, root] of this.ids.entries()) {
      dfs(root, {
        // pre-order traversal callback
        enter(node) {
          if (node.isDuplicate) {
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
