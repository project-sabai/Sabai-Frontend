import React from "react";
import { withAuthSync, logInCheck } from "../utils/auth";
import Autosuggest from "react-autosuggest";
import axios from "axios";
import styles from "../styles/styles.scss";
import _ from "lodash";
import Modal from "react-modal";
import Webcam from "react-webcam";
import moment from "moment";
import { API_URL } from "../utils/constants";

// put id

Modal.setAppElement("#__next");

class Patients extends React.Component {
  static async getInitialProps(ctx) {
    let authentication = await logInCheck(ctx);
    console.log("what is this ", authentication);

    let { query } = ctx;

    return { query };
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
      patient: {},
      scanModalIsOpen: false,
      modalIsOpen: false,
      cameraIsOpen: false,
      imageDetails: null,
      formDetails: {
        gender: "Male"
      },
      scanOptions: {
        gender: "Male"
      },
      possibleOptions: []
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openScanModal = this.openScanModal.bind(this);
    this.closeScanModal = this.closeScanModal.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.webcamSetRef = this.webcamSetRef.bind(this);
    this.webcamCapture = this.webcamCapture.bind(this);
    this.submitNewPatient = this.submitNewPatient.bind(this);
    this.handleScanOptionsChange = this.handleScanOptionsChange.bind(this);
  }

  componentDidMount() {
    this.onRefresh();
  }

  async onRefresh() {
    console.log("loading data now");

    let { data: patients } = await axios.get(`${API_URL}/patients/get`);
    // console.log('this is the data ', patients)
    let patientsEnriched = this.patientsEnrich(patients);

    this.setState({ patients: patientsEnriched });
  }

  /**
   * Webcam functions
   */

  webcamSetRef(webcam) {
    this.webcam = webcam;
  }

  webcamCapture() {
    const imageSrc = this.webcam.getScreenshot();
    this.setState({
      imageDetails: imageSrc,
      isCameraOpen: false
    });
  }

  renderWebcam() {
    return (
      <div
        style={{
          height: 250,
          width: 250,
          margin: "0 auto"
        }}
      >
        <Webcam
          audio={false}
          height={250}
          width={250}
          ref={this.webcamSetRef}
          screenshotFormat="image/jpeg"
          screenshotQuality={1}
          videoConstraints={videoConstraints}
        />

        <div
          style={{
            textAlign: "center"
          }}
        >
          <button class="button is-dark is-medium" onClick={this.webcamCapture}>
            Capture
          </button>
        </div>
      </div>
    );
  }

