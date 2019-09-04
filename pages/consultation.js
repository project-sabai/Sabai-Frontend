import React from "react";
import { withAuthSync, logInCheck } from "../utils/auth";

class Consultation extends React.Component {
  static async getInitialProps(ctx) {
    let authentication = await logInCheck(ctx);
    return authentication;
  }

  render() {
    return (
        <h1>Consultation page under construction</h1>
    );
  }
}

export default withAuthSync(Consultation);
