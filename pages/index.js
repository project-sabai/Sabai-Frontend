import React from "react";
import Modal from 'react-modal';
import styles from "../styles/styles.scss";
import Router from 'next/router'

export default class Index extends React.Component {
  static async getInitialProps({ res }) {
    if (res) {
        res.writeHead(302, {
          Location: '/patients'
        })
        res.end()
      } else {
        Router.push('/patients')
      }
      return {}
  }
}
