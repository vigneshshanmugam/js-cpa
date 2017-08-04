import { h } from "preact";
import { Layout } from "preact-mdl";

export default () =>
  <Layout.Header>
    <Layout.HeaderRow>
      <Layout.Title>Code Pattern Analysis</Layout.Title>
      <Layout.Spacer />
      <i class="material-icons">code</i>
    </Layout.HeaderRow>
  </Layout.Header>;
