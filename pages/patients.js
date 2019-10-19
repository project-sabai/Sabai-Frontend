import React from "react";
import { withAuthSync, logInCheck } from "../utils/auth";
import Autosuggest from "react-autosuggest";
import axios from "axios";
import styles from "../styles/styles.scss";
import _ from "lodash";
import Modal from "react-modal";
import Webcam from "react-webcam";

const customStyles = {
  content: {
    // top: "50%",
    // left: "50%",
    // right: "auto",
    // bottom: "auto",
    // marginRight: "-50%",
    // transform: "translate(-50%, -50%)"
    // margin:25,
    left: "25%",
    right: "7.5%"
  }
};

const videoConstraints = {
  width: 720,
  height: 720,
  facingMode: "user"
};

const WebcamCapture = () => {
  // upon taking a photo, save it to state
  // submit it
  // provide a button to open the camera again
  // if done so, clear the state and allow retaking

  const webcamRef = React.useRef(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
  }, [webcamRef]);

  return (
    <div
      style={{
        height: 250,
        width: 250,
        margin: "0 auto",
      }}
    >
      <Webcam
        audio={false}
        height={250}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={250}
        videoConstraints={videoConstraints}
      />

      <div
        style={{
          textAlign: "center"
        }}
      >
        <button
          class="button is-dark is-medium"
          onClick={capture}
        >
          Capture
        </button>
      </div>
    </div>
  );
};

Modal.setAppElement("#__next");

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
      patient: {},
      modalIsOpen: false,
      cameraIsOpen: false,
      formDetails: {}
    };

    this.openModal = this.openModal.bind(this);
    // this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
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

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  // afterOpenModal() {
  //   // references are now sync'd and can be accessed.
  //   this.subtitle.style.color = "#f00";
  // }

  closeModal() {
    this.setState({ modalIsOpen: false });
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
        style={{ width: 500, margin: 0, padding: 0 }}
        onClick={() => this.setState({ patient: suggestion })}
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

  render() {
    const { value, suggestions, patient } = this.state;

    console.log("formdetails ", Object.keys(this.state.formDetails));

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
      <div
        class="columns is-vcentered"
        style={{
          margin: 25,
          position: "relative"
        }}
      >
        <Modal
          isOpen={this.state.modalIsOpen}
          // onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div class="columns">
            <form class="column is-8">
              <div class="field">
                <label class="label">Name</label>
                <div class="control">
                  <input
                    name="name"
                    class="input"
                    type="text"
                    onChange={this.handleInputChange}
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
                  />
                </div>
              </div>

              <div class="field">
                <label class="label">Gender</label>
                <div class="control">
                  <div class="select">
                    <select>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
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
                  />
                </div>
              </div>

              <div class="field is-grouped">
                <div class="control">
                  <button
                    class="button is-dark is-medium"
                    onClick={this.closeModal}
                  >
                    Take Photo
                  </button>
                </div>

                <div class="control">
                  <button
                    class="button is-dark is-medium"
                    onClick={this.closeModal}
                  >
                    Take Photo
                  </button>
                </div>
              </div>
            </form>
            <div class="column is-4" >
              {!this.state.isCameraOpen && (
                // <div
                //   class="field is-grouped"
                //   style={{ postion }}
                // >
                // <div class="control">
                <div
                  style={{
                    margin: "0 auto",
                    height: 250,
                    width: 250,
                    backgroundColor: "pink"
                  }}
                ></div>
                // </div>
                // </div>
              )}

              {this.state.isCameraOpen && (
                <div class="control">
                  <WebcamCapture />
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
                  style={{marginTop: this.state.isCameraOpen ? 60: 15}}
                >
                  {this.state.isCameraOpen ? 'Cancel' : 'Take Photo'}
                </button>
              </div>

              {/* <div class="control"></div> */}
            </div>
          </div>
        </Modal>

        <h1 style={{ color: "black", fontSize: "1.5em", marginLeft: 15 }}>
          Registration
        </h1>

        <div
          class="column is-12"
          style={{
            position: "absolute",
            top: 25
          }}
        >
          <div class="levels" style={{ marginBottom: 10 }}>
            <div
              class="level-left"
              // style={{
              //   backgroundColor: "red",
              //   position: "absolute",
              //   top: 0,
              //   right: 0
              // }}
            >
              {/* <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              getSuggestionValue={this.getSuggestionValue}
              renderSuggestion={this.renderSuggestion}
              inputProps={inputProps}
            /> */}
              <button
                class="button is-dark is-medium level-item"
                style={{ display: "inline-block", verticalAlign: "top" }}
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

          {typeof patient.pk !== "undefined" && this.renderPatient()}
        </div>
      </div>
    );
  }
}

export default withAuthSync(Patients);
