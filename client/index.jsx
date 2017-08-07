import { h, render } from "preact";

import Reporter from "./components/Reporter";

import styles from "./style/index";

window.addEventListener(
  "load",
  () => {
    renderReport(window.duplicates);
  },
  false
);

let app;
function renderReport(duplicates) {
  app = render(
    <Reporter data={duplicates} />,
    document.getElementById("reporterApp"),
    app
  );
}
