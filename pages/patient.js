import React from "react";
import { withAuthSync, logInCheck } from "../utils/auth";
import axios from "axios";
import _ from "lodash";
import Router from "next/router";
import Modal from "react-modal";
import moment from "moment";
import cookie from "js-cookie";
import {
  DentalTriageForm,
  MedicalTriageForm,
  DentalForm,
  MedicalForm,
  PrescriptionForm
} from "../components/forms/patient";
import {
  ConsultationsTable,
  ConsultationsView,
  DentalTriageView,
  MedicalTriageView,
  VisitPrescriptionsTable
} from "../components/views/patient";
import { API_URL } from "../utils/constants";

Modal.setAppElement("#__next");

class Patient extends React.Component {
  static async getInitialProps(ctx) {
    let authentication = await logInCheck(ctx);
    let { query } = ctx;

    return { query };
  }

  constructor() {
    super();

    this.state = {
      mounted: false,
      patient: {},
      medications: [],
      visits: [],
      visitID: null,
      consults: [],
      orders: [],
      referrals: [],
      medicalTriage: {},
      dentalTriage: {},
      formDetails: {},
      medicationDetails: {},
      formModalOpen: false,
      isEditing: false,
      viewModalOpen: false,
      modalContent: {}
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handlePrescriptionChange = this.handlePrescriptionChange.bind(this);
    this.handleVisitChange = this.handleVisitChange.bind(this);
  }

  componentDidMount() {
    this.onRefresh();
  }

  async onRefresh() {
    let { id: patientId } = this.props.query;

    // gets patient data
    let { data: patient } = await axios.get(
      `${API_URL}/patients/get?pk=${patientId}`
    );

    // gets all visit data
    let { data: visits } = await axios.get(
      `${API_URL}/visit/get?patient=${patientId}`
    );

    // sorts
    let visitsSorted = visits.sort((a, b) => {
      return b.pk - a.pk;
    });

    console.log("this is the patient ", patient[0]);
    console.log("this are the visits ", visitsSorted);
    console.log("first of their name ", visitsSorted[0]);

    this.setState({
      patient: patient[0],
      visits: visitsSorted
    });

    let visitID = visitsSorted[0].pk;
    this.loadVisitDetails(visitID);
    this.loadMedicationStock();
  }

  toggleViewModal(viewType = null, consult = {}) {
    console.log("this is happening ", consult);

    this.setState({
      viewModalOpen: !this.state.viewModalOpen,
      viewType,
      consult
    });
  }

  renderViewModal() {
    let {
      medicalTriage,
      dentalTriage,
      viewModalOpen,
      consult,
      viewType
    } = this.state;

    console.log('consult apa ', consult)
    console.log('wtfwtfwtfwtf')

    let modalContent =
      viewType == "medicalTriage" ? (
        <MedicalTriageView content={medicalTriage} />
      ) : viewType == "dentalTriage" ? (
        <DentalTriageView content={dentalTriage} />
      ) : (
        <ConsultationsView content={consult} />
      );

    return (
      <Modal
        isOpen={viewModalOpen}
        onRequestClose={() => this.toggleViewModal()}
        style={viewModalStyles}
        contentLabel="Example Modal"
      >
        {modalContent}
      </Modal>
    );
  }

  toggleFormModal(order = {}) {
    this.loadMedicationStock();

    this.setState({
      formModalIsOpen: !this.state.formModalIsOpen,
      medicationDetails: order,
      isEditing: Object.keys(order).length > 0
    });
  }

  async loadMedicationStock() {
    let { data: medications } = await axios.get(`${API_URL}/medication/get`);

    let { data: orders } = await axios.get(
      `${API_URL}/order/get?order_status=PENDING`
    );

    // key -> medicine pk
    // value -> total reserved
    let reservedMedications = {};
    orders.forEach(order => {
      let medicationID = order.fields.medicine;
      let quantityReserved = order.fields.quantity;

      if (typeof reservedMedications[medicationID] === "undefined") {
        reservedMedications[medicationID] = quantityReserved;
      } else {
        reservedMedications[medicationID] =
          reservedMedications[medicationID] + quantityReserved;
      }
    });

    this.setState({ medications, reservedMedications });
  }

  renderFormModal() {
    let {
      patient,
      isEditing,
      medications,
      medicationDetails,
      formModalIsOpen,
      reservedMedications
    } = this.state;

    let options = medications.map(medication => {
      let name = medication.fields.medicine_name;
      let pKey = medication.pk;

      var value = "";
      if (Object.keys(medicationDetails).length > 0)
        value = `${medicationDetails.medicine} ${medicationDetails.medicine_name}`;

      if (value == `${pKey} ${name}`)
        return (
          <option value={`${pKey} ${name}`} selected>
            {name}
          </option>
        );
      return <option value={`${pKey} ${name}`}>{name}</option>;
    });

    return (
      <Modal
        isOpen={formModalIsOpen}
        onRequestClose={() => this.toggleFormModal()}
        style={formModalStyles}
        contentLabel="Example Modal"
      >
        <PrescriptionForm
          allergies={patient.fields.drug_allergy}
          handleInputChange={this.handlePrescriptionChange}
          formDetails={medicationDetails}
          isEditing={isEditing}
          medicationOptions={options}
          medications={medications}
          reservedMedications={reservedMedications}
          onSubmit={() => this.submitNewPrescription()}
        />
      </Modal>
    );
  }

  handlePrescriptionChange(event) {
    let { medicationDetails } = this.state;

    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name === "medication") {
      let pKey = value.split(" ")[0];
      let medicineName = value
        .split(" ")
        .slice(1)
        .join(" ");

      medicationDetails["medicine"] = pKey;
      medicationDetails["medicine_name"] = medicineName;
    } else {
      medicationDetails[name] = value;
    }

    this.setState({
      medicationDetails
    });
  }

