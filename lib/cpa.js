const t = require("babel-types");
const generate = require("babel-generator").default;
const Stack = require("./stack");

module.exports = class CPA {
  constructor(node) {
    this.root = node;
    this.fnStack = new Stack();
    this.temp = "";
    this.labels = [];
    this.patterns = [];
    this.handleNode = this.handleNode.bind(this);
  }

  print() {
    console.log("Labels", this.labels);
  }

  walk(node, callback) {
    return t.traverseFast(node, callback, { pattern: "" });
  }

  allocateInStack(fnNode) {
    // empty stack
    if (this.fnStack.isEmpty()) {
      this.fnStack.push(fnNode.end);
      this.temp += this.createPattern(fnNode);
      // this.labels.push("{");
    } else {
      // we are in another fn scope
      let total = this.fnStack.itemsToPop(fnNode.end);
      while (total--) {
        this.fnStack.pop();
        this.pushLabel();
        // this.labels.push("}");
      }
      this.pushLabel();
      this.temp += this.createPattern(fnNode);
      // push child fn's
      this.fnStack.push(fnNode.end);
      // this.labels.push("{");
    }
  }

  pushLabel() {
    this.temp && this.labels.push(this.temp);
    this.temp = "";
  }

  generateHash(str) {
    let hash = 0;
    if (str.length == 0) {
      return hash;
    }
    for (let i = 0; i < str.length; i++) {
      const chr = str.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
    }
    return hash;
  }

  handleNode(node) {
    if (t.isProgram(node)) {
      return;
    }

    if (!t.isFunction(node)) {
      this.temp += this.createPattern(node);
    }

    if (t.isFunction(node)) {
      this.allocateInStack(node);
    }
  }

  createPattern({ type }) {
    return type + "-";
  }

  endNodes() {
    let length = this.fnStack.length();
    while (length--) {
      this.pushLabel();
      // this.labels.push("}");
    }
  }

  run(filename) {
    this.walk(this.root, this.handleNode);
    // stupid hack to end the last fn's that have not closed
    this.endNodes();
    this.print();
  }
};
