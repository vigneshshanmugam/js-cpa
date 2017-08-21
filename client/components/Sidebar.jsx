import { h } from "preact";
import cx from "classnames";

import styles from "./Sidebar.css";

const SidebarItem = ({ title, subtitle, isActive, onChange }) =>
  <li
    className={cx(styles["sidebar-list-item"], {
      [styles.active]: isActive
    })}
    onClick={onChange}
  >
    <span className={styles["sidebar-list-item-content"]}>
      <span>
        {title}
      </span>
      <span className={styles["sidebar-list-item-content-sub"]}>
        {subtitle}
      </span>
    </span>
  </li>;

export default ({ data, handleItemChange, activeIndex }) => {
  const numMatches = dups =>
    dups.map(file => file.nodes.length).reduce((acc, cur) => acc + cur, 0);

  return (
    <div className={styles.sidebar}>
      <div className={styles["sidebar-title"]}>Duplicates by count</div>
      <ul className={styles["sidebar-list"]}>
        {data.map((value, index) =>
          <SidebarItem
            key={index}
            title={`Duplicates ${numMatches(value)}`}
            subtitle={`fn length: ${value[0].nodes[0].match.length}`}
            isActive={index === activeIndex}
            onChange={() => handleItemChange(index)}
          />
        )}
      </ul>
    </div>
  );
};
