import { h } from "preact";
import cx from "classnames";

import "./sidebar.css";

const BASE_CLASS = "sidebar";

const Sidebar = ({ data, handleItemChange, activeIndex }) => {
  // Get the length of the matching function
  const getFirstFunctionMatchLength = list => {
    if (!list.length) {
      return null;
    }
    if (!list[0] || !list[0].matchingCode) {
      return null;
    }
    return list[0].matchingCode.length;
  };
  return (
    <div className={BASE_CLASS}>
      <div className={`${BASE_CLASS}-title`}>Duplicates by count</div>
      <ul className={`${BASE_CLASS}-list`}>
        {data.map((value, index) =>
          <li
            className={cx(`${BASE_CLASS}-list-item`, {
              active: index === activeIndex
            })}
            onClick={() => {
              // Send the index of the clicked item
              handleItemChange(index);
            }}
          >
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
