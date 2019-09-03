import React from "react";
import Layout from "../../components/layout";
import { withAuthSync, logInCheck } from "../../utils/auth";

class Overall extends React.Component {
  static async getInitialProps(ctx) {
    let authentication = await logInCheck(ctx);
    return authentication;
  }

  render() {
    return (
      <Layout>
        <h1>Overall Analytics page under construction</h1>
      </Layout>
    );
  }
}

export default withAuthSync(Overall);