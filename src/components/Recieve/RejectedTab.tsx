import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import type { SampleRow } from "./ReceiveMockData";

type RejectedTabProps = {
  rows: SampleRow[];
  rowOffset: number;
};

function RejectedTab({ rows, rowOffset }: RejectedTabProps) {
  return (
    <table className="receive-table">
      <thead>
        <tr>
          <th>Date | Time</th>
          <th>Shipment No.</th>
          <th>Sample No. | Type</th>
          <th>Test Code | Name</th>
          <th>Service Name</th>
          <th>Patient</th>
          <th>Resend for New Sample</th>
          <th className="info-column" />
        </tr>
      </thead>

      <tbody>
        {rows.map((row, rowIndex) => {
          const resendFlag = (rowOffset + rowIndex) % 4 !== 2 && (rowOffset + rowIndex) % 5 !== 3;

          return (
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
              <td>
                {resendFlag ? <CheckCircleOutlineIcon className="resend-icon" fontSize="small" /> : null}
              </td>
              <td className="info-column">
                <span className="info-hover-target">
                  <ErrorOutlineIcon className="warning-icon" fontSize="small" />
                  <span className="info-hover-card" role="tooltip">
                    <span className="info-hover-row">
                      <span>Order Date & Time</span>
                      <strong>
                        {row.shipDate} | {row.shipTime}
                      </strong>
                    </span>
                    <span className="info-hover-row">
                      <span>Ship Date & Time</span>
                      <strong>
                        {row.shipDate} | {row.shipTime}
                      </strong>
                    </span>
                    <span className="info-hover-row">
                      <span>Shipment No.</span>
                      <strong>{row.shipmentNo}</strong>
                    </span>
                    <span className="info-hover-row">
                      <span>Reject Remark</span>
                      <strong>Sample is damaged or clotted</strong>
                    </span>
                  </span>
                </span>
              </td>
            </tr>
          );
        })}

        {rows.length === 0 ? (
          <tr>
            <td colSpan={8} className="empty-row">
              No matching records found.
            </td>
          </tr>
        ) : null}
      </tbody>
    </table>
  );
}

export default RejectedTab;
