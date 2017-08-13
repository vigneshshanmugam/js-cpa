import { h } from "preact";
import cx from "classnames";

import PrettyPrint from "../PrettyPrint";

import styles from "./content.css";

const Content = ({ data }) => {
  if (!data || !data.length) {
    return;
  }
  return (
    <div className={styles.content}>
      <div className={styles.printWrapper}>
        {data.map((d, i) => {
          const {
            fileContent,
            id,
            loc: {
              end: { line: endLine } = {},
              start: { line: startLine } = {}
            } = {}
          } = d;
          let outputCode;
          outputCode = fileContent;
          const pretttPrintProps = Object.assign(
            {},
            {
              dataStart: 0,
              dataLine: `${startLine}-${endLine}`,
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
