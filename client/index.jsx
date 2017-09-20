import { h, render } from "preact";
import Reporter from "./components/Reporter";
import Selection from "./selection";
import "./style/index.css";

render(<Reporter data={window.data} />, document.getElementById("reporterApp"));

new Selection().disableDoubleClicks();
