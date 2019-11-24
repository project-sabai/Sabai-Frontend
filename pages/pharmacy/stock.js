import React from "react";
import { withAuthSync, logInCheck } from "../../utils/auth";
import Modal from "react-modal";
import moment from "moment";
import axios from "axios";
import styles from "../../styles/styles.scss";
import _ from "lodash";
import { MedicationForm } from "../../components/forms/stock";
import { API_URL } from "../../utils/constants";

Modal.setAppElement("#__next");

class Stock extends React.Component {
  static async getInitialProps(ctx) {
    let authentication = await logInCheck(ctx);
    return authentication;
  }

  constructor() {
    super();

    this.state = {
      medications: [],
      medicationsFiltered: [],
      medicationDetails: {},
      modalIsOpen: false,
      filterString: ''
    };

    this.onFilterChange = this.onFilterChange.bind(this)
    this.handleMedicationChange = this.handleMedicationChange.bind(this);
  }

  componentDidMount() {
    this.onRefresh();
  }

  async onRefresh() {
    let { data: medications } = await axios.get(
      `${API_URL}/medication/get`
    );

    console.log("look what we have here ", medications);

    this.setState({ medications, medicationsFiltered: medications});
  }

  async onSubmitForm() {
    let { medicationDetails } = this.state;

    let changeQuantity = medicationDetails.changeQuantity;
    let nameEnriched =
      medicationDetails.medicine_name.charAt(0).toUpperCase() +
      medicationDetails.medicine_name.slice(1);
    medicationDetails.medicine_name = nameEnriched;

    if (typeof medicationDetails.pk != "undefined") {
      let key = medicationDetails.pk;
      medicationDetails.quantity =
        parseInt(medicationDetails.quantity) + parseInt(changeQuantity);

      delete medicationDetails["changeQuantity"];
      delete medicationDetails["pk"];

      console.log("editing entry", medicationDetails);
      await axios.patch(
        `${API_URL}/medication/update?pk=${key}`,
        medicationDetails
      );
      alert("Medication updated!");
    } else {
      medicationDetails.quantity = changeQuantity;
      console.log("new entry", medicationDetails);
      await axios.post(
        `${API_URL}/medication/new`,
        medicationDetails
      );
      alert("New Medication created!");
    }

    this.toggleModal();
    this.onRefresh();
  }

  onFilterChange(event) {
    // get
    let { medications } = this.state;

    let medicationsFiltered = medications.filter(medication => {
      let medicineName = medication.fields.medicine_name.toLowerCase()

      return medicineName.includes(event.target.value.toLowerCase());
    });

    this.setState({ medicationsFiltered });
  }

  /**
   * open the modal
   * load the appropriate medication
   */
  toggleModal(modal = "", medication = {}) {
    let changes = {
      modalIsOpen: !this.state.modalIsOpen
    };

    switch (modal) {
      case "add":
        // this means that we are opening the modal
        // we want to have a clear page
        if (!this.state.modalIsOpen) changes.medicationDetails = {};
        break;
      case "edit":
        // load up what we have chosen
        changes.medicationDetails = medication;
        break;
      default:
        break;
    }

    console.log("look here now ", changes);

    this.setState(changes);
  }

  renderModal() {
    let { medicationDetails, modalIsOpen } = this.state;
    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => this.toggleModal()}
        style={prescriptionModalStyles}
      >
        <MedicationForm
          formDetails={medicationDetails}
          handleInputChange={this.handleMedicationChange}
          onSubmit={() => this.onSubmitForm()}
        />
      </Modal>
    );
  }

  handleMedicationChange(event) {
    let { medicationDetails } = this.state;

    const target = event.target;
    const value = target.value;
    const name = target.name;

    medicationDetails[name] = value;

    this.setState({
      medicationDetails
    });
  }

  renderRows() {
    let { medicationsFiltered : medications } = this.state;

    let tableRows = medications.map(medication => {
      let medicationDetails = {
        ...medication.fields,
        pk: medication.pk
      };
      let name = medicationDetails.medicine_name;
      let quantity = medicationDetails.quantity;

      return (
        <tr>
          <td>{name}</td>
          <td>{quantity}</td>
          <td>
            <div class="levels">
              <div class="level-left">
                <button
                  class="button is-dark level-item"
                  onClick={() => this.toggleModal("edit", medicationDetails)}
                >
                  Edit
                </button>
              </div>
            </div>
          </td>
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
          <h1 style={{ color: "black", fontSize: "1.5em" }}>Medicine Stock</h1>
          <div class="control">
            <input
              class="input is-medium"
              type="text"
              placeholder="Search Medications"
              onChange={this.onFilterChange}
            />
          </div>
          <div class="levels" style={{ marginBottom: 10, marginTop: 10 }}>
            <div class="level-left">
              <button
                class="button is-dark level-item"
                style={{ display: "inline-block", verticalAlign: "top" }}
                onClick={() => this.toggleModal("add")}
              >
                New Medicine
              </button>
            </div>
          </div>

          <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{this.renderRows()}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

const prescriptionModalStyles = {
  content: {
    left: "35%",
    right: "17.5%",
    top: "25%",
    bottom: "25%"
  }
};

export default withAuthSync(Stock);
