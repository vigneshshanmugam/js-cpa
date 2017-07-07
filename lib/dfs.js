const t = require("babel-types");

module.exports = function dfsPostOrder(
  node,
  callback,
  parent = null,
  parentKey = "",
  isContainer = false
) {
  if (!node) {
    return;
  }
  const keys = getFields(node);
  if (!keys) return;

  for (const key of keys) {
    const subNode = node[key];

    if (Array.isArray(subNode)) {
      for (const child of subNode) {
        dfsPostOrder(child, callback, node, key, true);
      }
    } else {
      dfsPostOrder(subNode, callback, node, key, false);
    }
  }

  Object.assign(node, {
    parent,
    parentKey,
    isContainer
  });
  callback(node);
};

function getFields(node) {
  return t.VISITOR_KEYS[node.type];
}
