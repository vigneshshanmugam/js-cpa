import { h } from "preact";
import cx from "classnames";

import PrettyPrint from "../PrettyPrint";

import styles from "./content.css";

const Content = ({
  data,
  codeLength = 40, // Lines after which entire code shoult not be displayed
  codeThreshold = 3, // Lines to show before and after the slice
  baseLine = 1 // Starting line number
}) => {
  if (!data || !data.length === 0) {
    return;
  }
  return (
    <div className={styles.content}>
      <div className={styles.printWrapper}>
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
            console.log(start, end, file, file.slice(start, end));
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
            <div
              className={cx(styles.section, {
                [styles.mainPrint]: i === 0
              })}
            >
              <h6 className={styles.printTitle}>
                File name: {id}
              </h6>
              <PrettyPrint {...pretttPrintProps}>
                {outputCode}
              </PrettyPrint>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Content;
