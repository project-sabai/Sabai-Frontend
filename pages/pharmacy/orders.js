// code is around 75% similar to that of queue.js
// there is definitely room for refactoring

import React from "react";
import { withAuthSync, logInCheck } from "../../utils/auth";
import axios from "axios";
import moment from "moment";
import Router from "next/router";
import { API_URL } from "../../utils/constants";

class Orders extends React.Component {
  static async getInitialProps(ctx) {
    let authentication = await logInCheck(ctx);
    return authentication;
  }

  constructor() {
    super();

    this.state = {
      visits: [],
      visitsFiltered: [],
      filterString: ""
    };

    this.onFilterChange = this.onFilterChange.bind(this)
  }


  componentDidMount() {
    this.onRefresh();
  }

  async onRefresh() {
    /**
     * NOTE
     * this method is very inefficient
     * next time, let the backend do this
     */

    let dateToday = moment().format("YYYY-MM-DD");

    let { data: visits } = await axios.get(
      `${API_URL}/visit/get?status=started&visit_date=${dateToday}`
    );
    let activePatients = new Set();

    visits.forEach(visit => {
      let patient = visit.fields.patient;
      activePatients.add(patient);
    });

    let { data: patients } = await axios.get(`${API_URL}/patients/get`);
    let patientsFiltered = patients.filter(patient => {
      let patientId = patient.pk;
      return activePatients.has(patientId);
    });

    let patientsObj = {};

    patientsFiltered.forEach(patient => {
      let patientId = patient.pk;

      patientsObj[patientId] = {
        ...patient
      };
    });

    let visitsEnriched = visits.map(visit => {
      let patientId = visit.fields.patient;
      let patient = patientsObj[patientId];

      return {
        ...visit,
        patient
      };
    });

    this.setState({ visits: visitsEnriched, visitsFiltered: visitsEnriched });
  }

  onFilterChange(event) {
    let { visits } = this.state;

    let filteredVisits = visits.filter(visit => {
      let patientId = `${visit.patient.fields.village_prefix}${visit.patient.pk}`.toLowerCase();

      return patientId.includes(event.target.value.toLowerCase());
    });

    this.setState({ visitsFiltered: filteredVisits });
  }

  renderTableContent() {
    let { visitsFiltered } = this.state;
    let visitsRows = visitsFiltered.map(visit => {
      let Id = `${visit.patient.fields.village_prefix}${visit.patient.pk}`;
      let imageUrl = `${API_URL}/media/${visit.patient.fields.picture}`;
      let fullName = visit.patient.fields.name;

      let action = (
        <button
          class="button is-dark level-item"
          onClick={() => {
            Router.push(`/pharmacy/prescription?id=${visit.patient.pk}`);
          }}
        >
          View
        </button>
      );

      return (
        <tr>
          <td>{Id}</td>
          <td>
            <figure class="image is-96x96">
              <img
                src={imageUrl}
                alt="Placeholder image"
                style={{ height: 96, width: 96, objectFit: "cover" }}
              />
            </figure>
          </td>
          <td>{fullName}</td>
          <td>{action}</td>
        </tr>
      );
    });

    return visitsRows;
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
        <div class="column is-12">
          <h1 style={{ color: "black", fontSize: "1.5em" }}>Approve/ Reject Orders</h1>
          <div class="field">
            <div class="control">
              <input
                class="input is-medium"
                type="text"
                placeholder="Search Patient"
                onChange={this.onFilterChange}
              />
            </div>
          </div>
          <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
            <thead>
              <tr>
                <th>ID</th>
                <th>Photo</th>
                <th>Full Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{this.renderTableContent()}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default withAuthSync(Orders);
