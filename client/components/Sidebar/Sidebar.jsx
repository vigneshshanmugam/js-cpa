import { h } from "preact";
import cx from "classnames";

import "./sidebar.css";

const BASE_CLASS = "sidebar";

const Sidebar = props => {
  const { data } = props;
  // Get the length of the matching function
  const getFirstFunctionMatchLength = list => {
    if (list.length <= 0) {
      return null;
    }
    console.log(!list[0] || !list[0].matchingCode);
    if (!list[0] || !list[0].matchingCode) {
      return null;
    }
    console.log(list[0].matchingCode.length);
    return list[0].matchingCode.length;
  };
  return (
    <div className={BASE_CLASS}>
      <div className={`${BASE_CLASS}-title`}>Duplicates by count</div>
      <ul className={`${BASE_CLASS}-list`}>
        {data.map(value =>
          <li className={`${BASE_CLASS}-list-item`}>
            <span className={`${BASE_CLASS}-list-item-content`}>
              <span>
                {`${value.length} duplicates`}
              </span>
              <span className={`${BASE_CLASS}-list-item-content-sub`}>
                {`String length: ${getFirstFunctionMatchLength(value)}`}
              </span>
            </span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
