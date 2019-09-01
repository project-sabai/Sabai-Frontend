import Link from "next/link";
import { logout } from "../utils/auth";
import styles from '../styles/styles.scss'

const Header = props => (
  // <header class=".example">
    <nav class='navbar is-dark'>

    <div class='navbar-brand'>
      <div>
      <h1>Project Sa'bai</h1>
      </div>
      <nav>
        <ul>
          <li>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link href="/login">
              <a>Login</a>
            </Link>
          </li>
          <li>
            <Link href="/profile">
              <a>Profile</a>
            </Link>
          </li>
          <li>
            <button onClick={logout}>Logout</button>
          </li>
        </ul>
      </nav>
    </div>

    {/* <style jsx>{`
      ul {
        display: flex;
        list-style: none;
        margin-left: 0;
        padding-left: 0;
      }

      li {
        margin-right: 1rem;
      }

      li:first-child {
        margin-left: auto;
      }

      a {
        color: #fff;
        text-decoration: none;
      }

      header {
        padding: 0.2rem;
        color: #fff;
        background-color: #333;
      }

      div {
        display: flex;
        
      }
    `}</style> */}
  {/* // </header> */}
  </nav>
);

export default Header;
