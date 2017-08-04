import { h, Component } from 'preact';
import { Layout } from 'preact-mdl';

import Header from './Header';

export default class Reporter extends Component {
  constructor(...args) {
    super(...args);
  }

  render() {
    return (
      <Layout fixed-header={true}>
        <Header />
      </Layout>
    );
  }
}
