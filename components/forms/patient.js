import React from "react";

class DentalTriageForm extends React.Component {
  constructor() {
    super();
  }

  render() {
    let { handleInputChange, formDetails } = this.props;

    return (
      <div>
        <label class="label">Dental Triage Form</label>
        <div class="field">
          <label class="label">Complaints</label>
          <div class="control">
            <textarea
              name="complaints"
              class="textarea"
              placeholder="Textarea"
              onChange={handleInputChange}
              value={formDetails.complaints}
            />
          </div>
        </div>

        <div class="field">
          <label class="label">Intraoral</label>
          <div class="control">
            <textarea
              name="intraoral"
              class="textarea"
              placeholder="Textarea"
              onChange={handleInputChange}
              value={formDetails.intraoral}
            />
          </div>
        </div>

        <div class="field">
          <label class="label">Diagnosis</label>
          <div class="control">
            <textarea
              name="diagnosis"
              class="textarea"
              placeholder="Textarea"
              onChange={handleInputChange}
              value={formDetails.diagnosis}
            />
          </div>
        </div>

        <hr />
        <label class="label">Treatments Needed</label>

        <div class="field">
          <label class="label">EXO</label>
          <div class="control">
            <input
              name="exo"
              class="input"
              type="text"
              onChange={handleInputChange}
              value={formDetails.exo}
            />
          </div>
        </div>

        <div class="field">
          <label class="label">CAP</label>
          <div class="control">
            <input
              name="cap"
              class="input"
              type="text"
              onChange={handleInputChange}
              value={formDetails.cap}
            />
          </div>
        </div>

        <div class="field">
          <label class="label">SDF</label>
          <div class="control">
            <input
              name="sdf"
              class="input"
              type="text"
              onChange={handleInputChange}
              value={formDetails.sdf}
            />
          </div>
        </div>

        <div class="field">
          <label class="label">F</label>
          <div class="control">
            <input
              name="f"
              class="input"
              type="text"
              onChange={handleInputChange}
              value={formDetails.f}
            />
          </div>
        </div>

        <div class="field">
          <label class="label">Others</label>
          <div class="control">
            <input
              name="others"
              class="input"
              type="text"
              onChange={handleInputChange}
              value={formDetails.others}
            />
          </div>
        </div>
      </div>
    );
  }
}

class MedicalTriageForm extends React.Component {
  constructor() {
    super();
  }

  render() {
    let { handleInputChange, formDetails } = this.props;

    return (
      <div>
        <label class="label">Medical Triage Form</label>
        <div class="field is-grouped">
          <div class="control is-expanded">
            <label class="label">Height</label>
            <div class="control">
              <input
                name="height"
                class="input"
                type="number"
                onChange={handleInputChange}
                value={formDetails.height}
              />
            </div>
          </div>

          <div class="control is-expanded">
            <label class="label">Weight</label>
            <div class="control">
              <input
                name="weight"
                class="input"
                type="number"
                onChange={handleInputChange}
                value={formDetails.weight}
              />
            </div>
          </div>
        </div>

        <div class="field is-grouped">
          <div class="control is-expanded">
            <label class="label">Systolic</label>
            <div class="control">
              <input
                name="systolic"
                class="input"
                type="number"
                onChange={handleInputChange}
                value={formDetails.systolic}
              />
            </div>
          </div>

          <div class="control is-expanded">
            <label class="label">Diastolic</label>
            <div class="control">
              <input
                name="diastolic"
                class="input"
                type="number"
                onChange={handleInputChange}
                value={formDetails.diastolic}
              />
            </div>
          </div>
        </div>

        <div class="field is-grouped">
          <div class="control is-expanded">
            <label class="label">Temperature</label>
            <div class="control">
              <input
                name="temperature"
                class="input"
                type="number"
                onChange={handleInputChange}
                value={formDetails.temperature}
              />
            </div>
          </div>

          <div class="control is-expanded">
            <label class="label">Heart Rate</label>
            <div class="control">
              <input
                name="heart_rate"
                class="input"
                type="number"
                onChange={handleInputChange}
                value={formDetails.heart_rate}
              />
            </div>
          </div>
        </div>

        <div class="field">
          {/* <label class="label">HIV Po</label> */}
          <div class="control">
            <label class="checkbox">
              <input
                type="checkbox"
                name="hiv_positive"
                onChange={handleInputChange}
                value={formDetails.hiv_positive}
              />
              HIV Positive?
            </label>
          </div>
        </div>

        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input
                type="checkbox"
                name="ptb_positive"
                onChange={handleInputChange}
                value={formDetails.ptb_positive}
              />
              PTB Positive?
            </label>
          </div>
        </div>

        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input
                type="checkbox"
                name="hepc_positive"
                onChange={handleInputChange}
                value={formDetails.hepc_positive}
              />
              HEPC Positive?
            </label>
          </div>
        </div>
      </div>
    );
  }
}

class DentalForm extends React.Component {
  constructor() {
    super();
  }

