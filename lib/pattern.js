"use strict";

const t = require("babel-types");

module.exports = makePattern;

function makePattern(node) {
  const keys = t.VISITOR_KEYS[node.type];
  if (!keys) return;

  let pattern = handleType(node);

  for (const key of keys) {
    const subNode = node[key];

    if (Array.isArray(subNode)) {
      for (const child of subNode) {
        if (child) {
          pattern += makePattern(child);
        }
      }
    } else if (subNode) {
      pattern += makePattern(subNode);
    }
  }

  return pattern;
}

function handleType(node) {
  let ret = "";

  if (t.isFunctionDeclaration(node) || t.isFunctionExpression(node)) {
    ret += "Function-";
  } else {
    ret += node.type + "-";
  }

  if (t.isLiteral(node)) {
    ret += node.value + "-";
  } else if (
    t.isIdentifier(node) &&
    (((t.isObjectProperty(node.parent) ||
      t.isObjectMethod(node.parent) ||
      t.isClassMethod(node.parent)) &&
      node.parentKey === "key") ||
      (t.isMemberExpression(node.parent) && node.parentKey === "property"))
  ) {
    ret += node.name;
  } else if (t.isFunction(node)) {
    ret += node.generator ? "generator-" : "";
    ret += node.async ? "async-" : "";
  }

  return ret;
}