  submitNewPrescription() {
    let { orders, medicationDetails, isEditing } = this.state;

    if (isEditing) {
      // go find that order
      let index = orders.findIndex(order => {
        order.medication == medicationDetails.medication;
      });
      orders[index] = medicationDetails;
      // edit that order
    } else orders.push({ ...medicationDetails, order_status: "PENDING" });

    this.setState({
      orders: orders,
      medicationDetails: {},
      formModalIsOpen: false
    });
  }

  async loadVisitDetails(visitID) {
    // load
    // consultations
    let { data: consults } = await axios.get(
      `${API_URL}/consults/get?visit=${visitID}`
    );

    let { data: prescriptions } = await axios.get(
      `${API_URL}/order/get?visit=${visitID}`
    );

    let consultsEnriched = consults.map(consult => {
      let consultID = consult.pk;
      let consultPrescriptions = prescriptions.filter(prescription => {
        return prescription.fields.consult == consultID;
      });

      return {
        ...consult,
        prescriptions: consultPrescriptions
      };
    });

    // medical triage details
    let { data: medicalTriage } = await axios.get(
      `${API_URL}/medicalvitals/get?visit=${visitID}`
    );
    // dental triage details
    let { data: dentalTriage } = await axios.get(
      `${API_URL}/dentalvitals/get?visit=${visitID}`
    );

    console.log("??<", consults[0]);

    this.setState({
      consults: consultsEnriched,
      medicalTriage: medicalTriage[0] || {},
      dentalTriage: dentalTriage[0] || {},
      visitPrescriptions: prescriptions,
      mounted: true,
      visitID
    });
  }

  async submitForm() {
    let { form } = this.props.query;
    let { formDetails, visitID, orders } = this.state;

    var formPayload = {
      visit: visitID,
      ...formDetails
    };

    var consultId;
    var orderPromises;

    console.log("form is ", formPayload);

    switch (form) {
      case "medicalTriage":
        await axios.post(`${API_URL}/medicalvitals/new`, formPayload);
        alert("Medical Triage Completed!");
        break;
      case "dentalTriage":
        await axios.post(`${API_URL}/dentalvitals/new`, formPayload);
        alert("Dental Triage Completed!");
        break;
      case "medical":
        let { data: medicalConsult } = await axios.post(
          `${API_URL}/consults/new`,
          {
            ...formPayload,
            doctor: cookie.get("name"),
            type: "medical"
          }
        );

        console.log("medicalConsult ", medicalConsult[0]);

        consultId = medicalConsult[0].pk;
        orderPromises = [];

        orders.forEach(order => {
          let orderPayload = {
            ...order,
            visit: visitID,
            consult: consultId,
            doctor: cookie.get("name")
          };
          orderPromises.push(axios.post(`${API_URL}/order/new`, orderPayload));
        });

        await Promise.all(orderPromises);
        alert("Medical Consult Completed!");
        break;
      case "dental":
        console.log("this is the formPayload ", formPayload);
        let { data: dentalConsult } = await axios.post(
          `${API_URL}/consults/new`,
          {
            ...formPayload,
            doctor: cookie.get("name"),
            type: "dental"
          }
        );
        consultId = dentalConsult[0].pk;

        orderPromises = [];

        orders.forEach(order => {
          let orderPayload = {
            ...order,
            consult: consultId,
            visit: visitID,
            doctor: cookie.get("name")
          };
          orderPromises.push(axios.post(`${API_URL}/order/new`, orderPayload));
        });

        alert("Dental Consult Completed!");
        break;
    }

    console.log("loser lah");
    Router.push("/queue");
  }

