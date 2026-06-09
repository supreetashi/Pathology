import React from "react";

interface PendingTabProps {
  data: any[];
  selectedRows: number[];
  onToggleRow: (id: number) => void;
  onToggleSelectAll: () => void;
  isAllSelected: boolean;
}

const PendingTab: React.FC<PendingTabProps> = ({
  data, selectedRows, onToggleRow, onToggleSelectAll, isAllSelected,
}) => {
  return (
    <table className="custom-table" style={{ tableLayout: "fixed", width: "100%" }}>
      <colgroup>
        <col style={{ width: "40px" }} />
        <col style={{ width: "140px" }} />
        <col style={{ width: "160px" }} />
        <col style={{ width: "160px" }} />
        <col style={{ width: "180px" }} />
        <col />
      </colgroup>
      <thead>
        <tr>
          <th className="checkbox-cell">
            <div
              className={`custom-checkbox ${isAllSelected ? "checked" : ""}`}
              onClick={onToggleSelectAll}
            />
          </th>
          <th>Order Date | Time</th>
          <th>Sample No. | Type</th>
          <th>Test Code | Name</th>
          <th>Service Name</th>
          <th>Patient</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => {
          const isSelected = selectedRows.includes(row.id);
          return (
            <tr key={row.id}>
              <td className="checkbox-cell">
                <div
                  className={`custom-checkbox ${isSelected ? "checked" : ""}`}
                  onClick={() => onToggleRow(row.id)}
                />
              </td>
              <td>
                <div className="cell-top">{row.date}</div>
                <div className="cell-time">{row.time}</div>
              </td>
              <td>
                <div className="cell-top" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {row.sampleNo}
                </div>
                <div className="cell-bottom">{row.type}</div>
              </td>
              <td>
                <div className="cell-top">{row.testCode}</div>
                <div className="cell-bottom">{row.testName}</div>
              </td>
              <td>
                <div className="cell-service">{row.serviceName}</div>
              </td>
              <td>
                <div className="patient-name">{row.patientName} | {row.age}</div>
                <div className="patient-details">{row.patientCode} | {row.gender}</div>
              </td>
            </tr>
          );
        })}
        {data.length === 0 && (
          <tr>
            <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#9ca3af", fontSize: "13px" }}>
              No matching records found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default PendingTab;