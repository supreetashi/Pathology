import React from "react";

interface PendingTabProps {
  data: any[];
  selectedRows: number[];
  onToggleRow: (id: number) => void;
  onToggleSelectAll: () => void;
  isAllSelected: boolean;
}

const PendingTab: React.FC<PendingTabProps> = ({
  data,
  selectedRows,
  onToggleRow,
  onToggleSelectAll,
  isAllSelected,
}) => {
  /* Figma spec from dev panel:
     - Cell frame: 344×100, padding: 16px top/bottom, 8px left/right, gap: 4px
     - Font: "Plus Jakarta Sans" (round geometric — what Figma uses here)
     - Size: 13px, weight: 400, color: #111827
     - Header text: same font/size/color as body — dark #111827, NOT grey
  */

  const FONT = "'Plus Jakarta Sans', 'DM Sans', 'Inter', -apple-system, sans-serif";

  const txt: React.CSSProperties = {
    fontFamily: FONT,
    fontSize: "13px",
    fontWeight: 400,
    color: "#111827",
    lineHeight: "1.4",
  };

  /* FIX: headers must be dark #111827 at 13px to match Figma — NOT grey #9ca3af */
  const thStyle: React.CSSProperties = {
    fontFamily: FONT,
    fontSize: "13px",
    fontWeight: 400,
    color: "#111827",
    textAlign: "left",
    borderBottom: "1px solid #f3f4f6",
    whiteSpace: "nowrap",
    background: "#ffffff",
    padding: "12px 8px",
  };

  const tdStyle: React.CSSProperties = {
    padding: "16px 8px",   /* Figma: 16px vertical, 8px horizontal */
    verticalAlign: "middle",
  };

  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        tableLayout: "fixed",
        fontFamily: FONT,
      }}
    >
      <colgroup>
        <col style={{ width: "44px" }} />   {/* checkbox */}
        <col style={{ width: "130px" }} />  {/* Order Date | Time */}
        <col style={{ width: "140px" }} />  {/* Sample No. | Type */}
        <col style={{ width: "155px" }} />  {/* Test Code | Name */}
        <col style={{ width: "175px" }} />  {/* Service Name */}
        <col />                              {/* Patient — fills rest */}
      </colgroup>

      <thead>
        <tr style={{ background: "#ffffff" }}>
          {/* checkbox — left-aligned with 20px left padding */}
          <th style={{ ...thStyle, padding: "12px 8px 12px 20px" }}>
            <div
              className={`custom-checkbox ${isAllSelected ? "checked" : ""}`}
              onClick={onToggleSelectAll}
            />
          </th>
          <th style={{ ...thStyle, paddingLeft: "20px" }}>Order Date | Time</th>
          <th style={thStyle}>Sample No. | Type</th>
          <th style={thStyle}>Test Code | Name</th>
          <th style={thStyle}>Service Name</th>
          <th style={thStyle}>Patient</th>
        </tr>
      </thead>

      <tbody>
        {data.map((row) => {
          const isSelected = selectedRows.includes(row.id);
          return (
            <tr
              key={row.id}
              style={{ borderBottom: "1px solid #f3f4f6", background: "#ffffff" }}
            >
              {/* checkbox */}
              <td style={{ ...tdStyle, padding: "16px 8px 16px 20px" }}>
                <div
                  className={`custom-checkbox ${isSelected ? "checked" : ""}`}
                  onClick={() => onToggleRow(row.id)}
                />
              </td>

              {/* Order Date | Time — gap:4px between lines per Figma */}
              <td style={{ ...tdStyle, paddingLeft: "20px" }}>
                <div style={txt}>{row.date}</div>
                <div style={{ ...txt, marginTop: "4px" }}>{row.time}</div>
              </td>

              {/* Sample No. | Type */}
              <td style={tdStyle}>
                <div style={txt}>{row.sampleNo}</div>
                <div style={{ ...txt, marginTop: "4px" }}>{row.type}</div>
              </td>

              {/* Test Code | Name */}
              <td style={tdStyle}>
                <div style={txt}>{row.testCode}</div>
                <div style={{ ...txt, marginTop: "4px" }}>{row.testName}</div>
              </td>

              {/* Service Name */}
              <td style={tdStyle}>
                <div style={txt}>{row.serviceName}</div>
              </td>

              {/* Patient */}
              <td style={tdStyle}>
                <div style={txt}>{row.patientName} | {row.age}</div>
                <div style={{ ...txt, marginTop: "4px" }}>{row.patientCode} | {row.gender}</div>
              </td>
            </tr>
          );
        })}

        {data.length === 0 && (
          <tr>
            <td
              colSpan={6}
              style={{
                textAlign: "center",
                padding: "40px",
                color: "#9ca3af",
                fontSize: "13px",
                fontFamily: FONT,
              }}
            >
              No matching records found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default PendingTab;