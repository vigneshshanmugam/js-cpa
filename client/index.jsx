import { h, render } from "preact";

import Reporter from "./components/Reporter";

import "./style/index.css";

window.addEventListener("load", () => {
  renderReport(window.duplicates);
});

let app;
function renderReport({ data }) {
  app = render(
    <Reporter data={data} />,
    document.getElementById("reporterApp"),
    app
  );
}
