const t = require("babel-types");

// Hashing all the statments in a line
module.exports = class Label {
  constructor() {
    this.labels = [];
  }

  pattern(node) {
    if (t.isFunction(node) && node.id.name) {
      return this.function(node);
    }

    if (t.isVariableDeclaration(node)) {
      return this.variable(node);
    }

    if (t.isIdentifier(node) || t.isBlockStatement()) {
      return;
    }
  }

  variable(node) {
    let pattern = "";

    if (!node.declarations) {
      return;
    }

    if (!Array.isArray(node.kind)) {
      pattern += node.kind;
    }

    const decls = node.declarations;
    for (let d = 0; d < decls.length; d++) {
      const { id, init } = decls[d];
      pattern += id.name;
      if (t.isLiteral(init)) {
        pattern += init.value;
      }
    }
    return pattern;
  }

  function(node) {
    let pattern = "";

    if (t.isFunctionDeclaration(node)) {
      pattern += "FD";
    } else if (t.isFunctionExpression(node)) {
      pattern += "FE";
    } else if (t.isArrowFunctionExpression(node)) {
      pattern += "AFE";
    }

    if (node.id) {
      const { name } = node.id;
      pattern += name;
    }
    return pattern;
  }
};
