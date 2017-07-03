const t = require("babel-types");
const Label = require("./label");
const Stack = require("./stack");

module.exports = class CPA {
  constructor(node) {
    this.root = node;
    this.label = new Label();
    this.dict = new Map();
    this.fnStack = new Stack();
    this.labelArr = [];
    this.isLast = false;
    this.handleNode = this.handleNode.bind(this);
  }

  print() {
    console.log("Labels", this.labelArr);

    // for (const [key, value] of this.dict.entries()) {
    //   console.log("Found", key, value.length, value);
    // }
  }

  walk(node, callback) {
    return t.traverseFast(node, callback);
  }

  allocateInStack(fnNode) {
    // first time
    if (this.fnStack.isEmpty()) {
      this.fnStack.push(fnNode.end);
      this.labelArr.push("{");
    } else {
      // we are in another fn scope
      let total = this.fnStack.itemsToPop(fnNode.end);
      while (total--) {
        this.fnStack.pop();
        this.labelArr.push("}");
      }
      // push child fn
      this.fnStack.push(fnNode.end);
      this.labelArr.push("{");
    }
  }

  handleNode(node) {
    if (t.isProgram(node)) {
      return;
    }
    // construct start check for function
    if (t.isFunction(node)) {
      this.allocateInStack(node);
    }

    const pattern = this.label.pattern(node);
    if (!pattern) {
      return;
    }

    this.labelArr.push(pattern);

    if (!this.dict.has(pattern)) {
      this.dict.set(pattern, []);
    }
    this.dict.get(pattern).push(node.loc);
  }

  endNodes() {
    let length = this.fnStack.length();
    while (length--) {
      this.fnStack.pop();
      this.labelArr.push("}");
    }
  }

  run() {
    this.walk(this.root, this.handleNode);
    // stupid hack to end the last fn's that have not closed
    this.endNodes();
    this.print();
  }
};
