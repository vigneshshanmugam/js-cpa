import { h, Component } from "preact";
import cx from "classnames";

import PrettyPrint from "../PrettyPrint";

import styles from "./content.css";

class Content extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      activeItem: 0
    };

    this.handleItemChange = this.handleItemChange.bind(this);
    this.shallowDiffers = this.shallowDiffers.bind(this);
  }

  componentDidUpdate(nextProps) {
    if (this.shallowDiffers(this.props, nextProps)) {
      this.setState({
        activeItem: 0
      });
    }
  }

  shallowDiffers(a, b) {
    for (let i in a) if (!(i in b)) return true;
    for (let i in b) if (a[i] !== b[i]) return true;
    return false;
  }

  handleItemChange(index, { el, targetEl }) {
    if (index === 0) return;
    this.setState(
      {
        activeItem: index
      },
      () => {
        setTimeout(() => {
          const { top } = el.getBoundingClientRect();
          const { height } = targetEl.getBoundingClientRect();
          window.scrollTo(0, top - height - 40);
        }, 0);
      }
    );
  }

  render(
    {
      data,
      codeLength = 40, // Lines after which entire code should not be displayed
      codeThreshold = 3, // Lines to show before and after the slice
      baseLine = 1 // Starting line number
    },
    { activeItem }
  ) {
    if (!data || !data.length === 0) {
      return;
    }
    return (
      <div className={styles.content}>
        <ul className={styles.printWrapper}>
          {data.map((d, i) => {
            const {
              fileContent,
              file,
              id,
              loc: {
                end: { line: endLine } = {},
                start: { line: startLine } = {}
              } = {}
            } = d;
            let outputCode = fileContent;
            let dataStart = baseLine;
            let dataLine = `${startLine}-${endLine}`;
            // If the code length is creater than threshold
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
              dataLine = `${codeThreshold}-${codeThreshold +
                (endLine - startLine)}`;
              // Save sliced array to outputCode
              outputCode = file.slice(start, end).join("\n");
            }
            const pretttPrintProps = Object.assign(
              {},
              {
                dataStart,
                dataLine,
                className: cx("language-javascript", "line-numbers")
              }
            );
            return (
              <li
                className={cx(styles.section, {
                  [styles.mainPrint]: i === 0,
                  [styles.active]: i === activeItem
                })}
                onClick={e => {
                  this.handleItemChange(i, {
                    targetEl: e.target,
                    el: e.target.parentNode
                  });
                }}
              >
                <div className={styles.sectionHeader}>
                  <h6 className={styles.printTitle}>
                    File name: {id}
                  </h6>
                </div>
                <div className={cx(styles.sectionBody, styles.mainPrintBody)}>
                  <PrettyPrint {...pretttPrintProps}>
                    {outputCode}
                  </PrettyPrint>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default Content;
