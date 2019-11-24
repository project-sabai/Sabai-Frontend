import Link from "next/link";
import { logout } from "../utils/auth";
import cookie from "js-cookie";
import styles from "../styles/styles.scss";

const SideMenu = props => (
  <aside class="menu sideMenu">
    <div class="level sideMenuTop">
      <div class="level-left">
        <figure class="image is-64x64 level-item">
          <img src={"../static/sabaiLogo.png"} />
        </figure>

        <h1 class="level-item sideMenuTitle">Biometrics</h1>
      </div>
    </div>
    <p class="menu-label sideMenuItem">{cookie.get("name")}</p>
    <p class="menu-label sideMenuItem">Services</p>
    <ul class="menu-list">
      <li>
        <Link href="/patients" replace>
          <a>Registration</a>
        </Link>
      </li>
      <li>
        <Link href="/queue" replace>
          <a>Queue</a>
        </Link>
      </li>
      <li>
        <Link href="/records" replace>
          <a>Records</a>
        </Link>
      </li>
    </ul>
    <p class="menu-label sideMenuItem">Pharmacy</p>
    <ul class="menu-list">
      <li>
        <Link href="/pharmacy/orders" replace>
          <a>Orders</a>
        </Link>
      </li>
      <li>
        <Link href="/pharmacy/stock" replace>
          <a>Stock</a>
        </Link>
      </li>
    </ul>
    <p class="menu-label sideMenuItem">Others</p>
    <ul class="menu-list">
      <li>
        <Link href="/users" replace>
          <a>Users</a>
        </Link>
      </li>
      <li onClick={logout}>
        <a>Logout</a>
      </li>
    </ul>
  </aside>
);

export default SideMenu;
