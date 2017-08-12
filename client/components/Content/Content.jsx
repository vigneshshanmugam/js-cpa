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
        {(() => {
          return data.map(d => {
            const {
              fileContent,
              id,
              loc: {
                end: { line: endLine } = {},
                start: { line: startLine } = {}
              } = {}
            } = d;
            return (
              <div>
                <h6 className={styles.printTitle}>
                  File name: {id}
                </h6>
                <PrettyPrint
                  dataLine={`${startLine}-${endLine}`}
                  className={cx("language-javascript", "line-numbers")}
                >
                  {fileContent}
                </PrettyPrint>
              </div>
            );
          });
        })()}
      </div>
    </div>
  );
};

export default Content;
