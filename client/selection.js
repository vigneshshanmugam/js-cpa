// Source: https://stackoverflow.com/a/4117520

const timeout = 500;
export default class Selection {
  constructor(d = document, w = window) {
    this.tcTimer = 0;
    this.mouseDown = false;
    this.document = d;
    this.window = w;

    this.clickCallback = this.clickCallback.bind(this);
  }

  clickCallback() {
    this.clearSelection();
  }

  disableDoubleClicks() {
    this.document.addEventListener("dblclick", () => this.clearSelection());
  }

  disableAll() {
    this.document.addEventListener("mousedown", () => (this.mouseDown = true));
    this.document.addEventListener("mouseup", () => (this.mouseDown = false));

    this.document.addEventListener("dblclick", e => {
      this.clearSelection();
      this.window.clearTimeout(this.tcTimer);
      this.document.addEventListener("click", this.clickCallback);
      this.tcTimer = this.window.setTimeout(
        () => this.unregisterClick(),
        timeout
      );
    });
  }

  unregisterClick() {
    if (!this.mouseDown) {
      this.document.removeEventListener("click", this.clickCallback);
      return true;
    }
    this.tcTimer = this.window.setTimeout(
      () => this.unregisterClick(),
      timeout
    );
    return false;
  }

  clearSelection() {
    if (this.window.getSelection) {
      this.window.getSelection().removeAllRanges();
    }
    if (this.document.selection) {
      this.document.selection.empty();
    }
  }
}
