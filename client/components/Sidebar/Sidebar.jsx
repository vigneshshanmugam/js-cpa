import { h } from "preact";
import cx from "classnames";

import styles from "./sidebar.css";

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
  if (!data || !data.length) {
    return;
  }
  return (
    <div className={styles.sidebar}>
      <div className={styles["sidebar-title"]}>Duplicates by count</div>
      <ul className={styles["sidebar-list"]}>
        {data.map((value, index) =>
          <li
            className={cx(styles["sidebar-list-item"], {
              [styles.active]: index === activeIndex
            })}
            onClick={() => {
              // Send the index of the clicked item
              handleItemChange(index);
            }}
          >
            <span className={styles["sidebar-list-item-content"]}>
              <span>
                {`${value.length} duplicates`}
              </span>
              <span className={styles["sidebar-list-item-content-sub"]}>
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
