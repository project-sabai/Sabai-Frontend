import React from "react";
import Layout from "../components/layout";
import { withAuthSync, logInCheck } from "../utils/auth";

class Patients extends React.Component {
  static async getInitialProps(ctx) {
    let authentication = await logInCheck(ctx);
    return authentication;
  }

  render() {
    return (
      <Layout>
        <h1>Patients page under construction</h1>
      </Layout>
    );
  }
}

export default withAuthSync(Patients);
