import React from "react";
import { withAuthSync, logInCheck } from "../../utils/auth";
import axios from "axios";
import moment from "moment";
import Router from "next/router";
import Modal from "react-modal";
import { PrescriptionForm } from "../../components/forms/prescription";
import { API_URL } from "../../utils/constants";

Modal.setAppElement("#__next");

class Prescription extends React.Component {
  static async getInitialProps(ctx) {
    let authentication = await logInCheck(ctx);
    let { query } = ctx;

    return { query };
  }

  constructor() {
    super();

    this.state = {
      patient: {},
      visit: {},
      orders: [],
      order: {},
      medicationsDict: {},
      mounted: false,
      editModalOpen: false
    };

    this.handleOrderChange = this.handleOrderChange.bind(this);
  }

  componentDidMount() {
    this.onRefresh();
  }

  async onRefresh() {
    let { id: patientId } = this.props.query;

    let { data: patient } = await axios.get(
      `${API_URL}/patients/get?pk=${patientId}`
    );

    let { data: visit } = await axios.get(
      `${API_URL}/visit/get?patient=${patientId}`
    );

    let visitId = visit[visit.length - 1].pk;

    let { data: consultations } = await axios.get(
      `${API_URL}/consults/get?visit=${visitId}`
    );

    let { data: medications } = await axios.get(`${API_URL}/medication/get`);

    let medicationsDict = {};
    medications.forEach(medication => {
      let medicationId = medication.pk;
      let quantity = medication.fields.quantity;

      medicationsDict[medicationId] = quantity;
    });

    this.setState({
      patient: patient[0],
      visit: visit[visit.length - 1],
      medicationsDict,
      consultations
    });

    this.loadMedicationStock();
  }

  async loadMedicationStock() {
    let { visit } = this.state;
    let visitId = visit.pk;

    let { data: orders } = await axios.get(
      `${API_URL}/order/get?visit=${visitId}&order_status=PENDING`
    );
    let { data: medications } = await axios.get(`${API_URL}/medication/get`);
    let { data: allOrders } = await axios.get(
      `${API_URL}/order/get?order_status=PENDING`
    );

    // key -> medicine pk
    // value -> total reserved
    let reservedMedications = {};
    allOrders.forEach(order => {
      let medicationID = order.fields.medicine;
      let quantityReserved = order.fields.quantity;

      if (typeof reservedMedications[medicationID] === "undefined") {
        reservedMedications[medicationID] = quantityReserved;
      } else {
        reservedMedications[medicationID] =
          reservedMedications[medicationID] + quantityReserved;
      }
    });
    console.log("medications: ", medications);
    this.setState({ orders, medications, reservedMedications, mounted: true });
  }

  async massUpdate(flag) {
    let { orders, visit } = this.state;
    let promises = [];

    orders.forEach(order => {
      let orderId = order.pk;
      let payload = {
        order_status: flag
      };

      let medicineId = order.fields.medicine
      let medPayload = {
        quantityChange: order.fields.quantity
      }

      promises.push(
        axios.patch(`${API_URL}/medication/quantity?pk=${medicineId}`, medPayload)
      )
      promises.push(
        axios.patch(`${API_URL}/order/update?pk=${orderId}`, payload)
      );
    });

    let visitPayload = {
      status: "finished"
    };
    promises.push(
      axios.patch(`${API_URL}/visit/update?pk=${visit.pk}`, visitPayload)
    );

    await Promise.all(promises);
    alert("Order Completed!");
  }

  async submitOrderEdit() {
    let { order } = this.state;

    let orderId = order.pk;
    delete order.pk;

    await axios.patch(`${API_URL}/order/update?pk=${orderId}`, order);
    this.toggleEditModal();
  }

  async cancelOrder(order) {
    let orderId = order.pk;

    order.order_status = "REJECTED";
    delete order.pk;

    await axios.patch(`${API_URL}/order/update?pk=${orderId}`, order);
    this.loadMedicationStock();
  }

  handleOrderChange(event) {
    let { order } = this.state;

    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name === "medication") {
      let pKey = value.split(" ")[0];
      let medicineName = value
        .split(" ")
        .slice(1)
        .join(" ");

      order["medicine"] = pKey;
      order["medicine_name"] = medicineName;
    } else {
      order[name] = value;
    }

