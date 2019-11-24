import React from "react";
import { withAuthSync, logInCheck } from "../utils/auth";
import Modal from "react-modal";
import moment from "moment";
import axios from "axios";
import styles from "../styles/styles.scss";
import _ from "lodash";
import { API_URL } from "../utils/constants";
// import { MedicationForm } from "../../components/forms/stock";

Modal.setAppElement("#__next");

class Users extends React.Component {
  static async getInitialProps(ctx) {
    let authentication = await logInCheck(ctx);
    return authentication;
  }

  constructor() {
    super();

    this.state = {
      users: [],
      usersFiltered: [],
      userDetails: {},
      modalIsOpen: false,
      filterString: "",
      userForm: {
        isDoctor: false
      }
    };

    this.onFilterChange = this.onFilterChange.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    this.onRefresh();
  }

  async onRefresh() {
    let { data: users } = await axios.get(`${API_URL}/user/get`);

    this.setState({ users, usersFiltered: users, userForm: {isDoctor: false} });
  }

  async onSubmitForm() {
    let { userForm } = this.state;

    let first_name = userForm.isDoctor ? 'Dr.' : ''
    let username = userForm.name.split(' ').join('')
    let password = userForm.name.split(' ').join('_')
    let payload = {
      username,
      password,
      first_name,
      last_name: userForm.name
    }

    await axios.post(`${API_URL}/user/new`, payload);

    this.toggleModal();
    this.onRefresh();
  }

  onFilterChange(event) {
    // get
    let { users } = this.state;

    let usersFiltered = users.filter(user => {
      let name = `${user.fields.first_name} ${user.fields.last_name}`.toLowerCase();

      return name.includes(event.target.value.toLowerCase());
    });

    this.setState({ usersFiltered });
  }

  /**
   * open the modal
   * load the appropriate medication
   */
  toggleModal() {
    let changes = {
      modalIsOpen: !this.state.modalIsOpen
    };

    this.setState(changes);
  }

  handleInputChange(event) {
    let { userForm } = this.state;

    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    userForm[name] = value;

    console.log("changes made ", userForm);

    this.setState({
      userForm
    });
  }

  renderModal() {
    let { modalIsOpen, userForm } = this.state;
    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => this.toggleModal()}
        style={userModalStyles}
      >
        <div class="column is-12">
          <h1 style={{ color: "black", fontSize: "1.5em" }}>Add New User</h1>

          <div class="field">
            <label class="label">Name</label>
            <div class="control">
              <input
                name="name"
                class="input"
                type="text"
                onChange={this.handleInputChange}
                value={userForm.name}
              />
            </div>
          </div>

          <label class="checkbox">
            <input
              type="checkbox"
              name="isDoctor"
              onChange={this.handleInputChange}
            />
            Is a doctor?
          </label>

          <button
            class="button is-dark is-medium level-item"
            style={{ marginTop: 15 }}
            onClick={() => this.onSubmitForm()}
          >
            Submit
          </button>
        </div>

        {/* <UserForm
          formDetails={userDetails}
          handleInputChange={this.handleUserChange}
          onSubmit={() => this.onSubmitForm()}
        /> */}
      </Modal>
    );
  }

  handleUserChange(event) {
    let { userDetails } = this.state;

    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    userDetails[name] = value;

    this.setState({
      userDetails
    });
  }

  renderRows() {
    let { usersFiltered: users } = this.state;

    let tableRows = users.map(user => {
      let name = `${user.fields.first_name} ${user.fields.last_name}`;
      let username = user.fields.username;

      return (
        <tr>
          <td>{name}</td>
          <td>{username}</td>
        </tr>
      );
    });

    return tableRows;
  }

  render() {
    return (
      <div
        style={{
          marginTop: 15,
          marginLeft: 25,
          marginRight: 25
          // position: "relative"
        }}
      >
        {this.renderModal()}
        <div class="column is-12">
          <h1 style={{ color: "black", fontSize: "1.5em" }}>Users</h1>
          <div class="control">
            <input
              class="input is-medium"
              type="text"
              placeholder="Search Users"
              onChange={this.onFilterChange}
            />
          </div>
          <div class="levels" style={{ marginBottom: 10, marginTop: 10 }}>
            <div class="level-left">
              <button
                class="button is-dark level-item"
                style={{ display: "inline-block", verticalAlign: "top" }}
                onClick={() => this.toggleModal()}
              >
                New User
              </button>
            </div>
          </div>

          <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
              </tr>
            </thead>
            <tbody>{this.renderRows()}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

const userModalStyles = {
  content: {
    left: "35%",
    right: "17.5%",
    top: "25%",
    bottom: "25%"
  }
};

// class UserForm extends React.Component {
//   constructor() {
//     super();
//   }

//   render() {
//     let { content } = this.state;

//     return(

//     )
//   }
// }

export default withAuthSync(Users);
