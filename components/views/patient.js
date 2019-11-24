import React from "react";

class ConsultationsTable extends React.Component {
  constructor() {
    super();
  }

  render() {
    let { consultRows } = this.props;

    return (
      <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>Type</th>
            <th>Sub Type</th>
            <th>Doctor</th>
            <th>Referred For</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{consultRows}</tbody>
      </table>
    );
  }
}

class ConsultationsView extends React.Component {
  constructor() {
    super();
  }

  renderPrescriptions(prescriptions) {
    let prescriptionRows = prescriptions.map(prescription => {
      let name = prescription.fields.medicine_name;
      let quantity = prescription.fields.quantity;
      let notes = prescription.fields.notes;

      return (
        <tr>
          <td>{name}</td>
          <td>{quantity}</td>
          <td>{notes}</td>
        </tr>
      );
    });

    return (
      <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>Medicine Name</th>
            <th>Quantity</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>{prescriptionRows}</tbody>
      </table>
    );
  }

  renderMedicalConsultation(content) {
    let fields = content.fields;
    let prescriptions = content.prescriptions;

    return (
      <div>
        <div class="field">
          <label class="label">Sub Type</label>
          <article class="message">
            <div class="message-body">{fields.sub_type}</div>
          </article>
        </div>

        <div class="field">
          <label class="label">Problems</label>
          <article class="message">
            <div class="message-body">{fields.problems}</div>
          </article>
        </div>

        <div class="field">
          <label class="label">Diagnosis</label>
          <article class="message">
            <div class="message-body">{fields.diagnosis}</div>
          </article>
        </div>

        <div class="field">
          <label class="label">Notes</label>
          <article class="message">
            <div class="message-body">{fields.notes}</div>
          </article>
        </div>
      </div>
    );
  }

  render() {
    let { content } = this.props;
    if (Object.keys(content).length == 0) return null;

    let type = content.fields.type;
    let prescriptions = content.prescriptions;

    return (
      <div class="column is-12">
        <h1 style={{ color: "black", fontSize: "1.5em" }}>Consultation</h1>
        <div class="field">
          <label class="label">Done by</label>
          <article class="message">
            <div class="message-body">{content.fields.doctor}</div>
          </article>
        </div>

        <hr />

        {type == "medical" ? this.renderMedicalConsultation(content) : null}

        <hr />

        <div class="field">
          <label class="label">Referred For</label>
          <article class="message">
            <div class="message-body">{content.fields.referred_for}</div>
          </article>
        </div>

        <hr />

        <div class="field">
          <label class="label">Prescriptions</label>
          {prescriptions.length > 0 ? (
            this.renderPrescriptions(prescriptions)
          ) : (
            <h2>None</h2>
          )}
        </div>

        <hr />
      </div>
    );
  }
}

class DentalTriageView extends React.Component {
  constructor() {
    super();
  }

  render() {
    let { content } = this.props;

    return (
      <div class="column is-12">
        <h1 style={{ color: "black", fontSize: "1.5em" }}>Dental Triage</h1>
        <div class="field">
          <label class="label">Complaints</label>
          <article class="message">
            <div class="message-body">{content.fields.complaints}</div>
          </article>
        </div>

        <div class="field">
          <label class="label">Intraoral</label>
          <article class="message">
            <div class="message-body">{content.fields.intraoral}</div>
          </article>
        </div>

        <div class="field">
          <label class="label">Diagnosis</label>
          <article class="message">
            <div class="message-body">{content.fields.diagnosis}</div>
          </article>
        </div>
        <hr />

        <div class="field is-grouped">
          <div class="control is-expanded">
            <label class="label">EXO</label>
            <div class="control">
              <article class="message">
                <div class="message-body">{content.fields.exo}</div>
              </article>
            </div>
          </div>

          <div class="control is-expanded">
            <label class="label">CAP</label>
            <div class="control">
              <article class="message">
                <div class="message-body">{content.fields.cap}</div>
              </article>
            </div>
          </div>
        </div>

        <div class="field is-grouped">
          <div class="control is-expanded">
            <label class="label">SDF</label>
            <div class="control">
              <article class="message">
                <div class="message-body">{content.fields.sdf}</div>
              </article>
            </div>
          </div>

          <div class="control is-expanded">
            <label class="label">F</label>
            <div class="control">
              <article class="message">
                <div class="message-body">{content.fields.f}</div>
              </article>
            </div>
          </div>
        </div>

        <div class="field">
          <label class="label">Others</label>
          <article class="message">
            <div class="message-body">{content.fields.others}</div>
          </article>
        </div>

        <hr />
      </div>
    );
  }
}

