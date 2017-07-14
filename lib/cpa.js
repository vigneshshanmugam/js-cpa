"use strict";

const t = require("babel-types");
const dfsPostOrder = require("./dfs");
const makePattern = require("./pattern");
const generate = require("babel-generator").default;

module.exports = cpa;

function cpa(root) {
  const duplicates = new Map();

  dfsPostOrder(root, node => {
    if (!t.isFunction(node)) {
      return;
    }

    if (!node.pattern) {
      node.pattern = makePattern(node);
    }

    if (duplicates.has(node.pattern)) {
      duplicates.get(node.pattern).push(node);
    } else {
      duplicates.set(node.pattern, [node]);
    }
  });

  return []
    .concat(...[...duplicates.values()].filter(dups => dups.length > 1))
    .filter((node, _, arr) => !arr.some(node2 => isDescendant(node, node2)))
    .reduce((acc, cur) => {
      if (acc.length > 0 && acc[acc.length - 1][0].pattern === cur.pattern) {
        acc[acc.length - 1].push(cur);
      } else {
        acc.push([cur]);
      }
      return acc;
    }, []);
}

// a is a descendant of b
function isDescendant(a, b) {
  let current = a.parent;
  do {
    if (current === b) return true;
  } while ((current = current.parent));
  return false;
}
