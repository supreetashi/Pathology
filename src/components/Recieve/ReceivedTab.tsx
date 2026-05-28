import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import type { SampleRow } from "../ReceiveMockData";

type ReceivedTabProps = {
  rows: SampleRow[];
  rowOffset: number;
};

function ReceivedTab({ rows, rowOffset }: ReceivedTabProps) {
  return (
    <table className="receive-table">
      <thead>
        <tr>
          <th>Receive Date | Time</th>
          <th>Received No.</th>
          <th>Sample No. | Type</th>
          <th>Test Code | Name</th>
          <th>Service Name</th>
          <th>Patient</th>
          <th>Result Status</th>
          <th>Result</th>
          <th className="info-column" />
        </tr>
      </thead>

      <tbody>
        {rows.map((row, rowIndex) => {
          const isPending = rowOffset + rowIndex < 3;

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
                <span className={`result-status-pill ${isPending ? "pending" : "complete"}`}>
                  {isPending ? "Pending" : "Complete"}
                </span>
              </td>
              <td>
                {isPending ? (
                  <AddCircleOutlineIcon className="result-icon" fontSize="small" />
                ) : (
                  <DescriptionOutlinedIcon className="result-icon" fontSize="small" />
                )}
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
                      <span>Receive Remark</span>
                      <strong>Sample is collected in the correct container</strong>
                    </span>
                  </span>
                </span>
              </td>
            </tr>
          );
        })}

        {rows.length === 0 ? (
          <tr>
            <td colSpan={9} className="empty-row">
              No matching records found.
            </td>
          </tr>
        ) : null}
      </tbody>
    </table>
  );
}

export default ReceivedTab;
