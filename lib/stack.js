module.exports = class Stack {
  constructor() {
    this.arr = [];
  }

  push(item) {
    return this.arr.push(item);
  }

  pop() {
    if (this.isEmpty()) {
      return;
    }
    this.arr.pop();
  }

  itemsToPop(end) {
    if (this.isEmpty()) {
      return 0;
    }
    return this.arr.filter(a => a < end).length;
  }

  isEmpty() {
    return this.arr.length === 0;
  }

  length() {
    return this.arr.length;
  }
};
