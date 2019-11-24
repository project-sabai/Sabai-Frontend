import { Component } from "react";
import Router from "next/router";
import nextCookie from "next-cookies";
import cookie from "js-cookie";
import getHost from "../utils/get-host";
import { API_URL } from "../utils/constants";

function login({ token, name }) {
  cookie.set("token", token, { expires: 1 });
  cookie.set("name", name);
  Router.push("/patients");
}

function logout() {
  cookie.remove("token");
  // to support logging out from all windows
  window.localStorage.setItem("logout", Date.now());
  Router.push("/login");
}

// Gets the display name of a JSX component for dev tools
const getDisplayName = Component =>
  Component.displayName || Component.name || "Component";

function withAuthSync(WrappedComponent) {
  return class extends Component {
    static displayName = `withAuthSync(${getDisplayName(WrappedComponent)})`;

    static async getInitialProps(ctx) {
      const token = auth(ctx);

      const componentProps =
        WrappedComponent.getInitialProps &&
        (await WrappedComponent.getInitialProps(ctx));

      return { ...componentProps, token };
    }

    constructor(props) {
      super(props);

      this.syncLogout = this.syncLogout.bind(this);
    }

    componentDidMount() {
      window.addEventListener("storage", this.syncLogout);
    }

    componentWillUnmount() {
      window.removeEventListener("storage", this.syncLogout);
      window.localStorage.removeItem("logout");
    }

    syncLogout(event) {
      if (event.key === "logout") {
        console.log("logged out from storage!");
        Router.push("/login");
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

async function auth(ctx) {
  const { token } = nextCookie(ctx);

  // verify cookie first
  let isVerified = await verifyCookie(token)

  if(!isVerified){
    cookie.remove('token')
    ctx.res.writeHead(302, { Location: "/login" });
    ctx.res.end();

    // return undefined

  }

  /*
   * If `ctx.req` is available it means we are on the server.
   * Additionally if there's no token it means the user is not logged in.
   */
  if (ctx.req && !token) {
    ctx.res.writeHead(302, { Location: "/login" });
    ctx.res.end();
  }

  // We already checked for server. This should only happen on client.
  if (!token) {
    Router.push("/login");
  }

  return token;
}

/**
 *
 * the problem here and lies here
 */
async function logInCheck(ctx) {
  const { token } = nextCookie(ctx);

  // the problem might be here actually
  // go check this out
  // *****
  // basically, initial token has a very short lifespan
  // should aim to use a longer-lived one
  // aim for one day access
  const apiUrl = `${API_URL}/api/token/verify/`;

  const redirectOnError = () => {
    typeof window !== "undefined"
      ? Router.push("/login")
      : ctx.res.writeHead(302, { Location: "/login" }).end();
    cookie.remove("token");
    cookie.remove("name");
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",

      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    });

    console.log("this was the response ", response);

    if (response.ok) {
      const js = await response.json();
      console.log("js", js);
      return js;
    } else {
      // https://github.com/developit/unfetch#caveats
      return await redirectOnError();
    }
  } catch (error) {
    // Implementation or Network error
    return redirectOnError();
  }
}

async function verifyCookie(token) {
  try {
    const apiUrl = `${API_URL}/api/token/verify/`
    const response = await fetch(apiUrl, {
      method: "POST",

      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    });

    return response.ok
  } catch {
    return false
  }
}

export { login, logout, withAuthSync, auth, logInCheck };
