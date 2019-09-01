import nextCookie from "next-cookies"
import getHost from '../get-host'

export async function logInCheck(ctx) {
  const { token } = nextCookie(ctx);
  const apiUrl = getHost(ctx.req) + "/api/profile";

  const redirectOnError = () =>
    typeof window !== "undefined"
      ? Router.push("/login")
      : ctx.res.writeHead(302, { Location: "/login" }).end();

  try {
    const response = await fetch(apiUrl, {
      credentials: "include",
      headers: {
        Authorization: JSON.stringify({ token })
      }
    })

    if (response.ok) {
      const js = await response.json();
      console.log("js", js);
      return js;
    } else {
      // https://github.com/developit/unfetch#caveats
      return await redirectOnError()
    }
  } catch (error) {
    // Implementation or Network error
    return redirectOnError()
  }
}