  /**
   * General functions
   */
  // for noww, all we want to do is to add a filter string to this
  // perhaps in the future, we would want to let our backend do this for us
  patientsEnrich(patients) {
    let patientsEnriched = patients.map(patient => {
      let patient_details = patient.fields;
      let name = patient_details.name;
      let contact_no = patient_details.contact_no;
      let village = patient_details.village_prefix;
      let id = patient.pk;
      let localName = patient_details.local_name;

      return {
        ...patient,
        filterString: `${village}${id} ${name} ${contact_no} ${localName}`
      };
    });

    return patientsEnriched;
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

  handleScanOptionsChange(event) {
    let { scanOptions } = this.state;

    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    scanOptions[name] = value;

    this.setState({
      scanOptions
    });
  }

  async submitNewPatient() {
    let { formDetails, imageDetails } = this.state;

    let checklist = [
      "name",
      "local_name",
      "gender",
      "contact_no",
      "travelling_time_to_village",
      "date_of_birth",
      "drug_allergy",
      "village_prefix"
    ];

    let errorCount = 0;
    checklist.forEach(item => {
      if (typeof formDetails[item] == "undefined") {
        errorCount += 1;
      }
    });

    if (errorCount > 0) {
      alert("Please complete the form before submitting!");
    } else if (imageDetails == null) {
      alert("Please take a photo before submitting!");
    } else {
      let payload = {
        ...formDetails,
        imageDetails
      };

      let { data: response } = await axios.post(
        `${API_URL}/patients/new`,
        payload
      );

      if(typeof response.error == 'undefined'){
        this.setState({
          patient: response[0],
          formDetails: {
            gender: "Male"
          },
          imageDetails: null
        });
        alert("New patient registered!");
        this.closeModal();
      }else{alert("Please retake photo!")}


    }
  }

  async scanPatient() {
    let { scanOptions, imageDetails } = this.state;
    let payload = {
      imageDetails
    };

    let gender = scanOptions.gender;
    let scanUrl = `${API_URL}/patients/find_by_scan?`;
    scanUrl += `gender=${gender}`;
    if (typeof scanOptions.village_prefix != "undefined") {
      scanUrl += `&village_prefix=${scanOptions.village_prefix}`;
    }

    let { data: possibleOptions } = await axios.post(scanUrl, payload);
    if (possibleOptions.length > 0) alert("Options found!");
    else alert("No options found!");

    this.setState({ possibleOptions });
  }

  async submitNewVisit() {
    let { patient } = this.state;

    // future helper function
    // get all active visits
    // sort them by their statuses
    // from there, determine where to put this guy

    let payload = {
      patient: patient.pk,
      status: "started",
      visit_date: moment().format("YYYY-MM-DD")
    };

    await axios.post(`${API_URL}/visit/new`, payload);

    this.setState({
      patient: {}
    });
    alert("Patient successfully registered!");
  }

  /**
   * Modal functions
   */

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  openScanModal() {
    this.setState({ scanModalIsOpen: true });
    console.log("hey");
  }

  closeScanModal() {
    this.setState({ scanModalIsOpen: false });
  }

  renderScanModal() {
    let { scanOptions, possibleOptions } = this.state;

    let tableContents = possibleOptions.map(option => {
      let fields = option.fields;
      let name = fields.name;
      let id = `${fields.village_prefix}${option.pk}`;
      let imageUrl = `${API_URL}/media/${fields.picture}`;
      let dateOfBirth = moment(fields.date_of_birth).format("DD MMM YYYY");

      let select = (
        <button
          class="button is-dark level-item"
          onClick={() => {
            this.closeScanModal();
            this.setState({ patient: option });
          }}
        >
          Select
        </button>
      );

      return (
        <tr>
          <td>{id}</td>
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
          <td>{name}</td>
          <td>{dateOfBirth}</td>
          <td>{select}</td>
        </tr>
      );
    });

    return (
      <Modal
        isOpen={this.state.scanModalIsOpen}
        // onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeScanModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div>
          <h1 style={{ color: "black", fontSize: "1.5em", marginBottom: 15 }}>
            Scan Face
          </h1>
          <div class="columns">
            <div class="column is-4">
              {!this.state.isCameraOpen && (
                <div
                  style={{
                    margin: "0 auto",
                    height: 250,
                    width: 250,
                    backgroundColor: "grey"
                  }}
                >
                  {this.state.imageDetails != null && (
                    <img src={this.state.imageDetails} />
                  )}
                </div>
              )}

              {this.state.isCameraOpen && (
                <div class="control">
                  {/* <WebcamCapture /> */}
                  {this.renderWebcam()}
                </div>
              )}
              <div
                style={{
                  textAlign: "center"
                }}
              >
                <button
                  class="button is-dark is-medium"
                  onClick={() =>
                    this.setState({ isCameraOpen: !this.state.isCameraOpen })
                  }
                  style={{ marginTop: this.state.isCameraOpen ? 60 : 15 }}
                >
                  {this.state.isCameraOpen ? "Cancel" : "Take Photo"}
                </button>
              </div>
            </div>
            <div class="column is-4">
              <div class="field">
                <label class="label">Gender</label>
                <div class="control">
                  <div class="select" style={{ margin: "0 auto" }}>
                    <select
                      name="gender"
                      onChange={this.handleScanOptionsChange}
                    >
                      <option
                        selected={scanOptions.gender === "Male"}
                        value="Male"
                      >
                        Male
                      </option>
                      <option
                        selected={scanOptions.gender === "Female"}
                        value="Female"
                      >
                        Female
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="field">
                <label class="label">Village Prefix</label>
                <div class="control">
                  <input
                    name="village_prefix"
                    class="input"
                    type="text"
                    onChange={this.handleScanOptionsChange}
                    value={scanOptions.village_prefix}
                  />
                </div>
              </div>

              <div>
                <button
                  class="button is-dark is-medium"
                  onClick={() => this.scanPatient()}
                  style={{ marginTop: 10 }}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          <hr />

          <label class="label">Results</label>
          {possibleOptions.length > 0 ? (
            <div>
              <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Photo</th>
                    <th>Full Name</th>
                    <th>Date of Birth </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>{tableContents}</tbody>
              </table>
            </div>
          ) : (
            <h2>No matches found!</h2>
          )}
        </div>
      </Modal>
    );
  }

  renderModal() {
    const { formDetails } = this.state;

    return (
      <Modal
        isOpen={this.state.modalIsOpen}
        // onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div class="columns">
          <div class="column is-8">
            <form>
              <div class="field">
                <label class="label">Name</label>
                <div class="control">
                  <input
                    name="name"
                    class="input"
                    type="text"
                    onChange={this.handleInputChange}
                    value={formDetails.name}
                  />
                </div>
              </div>

              <div class="field">
                <label class="label">Local Name</label>
                <div class="control">
                  <input
                    name="local_name"
                    class="input"
                    type="text"
                    onChange={this.handleInputChange}
                    value={formDetails.local_name}
                  />
                </div>
              </div>

              <div class="field">
                <label class="label">Gender</label>
                <div class="control">
                  <div class="select">
                    <select name="gender" onChange={this.handleInputChange}>
                      <option
                        selected={formDetails.gender === "Male"}
                        value="Male"
                      >
                        Male
                      </option>
                      <option
                        selected={formDetails.gender === "Female"}
                        value="Female"
                      >
                        Female
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="field is-grouped">
                <div class="control is-expanded">
                  <label class="label">Contact Number</label>
                  <div class="control">
                    <input
                      name="contact_no"
                      class="input"
                      type="tel"
                      onChange={this.handleInputChange}
                      value={formDetails.contact_no}
                    />
                  </div>
                </div>

                <div class="control is-expanded">
                  <label class="label">Date of Birth</label>
                  <div class="control">
                    <input
                      name="date_of_birth"
                      class="input"
                      type="date"
                      onChange={this.handleInputChange}
                      value={formDetails.date_of_birth}
                    />
                  </div>
                </div>
              </div>

              <div class="field is-grouped">
                <div class="control is-expanded">
                  <label class="label">Village Prefix</label>
                  <div class="control">
                    <input
                      name="village_prefix"
                      class="input"
                      type="text"
                      onChange={this.handleInputChange}
                      value={formDetails.village_prefix}
                    />
                  </div>
                </div>

                <div class="control is-expanded">
                  <label class="label">Travelling Time to Village</label>
                  <div class="control">
                    <input
                      name="travelling_time_to_village"
                      class="input"
                      type="number"
                      onChange={this.handleInputChange}
                      value={formDetails.travelling_time_to_village}
                    />
                  </div>
                </div>
              </div>

              <div class="field">
                <label class="label">Drug Allergies</label>
                <div class="control">
                  <textarea
                    name="drug_allergy"
                    class="textarea"
                    placeholder="Textarea"
                    onChange={this.handleInputChange}
                    value={formDetails.drug_allergy}
                  />
                </div>
              </div>
            </form>
            <div class="levels" style={{ marginTop: 10 }}>
              <div class="level-left">
                <div class="level-item">
                  <button
                    class="button is-dark is-medium"
                    onClick={this.submitNewPatient}
                  >
                    Submit
                  </button>
                </div>

                <div class="level-item">
                  <button
                    class="button is-dark is-medium"
                    onClick={this.closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="column is-4">
            {!this.state.isCameraOpen && (
              <div
                style={{
                  margin: "0 auto",
                  height: 250,
                  width: 250,
                  backgroundColor: "grey"
                }}
              >
                {this.state.imageDetails != null && (
                  <img src={this.state.imageDetails} />
                )}
              </div>
            )}

            {this.state.isCameraOpen && (
              <div class="control">
                {/* <WebcamCapture /> */}
                {this.renderWebcam()}
              </div>
            )}
            <div
              style={{
                textAlign: "center"
              }}
            >
              <button
                class="button is-dark is-medium"
                onClick={() =>
                  this.setState({ isCameraOpen: !this.state.isCameraOpen })
                }
                style={{ marginTop: this.state.isCameraOpen ? 60 : 15 }}
              >
                {this.state.isCameraOpen ? "Cancel" : "Take Photo"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  /**
   * Auto Suggestions functions
   */

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
    let imageURL = suggestion.fields.picture;

    return (
      <div
        class="card"
        style={{ width: 500, margin: 0, padding: 0 }}
        onClick={() => this.setState({ patient: suggestion })}
      >
        <div class="card-content">
          <div class="media">
            <div class="media-left">
              <figure class="image is-96x96">
                <img
                  // src="https://bulma.io/images/placeholders/96x96.png"
                  src={`${API_URL}/media/${imageURL}`}
                  alt="Placeholder image"
                  style={{ height: 96, width: 96, objectFit: "cover" }}
                />
              </figure>
            </div>
            <div class="media-content">
              <div class="title is-4">{name}</div>
              <div class="subtitle is-6">{id}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
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

  renderPatient() {
    let { patient } = this.state;

    return (
      <div>
        <h1>{patient.fields.name}</h1>
        <h1>
          {patient.fields.village_prefix} {patient.pk}
        </h1>
      </div>
    );
  }

  render() {
    const { value, suggestions, patient } = this.state;

    console.log("formdetails ", Object.keys(this.state.formDetails));

    console.log("this is our patient ", patient);

    console.log("this is the props query ", this.props.query);

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
      <div
        style={{
          marginTop: 15,
          marginLeft: 25,
          marginRight: 25
          // position: "relative"
        }}
      >
        {this.renderModal()}
        {this.renderScanModal()}
        <div class="column is-12">
          <h1 style={{ color: "black", fontSize: "1.5em" }}>Registration</h1>
        </div>
        <div class="columns is-vcentered">
          <div
            class="column is-12"
            style={
              {
                // position: "absolute",
                // top: 25,
                // backgroundColor: "brown"
              }
            }
          >
            <div class="levels" style={{ marginBottom: 10 }}>
              <div class="level-left">
                <button
                  class="button is-dark is-medium level-item"
                  style={{ display: "inline-block", verticalAlign: "top" }}
                  onClick={this.openScanModal}
                >
                  Scan Face
                </button>
                <button
                  class="button is-dark is-medium level-item"
                  onClick={this.openModal}
                >
                  New Patient
                </button>
              </div>
            </div>

            <div>
              <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                inputProps={inputProps}
              />
            </div>
          </div>
        </div>
        {typeof patient.pk !== "undefined" && (
          <div class="columns">
            <div class="column is-2">
              <figure class="image is-1by1">
                <img
                  src={`${API_URL}/media/${patient.fields.picture}`}
                  alt="Placeholder image"
                  class="has-ratio"
                  style={{ height: 200, width: 200, objectFit: "cover" }}
                />
              </figure>
            </div>
            <div class="column is-5">
              <label class="label">ID</label>
              <article class="message">
                <div class="message-body">{`${patient.fields.village_prefix}${patient.pk}`}</div>
              </article>
              <label class="label">Name</label>
              <article class="message">
                <div class="message-body">{patient.fields.name}</div>
              </article>
              <label class="label">Local Name</label>
              <article class="message">
                <div class="message-body">{patient.fields.local_name}</div>
              </article>
              <label class="label">Gender</label>
              <article class="message">
                <div class="message-body">{patient.fields.gender}</div>
              </article>
              <label class="label">Date of Birth</label>
              <article class="message">
                <div class="message-body">{patient.fields.date_of_birth}</div>
              </article>
              <label class="label">Travelling Time to Village</label>
              <article class="message">
                <div class="message-body">
                  {patient.fields.travelling_time_to_village}
                </div>
              </article>
              <label class="label">Drug Allergies</label>
              <article class="message">
                <div class="message-body">{patient.fields.drug_allergy}</div>
              </article>
            </div>
            <div
              class="column is-5"
              // style={{ backgroundColor: "yellow" }}
            >
              <label class="label">Start a Visit</label>
              <button
                class="button is-dark is-medium level-item"
                onClick={() => this.submitNewVisit()}
              >
                Start
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const customStyles = {
  content: {
    left: "25%",
    right: "7.5%"
  }
};

const videoConstraints = {
  width: 720,
  height: 720,
  facingMode: "user"
};

export default withAuthSync(Patients);
