import { h } from "preact";
import cx from "classnames";

import PrettyPrint from "../PrettyPrint";

import "./content.css";

const BASE_CLASS = "content";

const Content = props => {
  const { data } = props;
  return (
    <div className={BASE_CLASS}>
      <div className={"print-wrapper"}>
        {(() => {
          return data.map(d => {
            const {
              fileContent,
              loc: {
                end: { line: endLine } = {},
                start: { line: startLine } = {}
              } = {}
            } = d;
            return (
              <div className={"print-area"}>
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
