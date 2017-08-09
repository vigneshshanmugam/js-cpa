import { h } from "preact";
import cx from "classnames";

import "./sidebar.css";

const BASE_CLASS = "sidebar";

const Sidebar = props => {
  return (
    <div className={BASE_CLASS}>
      <div className={`${BASE_CLASS}-title`}>Duplicates</div>
    </div>
  );
};

export default Sidebar;
