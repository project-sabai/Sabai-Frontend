import React from "react";

class MedicationForm extends React.Component {
  constructor() {
    super();
  }

  render() {
    let { onSubmit, handleInputChange, formDetails } = this.props;
    return (
      <div>
        <label class="label">Medication</label>

        <div class="field">
          <label class="label">Medicine Name</label>
          <div class="control">
            <input
              name="medicine_name"
              class="input"
              type="text"
              onChange={handleInputChange}
              value={formDetails.medicine_name}
            />
          </div>
        </div>

        <div class="field is-grouped">
          <div class="control is-expanded">
            <label class="label">Current Quantity</label>
            <div class="control">
              <label class="label">
                {formDetails.quantity == null ? 0 : formDetails.quantity}
              </label>
            </div>
          </div>

          <div class="control is-expanded">
            <label class="label">Add/ Subtract</label>
            <div class="control">
              <input
                name="changeQuantity"
                class="input"
                type="number"
                onChange={handleInputChange}
                value={formDetails.changeQuantity}
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

        <div class="level-left">
          <button class="button is-dark is-medium" onClick={onSubmit}>
            Submit
          </button>
        </div>
      </div>
    );
  }
}

export { MedicationForm };
