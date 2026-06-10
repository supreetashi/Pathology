import { useRef, useState } from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";

type SampleRow = {
  id: number;
  shipDate: string;
  shipTime: string;
  shipmentNo: string;
  sampleNo: string;
  type: string;
  testCode: string;
  testName: string;
  serviceName: string;
  patientName: string;
  age: number;
  patientCode: string;
  gender: string;
};

type RejectSpecimenModalProps = {
  isOpen: boolean;
  rows: SampleRow[];
  onClose: () => void;
  onConfirm: (payload: {
    rejectDate: string;
    rejectTime: string;
    remark: string;
    resend: boolean;
  }) => void;
};

function RejectSpecimenModal({ isOpen, rows, onClose, onConfirm }: RejectSpecimenModalProps) {
  const today = new Date();
  const [rejectDate, setRejectDate] = useState(today.toISOString().split("T")[0]);
  const [rejectTime, setRejectTime] = useState(today.toTimeString().slice(0, 5));
  const [remark, setRemark] = useState("Sample Is Damaged (Hemolysis) Or Clotted");
  const [resend, setResend] = useState(false);

  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const formatDateDisplay = (iso: string) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="receive-modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="receive-modal-card"
        role="dialog"
        aria-modal="true"
        aria-label="Reject Specimen"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="receive-modal-header">
          <h3>Reject Specimen</h3>
          <button
            type="button"
            className="receive-modal-close"
            onClick={onClose}
            aria-label="Close reject specimen modal"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        <div className="receive-modal-form-grid">
          <div className="receive-modal-field">
            <label>Sample Reject Date</label>
            <div className="receive-modal-input-wrap">
              <input
                type="text"
                value={formatDateDisplay(rejectDate)}
                readOnly
                style={{ cursor: "pointer" }}
                onClick={() => dateInputRef.current?.showPicker()}
              />
              <input
                ref={dateInputRef}
                type="date"
                value={rejectDate}
                onChange={(e) => setRejectDate(e.target.value)}
                style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 0 }}
              />
              <CalendarMonthIcon
                className="field-icon"
                fontSize="small"
                style={{ cursor: "pointer" }}
                onClick={() => dateInputRef.current?.showPicker()}
              />
            </div>
          </div>

          <div className="receive-modal-field">
            <label>Sample Reject Time</label>
            <div className="receive-modal-input-wrap">
              <input
                ref={timeInputRef}
                type="time"
                value={rejectTime}
                onChange={(e) => setRejectTime(e.target.value)}
              />
              <AccessTimeIcon
                className="field-icon"
                fontSize="small"
                style={{ cursor: "pointer" }}
                onClick={() => timeInputRef.current?.showPicker()}
              />
            </div>
          </div>

          <div className="receive-modal-field disabled">
            <label>Rejected By</label>
            <div className="receive-modal-input-wrap">
              <input type="text" value="John Wick" readOnly />
            </div>
          </div>
        </div>

        <div className="receive-modal-field remark-field">
          <label>Remark</label>
          <div className="receive-modal-input-wrap">
            <input
              type="text"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </div>
        </div>

        <label className="sub-optimal-toggle" style={{ cursor: "pointer" }}>
          <CheckCircleIcon
            fontSize="small"
            style={{ color: resend ? "#10b981" : "#9ca3af" }}
            onClick={() => setResend((prev) => !prev)}
          />
          <span onClick={() => setResend((prev) => !prev)}>Resend For New Sample</span>
        </label>

        <h4 className="receive-modal-section-title">
          REJECT SPECIMEN DETAILS ({rows.length})
        </h4>

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
                    <div className="patient-primary">{row.patientName} | {row.age}</div>
                    <div className="patient-secondary">{row.patientCode} | {row.gender}</div>
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
          <button
            type="button"
            className="receive-modal-confirm"
            onClick={() => onConfirm({ rejectDate, rejectTime, remark, resend })}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

export default RejectSpecimenModal;