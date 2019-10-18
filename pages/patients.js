import React from "react";
import { withAuthSync, logInCheck } from "../utils/auth";
import Autosuggest from "react-autosuggest";
import axios from "axios";
import styles from "../styles/styles.scss";
import _ from "lodash";

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name;

class Patients extends React.Component {
  static async getInitialProps(ctx) {
    let authentication = await logInCheck(ctx);
    return authentication;
  }

  constructor() {
    super();

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: "",
      suggestions: [],
      patients: [],
      patient: {}
    };
  }

  componentDidMount() {
    this.onRefresh();
  }

  async onRefresh() {
    console.log("loading data now");

    let { data: patients } = await axios.get(
      "http://localhost:8000/patients/get"
    );
    // console.log('this is the data ', patients)
    let patientsEnriched = this.patientsEnrich(patients);

    this.setState({ patients: patientsEnriched });
  }

  // for noww, all we want to do is to add a filter string to this
  // perhaps in the future, we would want to let our backend do this for us
  patientsEnrich(patients) {
    let patientsEnriched = patients.map(patient => {
      let patient_details = patient.fields;
      let name = patient_details.name;
      let contact_no = patient_details.contact_no;
      let village = patient_details.village_prefix;
      let id = patient.pk;

      return {
        ...patient,
        filterString: `${village}${id} ${name} ${contact_no}`
      };
    });

    return patientsEnriched;
  }

  getSuggestions(filter) {
    let { patients } = this.state;
    let inputValue = filter.trim().toLowerCase();
    let inputLength = inputValue.length;

    console.log("working this thing", inputLength);
    console.log(patients);

    let query =
      inputLength === 0
        ? []
        : patients.filter(patient =>
            patient.filterString.toLowerCase().includes(inputValue)
          );

    console.log("this ", query);

    return query;
  }

  renderSuggestion(suggestion) {
    let name = suggestion.fields.name;
    let id = `${suggestion.fields.village_prefix} ${suggestion.pk}`;

    return (
      <div
        class="card"
        style={{ width: 500 }}
        onClick={() => console.log("boo")}
      >
        <div class="card-content">
          <div class="media">
            <div class="media-left">
              <figure class="image is-48x48">
                <img
                  src="https://bulma.io/images/placeholders/96x96.png"
                  alt="Placeholder image"
                />
              </figure>
            </div>
            <div class="media-content">
              <p class="title is-4">{name}</p>
              <p class="subtitle is-6">{id}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  getSuggestionValue(suggestion) {
    return suggestion.fields.name;
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  async loadPatient() {
    let { value } = this.state;
    let uri = `http://localhost:8000/patients/get?name=${encodeURIComponent(
      value
    )}`;

    console.log("working?", value);

    let { data: patient } = await axios.get(uri);

    this.setState({ patient: patient[0] });
  }

  renderPatient(){
    let { patient } = this.state

    return(
      <div>
        <h1>{patient.fields.name}</h1>
        <h1>{patient.fields.village_prefix} {patient.pk}</h1>
      </div>
    )
  }

  render() {
    const { value, suggestions, patient } = this.state;

    console.log("this is our patient ", patient);

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: "Search Patient",
      type: "search",
      value,
      onChange: this.onChange,
      className: "input is-medium level-item",
      style: { width: 500 }
    };

    // Finally, render it!
    return (
      <div style={{ padding: 25 }}>
        <div class="level">
          <div class="level-left">
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              getSuggestionValue={this.getSuggestionValue}
              renderSuggestion={this.renderSuggestion}
              inputProps={inputProps}
            />
            <button
              class="button is-dark is-medium level-item"
              onClick={() => this.loadPatient()}
            >
              Load Patient
            </button>
            <a class="button is-dark is-medium level-item">Take Photo</a>
            <a class="button is-dark is-medium level-item">New Patient</a>
          </div>
        </div>

        {typeof patient.pk !== "undefined" && this.renderPatient()}
      </div>
    );
  }
}

export default withAuthSync(Patients);
