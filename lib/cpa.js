const t = require("babel-types");
const dfsPostOrder = require("./dfs");
const Reporter = require("./reporter");

class CPA {
  constructor(node, file) {
    this.node = node;
    this.file = file;
    this.labels = [];
    this.handleNode = this.handleNode.bind(this);
    this.state = new Map();
    this.duplicates = [];
  }

  construct(node) {
    let ret = node.type + "-";
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

  getPattern(node) {
    const keys = t.VISITOR_KEYS[node.type];
    if (!keys) return;

    let pattern = this.construct(node);

    for (const key of keys) {
      const subNode = node[key];

      if (Array.isArray(subNode)) {
        for (const child of subNode) {
          if (child) {
            pattern += this.getPattern(child);
          }
        }
      } else if (subNode) {
        pattern += this.getPattern(subNode);
      }
    }
    return pattern;
  }

  handleNode(node) {
    if (t.isProgram(node) || !t.isFunction(node)) {
      return;
    }

    if (!node.pattern) {
      node.pattern = this.getPattern(node);
    }

    if (this.state.has(node.pattern)) {
      // duplicate
      this.duplicates.push({
        node,
        source: this.state.get(node.pattern)
      });
    } else {
      this.state.set(node.pattern, node);
    }
  }

  filterRedundancies() {
    const { duplicates } = this;

    const filtered = [];

    for (const dup of duplicates) {
      let hasNoAncestors = true;
      for (const dup2 of duplicates) {
        if (this.isDescendant(dup, dup2)) {
          hasNoAncestors = false;
          break;
        }
      }
      if (hasNoAncestors) {
        filtered.push(dup);
      }
    }

    return filtered;
  }

  remap(duplicates) {
    const dups = new Map();

    for (const dup of duplicates) {
      if (!dups.has(dup.source)) {
        dups.set(dup.source, []);
      }
      dups.get(dup.source).push(dup.node);
    }

    return dups;
  }

  // a is a descendant of b
  isDescendant({ node: a }, { node: b }) {
    let current = a.parent;
    do {
      if (current === b) return true;
    } while ((current = current.parent));
    return false;
  }

  run() {
    dfsPostOrder(this.node, this.handleNode);
    const dupsMap = this.remap(this.filterRedundancies());
    const repoter = new Reporter(this.file);
    repoter.print(dupsMap);
  }
}

module.exports = CPA;
