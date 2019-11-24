import React from "react";
import { withAuthSync, logInCheck } from "../utils/auth";
import axios from "axios";
import moment from "moment";
import Router from "next/router";
import { API_URL } from "../utils/constants";

class Records extends React.Component {
  static async getInitialProps(ctx) {
    let authentication = await logInCheck(ctx);
    let { query } = ctx;

    return { query };
  }

  constructor() {
    super();

    this.state = {
      patients: [],
      patientsFiltered: [],
      filterString: ""
    };

    this.onFilterChange = this.onFilterChange.bind(this);
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

    let { data: patients } = await axios.get(`${API_URL}/patients/get`);

    this.setState({ patients, patientsFiltered: patients });
  }

  renderTableContent() {
    let { patientsFiltered, formChoices } = this.state;
    let patientsRows = patientsFiltered.map(patient => {
      let Id = `${patient.fields.village_prefix}${patient.pk}`;
      let imageUrl = `${API_URL}/media/${patient.fields.picture}`;
      let fullName = patient.fields.name;

      let progress = (
        <button
          class="button is-dark level-item"
          onClick={() => {
            Router.push(`/record?id=${patient.pk}`);
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
                // src="https://bulma.io/images/placeholders/96x96.png"
                src={imageUrl}
                alt="Placeholder image"
                style={{ height: 96, width: 96, objectFit: "cover" }}
              />
            </figure>
          </td>
          <td>{fullName}</td>

          <td>{progress}</td>
        </tr>
      );
    });

    return patientsRows;
  }

  onFilterChange(event) {
    // get
    let { patients } = this.state;
    // console.log("event.value", event.target.value);

    let patientsFiltered = patients.filter(patient => {
      let patient_details = patient.fields;
      let name = patient_details.name;
      let contact_no = patient_details.contact_no;
      let village = patient_details.village_prefix;
      let id = patient.pk;

      let patientFilter = `${village}${id} ${name} ${contact_no}`.toLowerCase();

      return patientFilter.includes(event.target.value.toLowerCase());
    });

    this.setState({ patientsFiltered });
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
          <h1 style={{ color: "black", fontSize: "1.5em" }}>Records</h1>
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

export default withAuthSync(Records);
