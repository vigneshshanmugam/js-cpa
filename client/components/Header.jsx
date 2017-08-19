import { h } from "preact";
import cx from "classnames";

import styles from "./Header.css";

const Header = props => {
  const { className } = props;

  return (
    <header className={cx(styles.header, className)}>
      <div className={styles.headerRow}>
        <span className={styles.headerTitle}>JS CPA</span>
      </div>
    </header>
  );
};

export default Header;
