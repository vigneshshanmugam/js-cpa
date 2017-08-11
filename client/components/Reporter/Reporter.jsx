import { h, Component } from "preact";

import Header from "../Header";
import Sidebar from "../Sidebar";
import Content from "../Content";

import "./reporter.css";

export default class Reporter extends Component {
  constructor(...args) {
    super(...args);
  }

  render() {
    const { data } = this.props;
    return (
      <div class="js-cpa">
        <Header />
        <div className="layout">
          <Sidebar data={data} />
          <Content data={data[0]} />
        </div>
      </div>
    );
  }
}
