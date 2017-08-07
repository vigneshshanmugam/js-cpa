import { h, Component } from "preact";

import Header from "./Header";

export default class Reporter extends Component {
  constructor(...args) {
    super(...args);
  }

  render() {
    return (
      <div class="js-cpa">
        <Header />
      </div>
    );
  }
}
