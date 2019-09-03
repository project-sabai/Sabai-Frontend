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
        <a href='/patients'>Patients</a>
      </li>
      <li>
        <a href='triage'>Triage</a>
      </li>
      <li>
        <a href='consultation'>Consultation</a>
      </li>
      <li>
        <a href='pharmacy'>Pharmacy</a>
      </li>
      <li>
        <a href='queue'>Queue</a>
      </li>
    </ul>
    <p class="menu-label sideMenuItem">Analytics</p>
    <ul class="menu-list">
      <li>
        <a href='analytics/daily'>Daily</a>
      </li>
      <li>
        <a href='analytics/overall'>Overall</a>
      </li>
    </ul>
    <p class="menu-label sideMenuItem">Others</p>
    <ul class="menu-list">
      <li>
        <a>Logout</a>
      </li>
    </ul>
  </aside>
);

export default SideMenu;
