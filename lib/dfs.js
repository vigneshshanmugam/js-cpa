"use strict";

const t = require("babel-types");

module.exports = function dfs(
  root,
  /**
   * Callbacks:
   *
   * enter: pre-order callback
   * exit: post-order callback
   */
  { enter = () => {}, exit = () => {} } = {}
) {
  return _dfs(root);

  function _dfs(node, parent = null, parentKey = "", isContainer = false) {
    if (!node || node.shouldSkip) {
      return;
    }

    // don't update the parent info every single time
    if (node.parent !== parent) {
      Object.assign(node, {
        parent,
        parentKey,
        isContainer
      });
    }

    // pre-order call
    enter(node);

    // after entering if the traversor decides to skip the node,
    // just call the exit and skip traversing the children
    if (!node.shouldSkip) {
      const keys = getFields(node);
      if (!keys) return;

      for (const key of keys) {
        const subNode = node[key];

        if (Array.isArray(subNode)) {
          for (const child of subNode) {
            _dfs(child, node, key, true);
          }
        } else {
          _dfs(subNode, node, key, false);
        }
      }
    }

    // post-order call
    exit(node);
  }
};

function getFields(node) {
  return t.VISITOR_KEYS[node.type];
}
