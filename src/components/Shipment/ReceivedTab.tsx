import React from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

interface ReceivedTabProps { data: any[]; }

const ReceivedTab: React.FC<ReceivedTabProps> = ({ data }) => {
  return (
    <table className="custom-table">
      <thead>
        <tr>
          <th>Receive Date | Time</th>
          <th>Received No.</th>
          <th>Sample No. | Type</th>
          <th>Test Code | Name</th>
          <th>Service Name</th>
          <th>Patient</th>
          <th>Ship To</th>
          <th>Status</th>
          <th>Result</th>
          <th style={{ width: "48px" }}></th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            <td>
              <div className="cell-top">{row.date}</div>
              <div className="cell-bottom">{row.time}</div>
            </td>
            <td><div className="cell-top">{row.receivedNo ?? "-"}</div></td>
            <td>
              <div className="cell-top">{row.sampleNo}</div>
              <div className="cell-bottom">{row.type}</div>
            </td>
            <td>
              <div className="cell-top">{row.testCode}</div>
              <div className="cell-bottom">{row.testName}</div>
            </td>
            <td><div className="cell-service">{row.serviceName}</div></td>
            <td>
              <div className="patient-name">{row.patientName} | {row.age}</div>
              <div className="patient-details">{row.patientCode} | {row.gender}</div>
            </td>
            <td><div className="cell-top">{row.shipTo}</div></td>
            <td>
              <span className={`status-pill ${row.status.toLowerCase()}`}>{row.status}</span>
            </td>
            <td>
              <div className="result-cell">
                {row.status === "Accepted" ? (
                  <DescriptionOutlinedIcon style={{ color: "#3b82f6", fontSize: "18px", cursor: "pointer" }} />
                ) : (
                  <span style={{ color: "#9ca3af", fontSize: "13px" }}>--</span>
                )}
              </div>
            </td>
            <td style={{ textAlign: "center" }}>
              <ErrorOutlineIcon style={{ color: "#fb923c", fontSize: "18px", cursor: "pointer" }} />
            </td>
          </tr>
        ))}
        {data.length === 0 && (
          <tr>
            <td colSpan={10} style={{ textAlign: "center", padding: "40px", color: "#9ca3af", fontSize: "13px" }}>
              No matching records found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default ReceivedTab;