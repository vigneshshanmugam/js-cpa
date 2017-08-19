import { h, Component } from "preact";
import cx from "classnames";

import PrettyPrint from "./PrettyPrint";

import styles from "./Content.css";

export class Section extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      isActive: this.props.idx === 0 ? true : false
    };

    this.toggleActive = () => this.setState({ isActive: !this.state.isActive });
  }
  render({ data, idx, baseLine, codeLength, codeThreshold }, { isActive }) {
    const {
      fileContent,
      file,
      id,
      loc: { end: { line: endLine } = {}, start: { line: startLine } = {} } = {}
    } = data;
    let outputCode = fileContent;
    let dataStart = baseLine;
    let dataLine = `${startLine}-${endLine}`;
    // If the code length is greater than threshold
    // then print only the duplicate function and
    // 5 lines before and after the duplicates
    if (file.length > codeLength) {
      let start = startLine - codeThreshold;
      let end = endLine + codeThreshold;

      // Reset the start if its less than 0
      if (start < 0) {
        start = 0;
      }
      // Reset the end if its greater than array length
      if (end > file.length) {
        end = file.length;
      }
      // Reset the starting line to the current start
      dataStart = start;
      // Reset the lines to highlight
      dataLine = `${codeThreshold}-${codeThreshold + (endLine - startLine)}`;
      // Save sliced array to outputCode
      outputCode = file.slice(start, end).join("\n");
    }

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
  codeThreshold = 3,
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
