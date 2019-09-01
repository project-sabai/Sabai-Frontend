import React from "react";
import Sidebar from "react-sidebar";
import Head from "next/head";
import Header from "./header";
import SideMenu from "./sideMenu";
import styles from "../styles/styles.scss";


export default class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mql: null,
      sidebarDocked: null,
      sidebarOpen: false
    };

    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }

  // componentWillMount() {

  // }
  componentDidMount(){
    let mql = window.matchMedia(`(min-width: 800px)`);
    mql.addListener(this.mediaQueryChanged);
    this.setState({mql, sidebarDocked: mql.matches})
  }

  componentWillUnmount() {
    this.state.mql.removeListener(this.mediaQueryChanged);
  }

  onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open });
  }

  mediaQueryChanged() {
    let { mql } = this.state
    
    this.setState({ sidebarDocked: mql.matches, sidebarOpen: false });
  }

  render() {
    return (
      <React.Fragment>
        <Head>
          <title>Project Sa'bai</title>
          <link rel="stylesheet" href="https://combinatronics.com/kiwicopple/quick-font/master/css/circular.css" />
        </Head>
        <style jsx global>{`
          *,
          *::before,
          *::after {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            color: #333;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
              "Helvetica Neue", Arial, Noto Sans, sans-serif,
              "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
              "Noto Color Emoji";
          }

          .container {
            max-width: 65rem;
            // margin: 1.5rem auto;
            // padding-left: 1rem;
            // padding-right: 1rem;
            flex-direction: row;
          }
        `}</style>

        <main>
          <Sidebar
            sidebar={<SideMenu />}
            open={this.state.sidebarOpen}
            docked={this.state.sidebarDocked}
            onSetOpen={this.onSetSidebarOpen}
            styles={{ sidebar: { background: '#180424' } }}
          >
            <div class="container">{this.props.children}</div>
          </Sidebar>
        </main>
      </React.Fragment>
    );
  }
}
