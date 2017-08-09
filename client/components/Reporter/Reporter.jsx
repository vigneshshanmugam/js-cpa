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
    console.log(data);
    return (
      <div class="js-cpa">
        <Header />
        <div className="layout">
          <Sidebar data={data} />
          <Content />
        </div>
      </div>
    );
  }
}
