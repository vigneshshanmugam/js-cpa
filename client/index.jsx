import { h, render } from "preact";
import Reporter from "./components/Reporter";
import "./style/index.css";

render(
  <Reporter data={window.duplicates.data} />,
  document.getElementById("reporterApp")
);
