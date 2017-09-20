import { h } from "preact";
import cx from "classnames";

import styles from "./Header.css";

export default ({ title, className }) => {
  return (
    <header className={cx(styles.header, className)}>
      <div className={styles.headerRow}>
        <span className={styles.headerTitle}>{title}</span>
      </div>
    </header>
  );
};
