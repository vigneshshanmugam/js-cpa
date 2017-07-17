"use strict";

const { parse } = require("babylon");
const t = require("babel-types");
const dfs = require("./dfs");
const hashcons = require("./hash");

module.exports = class CPA {
  constructor() {
    // hash consing
    this.hashes = {};
    // to find optimal duplicates
    this.ids = new Map();
  }

  add(code, filename) {
    const root = parse(code, {
      sourceFilename: filename
    }).program;
    this.addNode(root, filename);
  }

  addNode(root, id /* for example filename */) {
    this.ids.set(id, root);

    dfs(root, {
      // post order traversal callback
      exit: node => {
        if (t.isProgram(node) || !t.isFunction(node)) {
          return;
        }
        if (!node.hash) {
          node.hash = hashcons(node);
        }

        if (hop(this.hashes, node.hash)) {
          // set the current node as a duplicate
          node.isDuplicate = true;
          // set the previously pushed node as duplicate
          this.hashes[node.hash][0].node.isDuplicate = true;
          this.hashes[node.hash].push({ node, id });
        } else {
          this.hashes[node.hash] = [{ node, id }];
        }
      }
    });
  }

  findAllDuplicates() {
    const duplicates = {};
    for (const hash of Object.keys(this.hashes)) {
      if (this.hashes[hash].length > 1) {
        duplicates[hash] = this.hashes[hash];
      }
    }
    return Object.keys(duplicates).map(key => duplicates[key]);
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