  handleInputChange(event) {
    let { formDetails } = this.state;

    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    formDetails[name] = value;

    console.log("changes made ", formDetails);

    this.setState({
      formDetails
    });
  }

  handleVisitChange(event) {
    const value = event.target.value;

    // pull the latest visit

    // this.setState({ visitID: value });
    this.loadVisitDetails(value);
  }

  renderHeader() {
    let { patient, visits } = this.state;
    let visitOptions = visits.map(visit => {
      let date = moment(visit.fields.visit_date).format("DD MMMM YYYY");
      let pk = visit.pk;

      return <option value={pk}>{date}</option>;
    });

    return (
      <div class="column is-12">
        <div class="columns is-12">
          <div class="column is-2">
            <img
              src={`${API_URL}/media/${patient.fields.picture}`}
              alt="Placeholder image"
              class="has-ratio"
              style={{
                height: 200,
                width: 200,
                objectFit: "cover",
                backgroundColor: "red"
              }}
            />
          </div>
          <div class="column is-3">
            <label class="label">Village ID</label>
            <article class="message">
              <div class="message-body">{`${patient.fields.village_prefix}${patient.pk}`}</div>
            </article>
            <label class="label">Visit on</label>
            <div class="select is-fullwidth">
              <select name={"medication"} onChange={this.handleVisitChange}>
                {visitOptions}
              </select>
            </div>
          </div>
          <div class="column is-3">
            <label class="label">Name</label>
            <article class="message">
              <div class="message-body">{patient.fields.name}</div>
            </article>
            <label class="label">Allergies</label>
            <article class="message">
              <div class="message-body">
                <h2 style={{ color: "red" }}>{patient.fields.drug_allergy}</h2>
              </div>
            </article>
          </div>
          <div class="column is-3">
            <label class="label">Visited Before?</label>
            <article class="message">
              <div class="message-body">{visits.length > 1 ? "Yes" : "No"}</div>
            </article>
          </div>
          <div class="column is-3"></div>
        </div>
      </div>
    );
  }

  renderFirstColumn() {
    let {
      dentalTriage,
      medicalTriage,
      consults,
      visitPrescriptions
    } = this.state;

    // let consultList = visit.fields.consultations;
    let medicalVitals = medicalTriage.fields;
    let dentalVitals = dentalTriage.fields;

    let consultRows = consults.map(consult => {
      let type = consult.fields.type;
      let subType =
        consult.fields.sub_type == null ? "General" : consult.fields.sub_type;
      let doctor = consult.fields.doctor;
      let referredFor =
        consult.fields.referred_for == null
          ? "None"
          : consult.fields.referred_for;

      return (
        <tr>
          <td>{type}</td>
          <td>{subType}</td>
          <td>{doctor}</td>
          <td>{referredFor}</td>
          <td>
            <button
              class="button is-dark level-item"
              onClick={() => this.toggleViewModal("consult", consult)}
            >
              View
            </button>
          </td>
        </tr>
      );
    });

    return (
      <div class="column is-7">
        <div class="columns">
          <div class="column is-6">
            <label class="label">Medical Triage</label>
            {typeof medicalVitals === "undefined" ? (
              <h2>Not Done</h2>
            ) : (
              <button
                class="button is-dark level-item"
                style={{ marginTop: 15 }}
                onClick={() => {
                  this.toggleViewModal("medicalTriage");
                }}
              >
                View
              </button>
            )}
          </div>
          <div class="column is-6">
            <label class="label">Dental Triage</label>
            {typeof dentalVitals === "undefined" ? (
              <h2>Not Done</h2>
            ) : (
              <button
                class="button is-dark level-item"
                style={{ marginTop: 15 }}
                onClick={() => {
                  this.toggleViewModal("dentalTriage");
                }}
              >
                View
              </button>
            )}
          </div>
        </div>

        <hr />
        <label class="label">Consultations</label>
        {consults.length > 0 ? (
          <ConsultationsTable consultRows={consultRows} />
        ) : (
          <h2>Not Done</h2>
        )}

        <hr />
        <label class="label">Prescriptions</label>
        {visitPrescriptions.length > 0 ? (
          <VisitPrescriptionsTable content={visitPrescriptions} />
        ) : (
          <h2>Not Done</h2>
        )}
      </div>
    );
  }

