import { h, Component } from "preact";
import cx from "classnames";
import Prism from "prismjs";

// Import prism plugins
import "prismjs/plugins/line-numbers/prism-line-numbers";
import "prismjs/plugins/line-highlight/prism-line-highlight";

import "./prettyprint.css";

const BASE_CLASS = "pretty-print";

export default class PrettyPrint extends Component {
  constructor(...args) {
    super(...args);
    this.highlight = this.highlight.bind(this);
  }

  componentDidMount() {
    this.highlight();
  }

  componentDidUpdate() {
    this.highlight();
  }

  highlight() {
    Prism.highlightElement(this._domNode);
  }

  render(props, state) {
    const { children, className, dataLine } = props;

    const elProps = Object.assign(
      {},
      {
        className: cx(BASE_CLASS, className),
        "data-line": dataLine
      }
    );
    return (
      <pre {...elProps}>
        <code ref={ref => (this._domNode = ref)} className={className}>
          {children}
        </code>
      </pre>
    );
  }
}
