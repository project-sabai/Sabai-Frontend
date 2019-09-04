import Link from "next/link";
import { logout } from "../utils/auth";
import styles from "../styles/styles.scss";

const SideMenu = props => (
  <aside class="menu sideMenu">
    <div class="level sideMenuTop">
      <div class="level-left">
        <figure class="image is-64x64 level-item">
          <img src={"../static/sabaiLogo.png"} />
        </figure>

        <h1 class="level-item sideMenuTitle">Project Sa'bai</h1>
      </div>
    </div>
    <p class="menu-label sideMenuItem">Services</p>
    <ul class="menu-list">
      <li>
        <Link href="/patients" replace>
          <a>Patients</a>
        </Link>
      </li>
      <li>
        <Link href="/triage" replace>
          <a>Triage</a>
        </Link>
      </li>
      <li>
        <Link href="/consultation" replace>
          <a>Consultation</a>
        </Link>
      </li>
      <li>
        <Link href="/pharmacy" replace>
          <a>Pharmacy</a>
        </Link>
      </li>
      <li>
        <Link href="/queue" replace>
          <a>Queue</a>
        </Link>
      </li>
    </ul>
    <p class="menu-label sideMenuItem">Analytics</p>
    <ul class="menu-list">
      <li>
        <Link href="/analytics/daily" replace>
          <a>Daily</a>
        </Link>
      </li>
      <li>
        <Link href="/analytics/overall" replace>
          <a>Overall</a>
        </Link>
      </li>
    </ul>
    <p class="menu-label sideMenuItem">Others</p>
    <ul class="menu-list">
      <li onClick={logout}>
        <a>Logout</a>
      </li>
    </ul>
  </aside>
);

export default SideMenu;
