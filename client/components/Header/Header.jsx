import { h } from "preact";
import cx from "classnames";

import "./header.css";

const BASE_CLASS = "header";

const Header = props => {
  const { className } = props;

  return (
    <header className={cx(BASE_CLASS, className)}>
      <div className={`${BASE_CLASS}-row`}>
        <span className={`${BASE_CLASS}-title`}>JS CPA</span>
      </div>
    </header>
  );
};

export default Header;
