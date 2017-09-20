import { h, Component } from "preact";
import cx from "classnames";
import Prism from "prismjs";

// Import prism plugins

import "prismjs/plugins/line-numbers/prism-line-numbers";
import "prismjs/plugins/line-highlight/prism-line-highlight";
import "prismjs/plugins/keep-markup/prism-keep-markup";
// import "../plugins/Foldable";

import "prismjs/themes/prism-okaidia.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/line-highlight/prism-line-highlight.css";
// import "../plugins/Foldable.css";

import styles from "./PrettyPrint.css";

export default class PrettyPrint extends Component {
  constructor(...args) {
    super(...args);
    this._timer1 = null;
    this._timer2 = null;
  }
  componentDidMount() {
    this.highlight(this.props);
  }
  shouldComponentUpdate(nextProps) {
    return false;
  }
  componentWillReceiveProps(nextProps) {
    this.highlight(nextProps);
  }
  highlight(props) {
    this._pre.dataset.line = props.dataLine;
    this._pre.dataset.start = props.dataStart;
    // this._pre.dataset.open = "2-4,5-7,11-25";

    clearInterval(this._timer1);
    clearInterval(this._timer2);

    this._timer1 = setTimeout(() => {
      this._code.innerHTML = props.children[0];
      this._timer2 = setTimeout(() => Prism.highlightElement(this._code), 1);
    }, 1);
  }
  render({ className }) {
    return (
      <pre ref={ref => (this._pre = ref)} className={styles.pre}>
        <code className={className} ref={ref => (this._code = ref)} />
      </pre>
    );
  }
}