    this.setState({
      order
    });
  }

  toggleEditModal(order = {}) {
    this.loadMedicationStock();
    this.setState({
      editModalOpen: !this.state.editModalOpen,
      order
    });
  }

  renderEditModal() {
    let {
      patient,
      medications,
      order,
      reservedMedications,
      editModalOpen
    } = this.state;

    console.log("meidince ", medications);

    let options = medications.map(medication => {
      let name = medication.fields.medicine_name;
      let pKey = medication.pk;

      let chosenMedicineValue = `${order.medicine} ${order.medicine_name}`;
      if (chosenMedicineValue == `${pKey} ${name}`)
        return (
          <option value={`${pKey} ${name}`} selected>
            {name}
          </option>
        );

      return <option value={`${pKey} ${name}`}>{name}</option>;
    });

    return (
      <Modal
        isOpen={editModalOpen}
        onRequestClose={() => this.toggleEditModal()}
        style={editModalStyles}
        contentLabel="Example Modal"
      >
        <PrescriptionForm
          allergies={patient.fields.drug_allergy}
          handleInputChange={this.handleOrderChange}
          formDetails={order}
          medicationOptions={options}
          onSubmit={() => this.submitOrderEdit()}
          reservedMedications={reservedMedications}
          medications={medications}
        />
      </Modal>
    );
  }

  renderHeader() {
    let { patient } = this.state;

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
          </div>
          <div class="column is-3">
            <label class="label">Name</label>
            <article class="message">
              <div class="message-body">{patient.fields.name}</div>
            </article>
          </div>
          <div class="column is-3"></div>
        </div>
      </div>
    );
  }

  renderTable() {
    let { orders, medicationsDict } = this.state;

    let orderRows = orders.map(order => {
      let name = order.fields.medicine_name;
      let current_stock = medicationsDict[order.fields.medicine];
      let quantity = order.fields.quantity;
      let doctor = order.fields.doctor;

      let orderEnriched = {
        ...order.fields,
        pk: order.pk
      };

      return (
        <tr>
          <td>{name}</td>
          <td>{current_stock}</td>
          <td>{quantity}</td>
          <td>{doctor}</td>
          <td>
            <div class="levels">
              <div class="level-left">
                <button
                  class="button is-dark level-item"
                  onClick={() => this.toggleEditModal(orderEnriched)}
                >
                  Edit
                </button>
                <button
                  class="button is-dark level-item"
                  onClick={() => this.cancelOrder(orderEnriched)}
                >
                  Cancel
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
            <th>Current Stock</th>
            <th>Quantity</th>
            <th>Doctor</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{orderRows}</tbody>
      </table>
    );
  }

  renderConsultationsTable() {
    let { consultations } = this.state;

    let consultRows = consultations.map(consult => {
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
        </tr>
      );
    });

    return (
      <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>Type</th>
            <th>Sub Type</th>
            <th>Doctor</th>
            <th>Referred For</th>
          </tr>
        </thead>
        <tbody>{consultRows}</tbody>
      </table>
    );
  }

  render() {
    console.log("what now is happening ", this.state.mounted);

    if (!this.state.mounted) return null;

    console.log('uno ', this.state.consultations)
    console.log('dos ', this.state.orders)

    return (
      <div
        style={{
          marginTop: 15,
          marginLeft: 25,
          marginRight: 25
          // position: "relative"
        }}
      >
        {this.renderEditModal()}
        <div class="column is-12">
          <h1 style={{ color: "black", fontSize: "1.5em" }}>
            Approve/ Reject Orders
          </h1>
          {this.renderHeader()}
          <b>
            Do check if the patient has undergone at least one consultation!
          </b>
          <hr />

          <div class="column is-12">
            <label class="label">Consultations</label>
            {this.state.consultations.length > 0 ? this.renderConsultationsTable() : <h2>None</h2>}

            <hr />

            <label class="label">Prescriptions</label>
            {this.state.orders.length > 0 ? this.renderTable() : <h2>None</h2>}
            {/* {this.renderFirstColumn()}
            {this.renderSecondColumn()} */}
          </div>

          <hr />

          <div class="levels">
            <div class="level-left">
              <button
                class="button is-dark level-item"
                onClick={() => this.massUpdate("APPROVED")}
              >
                Approve All
              </button>
              <button
                class="button is-dark level-item"
                onClick={() => this.massUpdate("REJECTED")}
              >
                Reject All
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const editModalStyles = {
  content: {
    left: "30%",
    right: "12.5%",
    top: "12.5%",
    bottom: "12.5%"
  }
};

export default withAuthSync(Prescription);
