import { h, Component } from "preact";
import cx from "classnames";

import styles from "./Collapse.css";

export default class Collapse extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      activeIndex: 0
    };
  }

  render(props, state) {
    return <ul className={styles.collapse}>Hello</ul>;
  }
}