class MedicalTriageView extends React.Component {
  constructor() {
    super();
  }

  render() {
    let { content } = this.props;

    return (
      <div class="column is-12">
        <h1 style={{ color: "black", fontSize: "1.5em" }}>Medical Triage</h1>

        <div class="field is-grouped">
          <div class="control is-expanded">
            <label class="label">Height</label>
            <div class="control">
              <article class="message">
                <div class="message-body">{content.fields.height}</div>
              </article>
            </div>
          </div>

          <div class="control is-expanded">
            <label class="label">Weight</label>
            <div class="control">
              <article class="message">
                <div class="message-body">{content.fields.weight}</div>
              </article>
            </div>
          </div>
        </div>

        <div class="field is-grouped">
          <div class="control is-expanded">
            <label class="label">Systolic</label>
            <div class="control">
              <article class="message">
                <div class="message-body">{content.fields.systolic}</div>
              </article>
            </div>
          </div>

          <div class="control is-expanded">
            <label class="label">Diastolic</label>
            <div class="control">
              <article class="message">
                <div class="message-body">{content.fields.diastolic}</div>
              </article>
            </div>
          </div>
        </div>

        <div class="field is-grouped">
          <div class="control is-expanded">
            <label class="label">Temperature</label>
            <div class="control">
              <article class="message">
                <div class="message-body">{content.fields.temperature}</div>
              </article>
            </div>
          </div>

          <div class="control is-expanded">
            <label class="label">Heart Rate</label>
            <div class="control">
              <article class="message">
                <div class="message-body">{content.fields.heart_rate}</div>
              </article>
            </div>
          </div>
        </div>

        <hr />

        <div class="field">
          <label class="label">HIV Positive</label>
          <article class="message">
            <div class="message-body">
              {content.fields.hiv_positive ? "Positive" : "Negative"}
            </div>
          </article>
        </div>

        <div class="field">
          <label class="label">PTB Positive</label>
          <article class="message">
            <div class="message-body">
              {content.fields.ptb_positive ? "Positive" : "Negative"}
            </div>
          </article>
        </div>

        <div class="field">
          <label class="label">HEPC Positive</label>
          <article class="message">
            <div class="message-body">
              {content.fields.hepc_positive ? "Positive" : "Negative"}
            </div>
          </article>
        </div>
      </div>
    );
  }
}

class VisitPrescriptionsTable extends React.Component {
  constructor() {
    super();
  }

  render() {
    let { content: prescriptions } = this.props;

    let prescriptionRows = prescriptions.map(prescription => {
      let name = prescription.fields.medicine_name;
      let quantity = prescription.fields.quantity;
      let doctor = prescription.fields.doctor;

      return (
        <tr>
          <td>{name}</td>
          <td>{quantity}</td>
          <td>{doctor}</td>
        </tr>
      );
    });

    return (
      <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>Medicine Name</th>
            <th>Quantity</th>
            <th>Doctor</th>
          </tr>
        </thead>
        <tbody>{prescriptionRows}</tbody>
      </table>
    );
  }
}

class PatientView extends React.Component {
  constructor() {
    super();
  }

  render() {
    let { content } = this.props;

    return (
      <div class="column is-3">
        <div class="field">
          <label class="label">Local Name</label>
          <article class="message">
            <div class="message-body">{content.fields.local_name}</div>
          </article>
        </div>

        <div class="field">
          <label class="label">Gender</label>
          <article class="message">
            <div class="message-body">{content.fields.gender}</div>
          </article>
        </div>

        <div class="field">
          <label class="label">Date of Birth</label>
          <article class="message">
            <div class="message-body">{content.fields.date_of_birth}</div>
          </article>
        </div>

        <div class="field">
          <label class="label">Travelling Time to Village</label>
          <article class="message">
            <div class="message-body">{content.fields.travelling_time_to_village}</div>
          </article>
        </div>

        <div class="field">
          <label class="label">Allergies</label>
          <article class="message">
            <div class="message-body">{content.fields.drug_allergy}</div>
          </article>
        </div>

      </div>
    );
  }
}

export {
  ConsultationsTable,
  ConsultationsView,
  DentalTriageView,
  MedicalTriageView,
  VisitPrescriptionsTable,
  PatientView
};
