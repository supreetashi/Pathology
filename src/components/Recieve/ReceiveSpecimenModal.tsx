import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import type { SampleRow } from "./ReceiveMockData";

type ReceiveSpecimenModalProps = {
  isOpen: boolean;
  rows: SampleRow[];
  onClose: () => void;
  onConfirm: () => void;
};

function ReceiveSpecimenModal({
  isOpen,
  rows,
  onClose,
  onConfirm,
}: ReceiveSpecimenModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="receive-modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="receive-modal-card"
        role="dialog"
        aria-modal="true"
        aria-label="Receive Specimen"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="receive-modal-header">
          <h3>Receive Specimen</h3>
          <button
            type="button"
            className="receive-modal-close"
            onClick={onClose}
            aria-label="Close receive specimen modal"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        <div className="receive-modal-form-grid">
          <div className="receive-modal-field disabled">
            <label>Sample Receive Date</label>
            <div className="receive-modal-input-wrap">
              <input type="text" value="13/03/2026" readOnly />
              <CalendarMonthIcon className="field-icon" fontSize="small" />
            </div>
          </div>

          <div className="receive-modal-field">
            <label>Sample Receive Time</label>
            <div className="receive-modal-input-wrap">
              <input type="text" defaultValue="11:30" />
              <AccessTimeIcon className="field-icon" fontSize="small" />
            </div>
          </div>

          <div className="receive-modal-field disabled">
            <label>Accepted By</label>
            <div className="receive-modal-input-wrap">
              <input type="text" value="John Wick" readOnly />
            </div>
          </div>
        </div>

        <div className="receive-modal-field remark-field">
          <label>Remark</label>
          <div className="receive-modal-input-wrap">
            <input type="text" defaultValue="Sample Is Collected In The Correct Container" />
          </div>
        </div>

        <label className="sub-optimal-toggle">
          <CheckCircleIcon fontSize="small" />
          <span>Sub-Optimal</span>
        </label>

        <h4 className="receive-modal-section-title">RECEIVE SPECIMEN DETAILS ({rows.length})</h4>

        <div className="receive-modal-table-shell">
          <table className="receive-modal-table">
            <thead>
              <tr>
                <th>Ship Date | Time</th>
                <th>Shipment No.</th>
                <th>Specimen No. | Type</th>
                <th>Test Code | Name</th>
                <th>Service Name</th>
                <th>Patient</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <div className="cell-primary">{row.shipDate}</div>
                    <div className="cell-secondary">{row.shipTime}</div>
                  </td>
                  <td>
                    <div className="cell-primary">{row.shipmentNo}</div>
                  </td>
                  <td>
                    <div className="cell-primary">{row.sampleNo}</div>
                    <div className="cell-secondary">{row.type}</div>
                  </td>
                  <td>
                    <div className="cell-primary">{row.testCode}</div>
                    <div className="cell-secondary">{row.testName}</div>
                  </td>
                  <td>
                    <div className="cell-primary">{row.serviceName}</div>
                  </td>
                  <td>
                    <div className="patient-primary">
                      {row.patientName} | {row.age}
                    </div>
                    <div className="patient-secondary">
                      {row.patientCode} | {row.gender}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="receive-modal-actions">
          <button type="button" className="receive-modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="receive-modal-confirm" onClick={onConfirm}>
            Receive
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReceiveSpecimenModal;