  render() {
    let { handleInputChange, formDetails } = this.props;

    return (
      <div>
        <label class="label">Dental Consultation Form</label>

        <div>
          <label class="label">Treatments Done</label>
          <label class="label">EXO</label>
          <div class="control" style={{ marginBottom: 20 }}>
            <input
              name="exo"
              class="input"
              type="text"
              onChange={handleInputChange}
              value={formDetails.exo}
            />
          </div>

          <label class="label">CAP</label>
          <div class="control" style={{ marginBottom: 20 }}>
            <input
              name="cap"
              class="input"
              type="text"
              onChange={handleInputChange}
              value={formDetails.cap}
            />
          </div>

          <label class="label">SDF</label>
          <div class="control" style={{ marginBottom: 20 }}>
            <input
              name="sdf"
              class="input"
              type="text"
              onChange={handleInputChange}
              value={formDetails.sdf}
            />
          </div>

          <label class="label">F</label>
          <div class="control" style={{ marginBottom: 20 }}>
            <input
              name="f"
              class="input"
              type="text"
              onChange={handleInputChange}
              value={formDetails.f}
            />
          </div>

          <label class="label">Others</label>
          <div class="control" style={{ marginBottom: 20 }}>
            <input
              name="others"
              class="input"
              type="text"
              onChange={handleInputChange}
              value={formDetails.others}
            />
          </div>
        </div>

        <hr />

        <div class="field">
          <label class="label">Notes</label>
          <div class="control">
            <textarea
              name="notes"
              class="textarea"
              placeholder="Textarea"
              onChange={handleInputChange}
              value={formDetails.notes}
            />
          </div>
        </div>

        <hr />

        <div class="field">
          <label class="label">Referred for (within clinic)</label>
          <div class="control" style={{ marginBottom: 20 }}>
            <input
              name="referred_for"
              class="input"
              type="text"
              placeholder="Type specialty here..."
              onChange={handleInputChange}
              value={formDetails.referred_for}
            />
          </div>
        </div>
      </div>
    );
  }
}

class MedicalForm extends React.Component {
  constructor() {
    super();
  }

  render() {
    let { handleInputChange, formDetails } = this.props;

    return (
      <div>
        <label class="label">Medical Consultation Form</label>

        <label class="label">Sub-type</label>
        <div class="control" style={{ marginBottom: 20 }}>
          <input
            name="sub_type"
            class="input"
            type="text"
            placeholder="General"
            onChange={handleInputChange}
            value={formDetails.sub_type}
          />
        </div>

        <div class="field">
          <label class="label">Problems</label>
          <div class="control">
            <textarea
              name="problems"
              class="textarea"
              placeholder="Type your problems here..."
              onChange={handleInputChange}
              value={formDetails.problems}
            />
          </div>
        </div>

        <div class="field">
          <label class="label">Diagnosis</label>
          <div class="control">
            <textarea
              name="diagnosis"
              class="textarea"
              placeholder="Type your diagnosis here..."
              onChange={handleInputChange}
              value={formDetails.diagnosis}
            />
          </div>
        </div>

        <div class="field">
          <label class="label">Notes</label>
          <div class="control">
            <textarea
              name="notes"
              class="textarea"
              placeholder="Type your notes here..."
              onChange={handleInputChange}
              value={formDetails.notes}
            />
          </div>
        </div>

        <hr />

        <div class="field">
          <label class="label">Referred for (within clinic)</label>
          <div class="control" style={{ marginBottom: 20 }}>
            <input
              name="referred_for"
              class="input"
              type="text"
              placeholder="Type specialty here..."
              onChange={handleInputChange}
              value={formDetails.referred_for}
            />
          </div>
        </div>
      </div>
    );
  }
}

class PrescriptionForm extends React.Component {
  constructor() {
    super();
  }

  calculateMedicineCurrentStock(medicine) {
    let { medications } = this.props;

    let medication = medications.filter(med => {
      // console.log('... ', med.pk, medicine)
      return medicine == med.pk;
    });

    if (medication.length > 0) return medication[0].fields.quantity;
    return 0;
  }

  calculateMedicineReservedStock(medicine) {
    let { reservedMedications } = this.props;

    if (typeof reservedMedications[medicine] === "undefined") return 0;
    else return reservedMedications[medicine];
  }

  render() {
    let {
      allergies,
      handleInputChange,
      formDetails,
      medicationOptions,
      onSubmit,
      isEditing
    } = this.props;

    return (
      <div class="column is-12">
        <h1 style={{ color: "black", fontSize: "1.5em" }}>Prescription</h1>

        <div class="field">
          <label class="label">Allergies</label>
          <h2 style={{ color: "red" }}>{allergies}</h2>
        </div>

        <div class="field">
          <label class="label">Medicine</label>
          <div class="select is-fullwidth">
            <select name={"medication"} onChange={handleInputChange}>
              <option value={"0 Dummy"}>-</option>
              {medicationOptions}
            </select>
          </div>
        </div>

        <div class="field is-grouped">
          <div class="control is-expanded">
            <label class="label">In Stock</label>
            <h2>{this.calculateMedicineCurrentStock(formDetails.medicine)}</h2>
          </div>

          <div class="control is-expanded">
            <label class="label">Currently Reserved</label>
            <h2>{this.calculateMedicineReservedStock(formDetails.medicine)}</h2>
          </div>

          <div class="control is-expanded">
            <label class="label">Quantity to be ordered</label>
            <div class="control">
              <input
                name="quantity"
                class="input"
                type="number"
                onChange={handleInputChange}
                value={formDetails.quantity}
              />
            </div>
          </div>
        </div>

        <div class="field">
          <label class="label">Dosage Instructions</label>
          <div class="control">
            <textarea
              name="notes"
              class="textarea"
              placeholder="Textarea"
              onChange={handleInputChange}
              value={formDetails.notes}
            />
          </div>
        </div>

        <button
          class="button is-dark is-medium level-item"
          style={{ marginTop: 15 }}
          onClick={onSubmit}
        >
          {isEditing ? "Edit" : "Add"}
        </button>
      </div>
    );
  }
}

export {
  DentalTriageForm,
  MedicalTriageForm,
  DentalForm,
  MedicalForm,
  PrescriptionForm
};
