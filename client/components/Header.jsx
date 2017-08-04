import { h } from "preact";
import { Layout } from "preact-mdl";

export default () =>
  <Layout.Header>
    <Layout.HeaderRow>
      <Layout.Title>
        <h6>
          <i class="material-icons">dashboard</i> Hello CPA
        </h6>
      </Layout.Title>
      <h6>Hello CPA</h6>
    </Layout.HeaderRow>
  </Layout.Header>;
