import React from "react";

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

        <button
          class="button is-dark is-medium level-item"
          style={{ marginTop: 15 }}
          onClick={onSubmit}
        >
          Edit
        </button>
      </div>
    );
  }
}

export { PrescriptionForm };
