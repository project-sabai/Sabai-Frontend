import React from "react";
import { withAuthSync, logInCheck } from "../utils/auth";

class Patients extends React.Component {
  static async getInitialProps(ctx) {
    let authentication = await logInCheck(ctx);
    return authentication;
  }

  render() {
    return (
        <h1>Patients page under construction</h1>
    );
  }
}

export default withAuthSync(Patients);
