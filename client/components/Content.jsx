import { h, Component } from "preact";
import cx from "classnames";

import PrettyPrint from "./PrettyPrint";

import styles from "./Content.css";

export class Section extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      isActive: this.isActive(this.props)
    };

    this.toggleActive = () => this.setState({ isActive: !this.state.isActive });
  }

  isActive(props) {
    const { start, end } = props.data.loc;
    return end.line - start.line > 10 ? props.idx === 0 : true;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isActive: this.isActive(nextProps)
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.data.matchingCode !== nextProps.data.matchingCode ||
      nextState.isActive !== this.state.isActive
    );
  }

  render({ data, baseLine, codeLength, codeThreshold }, { isActive }) {
    const {
      fileContent,
      file,
      id,
      loc: { end: { line: endLine }, start: { line: startLine } }
    } = data;
    let highlightStart = startLine;
    let highlightEnd = endLine;
    let dataStart = baseLine;

    let realStartLine = startLine - codeThreshold - 1;
    if (realStartLine < 0) {
      realStartLine = 0;
    } else {
      highlightStart -= realStartLine;
      highlightEnd -= realStartLine;
      dataStart += realStartLine;
    }
    let realEndLine = endLine + codeThreshold;
    if (realEndLine >= file.length) {
      realEndLine = file.length;
    }

    let dataLine = `${highlightStart}-${highlightEnd}`;

    const outputCode = file.slice(realStartLine, realEndLine).join("\n");

    return (
      <li
        className={cx(styles.section, {
          [styles.active]: isActive
        })}
      >
        <div className={styles.sectionHeader} onClick={this.toggleActive}>
          <h6 className={styles.printTitle}>
            File name: {id}
          </h6>
        </div>
        <div className={cx(styles.sectionBody, styles.mainPrintBody)}>
          <PrettyPrint
            dataStart={dataStart}
            dataLine={dataLine}
            className={cx("language-javascript", "line-numbers")}
          >
            {outputCode}
          </PrettyPrint>
        </div>
      </li>
    );
  }
}

// Content
export default ({
  data = [],
  codeLength = 40,
  // number of lines to print before and after the highlight
  codeThreshold = 2,
  baseLine = 1
}) =>
  <div className={styles.content}>
    <ul className={styles.printWrapper}>
      {data.map((d, idx) =>
        <Section
          data={d}
          idx={idx}
          codeLength={codeLength}
          codeThreshold={codeThreshold}
          baseLine={baseLine}
        />
      )}
    </ul>
  </div>;
