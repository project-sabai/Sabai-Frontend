import React from "react";
import { withAuthSync, logInCheck } from "../utils/auth";

class Pharmacy extends React.Component {
  static async getInitialProps(ctx) {
    let authentication = await logInCheck(ctx);
    return authentication;
  }

  render() {
    return (
        <h1>Pharmacy page under construction</h1>
    );
  }
}

export default withAuthSync(Pharmacy);
