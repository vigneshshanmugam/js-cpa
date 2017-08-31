import { h } from "preact";
import cx from "classnames";

import styles from "./Sidebar.css";

const SidebarItem = ({ title, subtitle, isActive, onChange }) => (
  <li
    className={cx(styles["sidebar-list-item"], {
      [styles.active]: isActive
    })}
    onClick={onChange}
  >
    <span className={styles["sidebar-list-item-content"]}>
      <span>{title}</span>
      <span className={styles["sidebar-list-item-content-sub"]}>
        {subtitle}
      </span>
    </span>
  </li>
);

export default ({ data, reportType, handleItemChange, activeIndex }) => {
  const numMatches = dups =>
    dups.map(file => file.nodes.length).reduce((acc, cur) => acc + cur, 0);

  const getFnLength = dups => dups[0].nodes[0].match.length;

  return (
    <div className={styles.sidebar}>
      <div className={styles["sidebar-title"]}>
        Duplicates by {`${reportType}`}
      </div>
      <ul className={styles["sidebar-list"]}>
        {data.map((value, index) => (
          <SidebarItem
            key={index}
            title={`Duplicates ${numMatches(value)}`}
            subtitle={`fn length: ${getFnLength(value)}`}
            isActive={index === activeIndex}
            onChange={() => handleItemChange(index)}
          />
        ))}
      </ul>
    </div>
  );
};
