import React from "react";

const Home = () => (
  <div>
    <h1>Cookie-based authentication example</h1>
    <h2>hello there</h2>

    <p>Steps to test the functionality:</p>

    <ol>
      <li>Click login and enter your GitHub username.</li>
      <li>
        Click home and click profile again, notice how your session is being
        used through a token stored in a cookie.
      </li>
      <li>
        Click logout and try to go to profile again. You'll get redirected to
        the `/login` route.
      </li>
    </ol>
    <style jsx>{`
      li {
        margin-bottom: 0.5rem;
      }
    `}</style>
  </div>
);

export default Home;
