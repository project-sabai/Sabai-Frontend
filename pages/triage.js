import React from "react";
import { withAuthSync, logInCheck } from "../utils/auth";

class Triage extends React.Component {
  static async getInitialProps(ctx) {
    let authentication = await logInCheck(ctx);
    return authentication;
  }

  render() {
    return (
        <h1>Triage page under construction</h1>
    );
  }
}

export default withAuthSync(Triage);