  renderSecondColumn() {
    let { form } = this.props.query;
    let { formDetails, orders } = this.state;

    let formContent = () => {
      switch (form) {
        case "medicalTriage":
          return (
            <MedicalTriageForm
              formDetails={formDetails}
              handleInputChange={this.handleInputChange}
            />
          );
        case "dentalTriage":
          return (
            <DentalTriageForm
              formDetails={formDetails}
              handleInputChange={this.handleInputChange}
            />
          );

        case "medical":
          return (
            <div>
              <MedicalForm
                formDetails={formDetails}
                handleInputChange={this.handleInputChange}
              />
              <hr />
              <label class="label">Prescriptions</label>
              {orders.length > 0 ? this.renderPrescriptionTable() : "None"}
              <button
                class="button is-dark level-item"
                style={{ marginTop: 15 }}
                onClick={() => this.toggleFormModal()}
              >
                Add
              </button>
            </div>
          );
        case "dental":
          return (
            <div>
              <DentalForm
                formDetails={formDetails}
                handleInputChange={this.handleInputChange}
              />
              <hr />
              <label class="label">Prescriptions</label>
              {orders.length > 0 ? this.renderPrescriptionTable() : "None"}
              <button
                class="button is-dark level-item"
                style={{ marginTop: 15 }}
                onClick={() => this.toggleFormModal()}
              >
                Add
              </button>
            </div>
          );
      }
    };

    return (
      <div class="column is-5">
        {formContent()}

        <hr />

        <button
          class="button is-dark is-medium level-item"
          style={{ marginTop: 15 }}
          onClick={() => this.submitForm()}
        >
          Submit
        </button>
      </div>
    );
  }

  renderPrescriptionTable() {
    let { orders } = this.state;

    let orderRows = orders.map((order, index) => {
      let name = order.medicine_name;
      let quantity = order.quantity;

      console.log("name ", name);

      return (
        <tr>
          <td>{name}</td>
          <td>{quantity}</td>
          <td>
            <div class="levels">
              <div class="level-left">
                <button
                  class="button is-dark level-item"
                  onClick={() => this.toggleFormModal(order)}
                >
                  Edit
                </button>
                <button
                  class="button is-dark level-item"
                  onClick={() => {
                    orders.splice(index, 1);
                    this.setState({ orders });
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </td>
        </tr>
      );
    });

    return (
      <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>Medicine Name</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{orderRows}</tbody>
      </table>
    );
  }

  render() {
    if (!this.state.mounted) return null;

    return (
      <div
        style={{
          marginTop: 27.5,
          marginLeft: 25,
          marginRight: 25
        }}
      >
        {this.renderFormModal()}
        {this.renderViewModal()}
        <h1 style={{ color: "black", fontSize: "1.5em" }}>Patient</h1>
        {this.renderHeader()}
        <b>
          Please remember to press the submit button at the end of the form!
        </b>

        <hr />

        <div class="column is-12">
          <div class="columns is-12">
            {this.renderFirstColumn()}
            {this.renderSecondColumn()}
          </div>
        </div>
      </div>
    );
  }
}

const formModalStyles = {
  content: {
    left: "35%",
    right: "17.5%",
    top: "12.5%",
    bottom: "12.5%"
  }
};

const viewModalStyles = {
  content: {
    left: "30%",
    right: "12.5%",
    top: "12.5%",
    bottom: "12.5%"
  }
};

export default withAuthSync(Patient);
