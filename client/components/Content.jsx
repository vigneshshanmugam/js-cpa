import { h, Component } from "preact";
import cx from "classnames";
import PrettyPrint from "./PrettyPrint";
import styles from "./Content.css";

export function getLineInfo({ sourceLines, loc, baseLine, margin }) {
  const { end: { line: endLine }, start: { line: startLine } } = loc;
  let highlightStart = startLine;
  let highlightEnd = endLine;
  let dataStart = baseLine;

  let realStartLine = startLine - margin - 1;
  if (realStartLine < 0) {
    realStartLine = 0;
  } else {
    highlightStart -= realStartLine;
    highlightEnd -= realStartLine;
    dataStart += realStartLine;
  }
  let realEndLine = endLine + margin;
  if (realEndLine >= sourceLines.length) {
    realEndLine = sourceLines.length;
  }

  return {
    dataStart,
    highlightStart,
    highlightEnd,
    realStartLine,
    realEndLine
  };
}

function strSplice(str, idx, rem, ins) {
  return str.slice(0, idx) + ins + str.slice(idx + rem);
}

export const Code = ({ sourceLines, baseLine, margin, loc }) => {
  const {
    dataStart,
    highlightEnd,
    highlightStart,
    realStartLine,
    realEndLine
  } = getLineInfo({ sourceLines, baseLine, margin, loc });

  let dataLine = `${highlightStart}-${highlightEnd}`;

  const outputLines = sourceLines.slice(realStartLine, realEndLine);

  const startLineNumber = margin;
  const endLineNumber = outputLines.length - margin - 1;

  if (startLineNumber === endLineNumber) {
    outputLines[margin] = strSplice(
      outputLines[margin],
      loc.start.column,
      0,
      "<mark>"
    );

    outputLines[endLineNumber] = strSplice(
      outputLines[endLineNumber],
      loc.end.column + "<mark>".length,
      0,
      "</mark>"
    );
  }

  let outputCode = outputLines.join("\n");

  return (
    <PrettyPrint
      dataStart={dataStart}
      dataLine={dataLine}
      className={cx("language-javascript", "line-numbers", styles.code)}
    >
      {outputCode}
    </PrettyPrint>
  );
};

export class File extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      isActive: this.isActive(this.props)
    };

    this.toggleActive = () => this.setState({ isActive: !this.state.isActive });
  }

  isActive(props) {
    let lines = 0;
    for (let i = 0; i < props.file.sourceCode.length; i++) {
      if (props.file.sourceCode[i] === "\n") lines++;
    }
    return lines < 50;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isActive: this.isActive(nextProps)
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    // FIXME (boopathi)
    return true;

    return (
      this.props.data.matchingCode !== nextProps.data.matchingCode ||
      nextState.isActive !== this.state.isActive
    );
  }

  render({ file, baseLine, margin }, { isActive }) {
    const sourceLines = file.sourceCode.split("\n");
    return (
      <li
        className={cx(styles.section, {
          [styles.active]: isActive
        })}
      >
        <div className={styles.sectionHeader} onClick={this.toggleActive}>
          <h6 className={styles.printTitle}>
            {file.filename}
          </h6>
        </div>
        <div className={cx(styles.sectionBody, styles.mainPrintBody)}>
          {file.nodes.map(node =>
            <Code
              sourceLines={sourceLines}
              baseLine={baseLine}
              margin={margin}
              loc={node.loc}
            />
          )}
        </div>
      </li>
    );
  }
}

// Content
export default ({
  data,
  // number of lines to print before and after the highlight
  margin = 1,
  baseLine = 1
}) => {
  return (
    <div className={styles.content}>
      <ul className={styles.printWrapper}>
        {data.map((file, idx) =>
          <File
            key={idx}
            file={file}
            idx={idx}
            margin={margin}
            baseLine={baseLine}
          />
        )}
      </ul>
    </div>
  );
};
