import { h } from "preact";
import cx from "classnames";

import PrettyPrint from "../PrettyPrint";

import "./content.css";

const BASE_CLASS = "content";

const Content = ({ data }) => {
  if (!data || !data.length) {
    return;
  }
  return (
    <div className={BASE_CLASS}>
      <div className={"print-wrapper"}>
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
              <div className={"print-area"}>
                <h6 className={"print-title"}>
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
