import React, { useState } from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";

interface ReceivedTabProps { data: any[]; }

// Shared 3-row tooltip — same design as Shipped tab
const InfoTooltip = ({ row }: { row: any }) => (
  <div
    style={{
      position: "absolute",
      right: "28px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      padding: "10px 14px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
      zIndex: 200,
      minWidth: "230px",
      whiteSpace: "nowrap",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}
  >
    <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "5px" }}>
      <span style={{ fontSize: "10px", color: "#9ca3af", minWidth: "110px" }}>Order Date &amp; Time</span>
      <span style={{ fontSize: "11px", color: "#374151" }}>:</span>
      <span style={{ fontSize: "11px", fontWeight: 500, color: "#111827" }}>
        {row.orderDate || "-"} | {row.orderTime || "-"}
      </span>
    </div>
    <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "5px" }}>
      <span style={{ fontSize: "10px", color: "#9ca3af", minWidth: "110px" }}>Ship Date &amp; Time</span>
      <span style={{ fontSize: "11px", color: "#374151" }}>:</span>
      <span style={{ fontSize: "11px", fontWeight: 500, color: "#111827" }}>
        {row.shipDate || "-"} | {row.shipTime || "-"}
      </span>
    </div>
    <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
      <span style={{ fontSize: "10px", color: "#9ca3af", minWidth: "110px" }}>Shipment No.</span>
      <span style={{ fontSize: "11px", color: "#374151" }}>:</span>
      <span style={{ fontSize: "11px", fontWeight: 500, color: "#111827" }}>
        {row.shipmentNo || "-"}
      </span>
    </div>
  </div>
);

const ReceivedTab: React.FC<ReceivedTabProps> = ({ data }) => {
  const [tooltip, setTooltip] = useState<{ id: number } | null>(null);

  const handlePrint = (row: any) => {
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Shipment Receipt - ${row.receivedNo ?? row.sampleNo}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; color: #111827; font-size: 13px; }
            h2 { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
            .subtitle { color: #6b7280; font-size: 12px; margin-bottom: 24px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th { text-align: left; font-size: 11px; color: #9ca3af; font-weight: 500; padding: 8px 12px; border-bottom: 1px solid #e5e7eb; }
            td { padding: 10px 12px; border-bottom: 1px solid #f3f4f6; font-size: 12px; }
            .value { font-size: 13px; color: #111827; font-weight: 500; }
            .sub { font-size: 12px; color: #6b7280; }
            .status { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; }
            .accepted { border: 1px solid #10b981; color: #10b981; background: #f0fdf4; }
            .rejected { border: 1px solid #ef4444; color: #ef4444; background: #fef2f2; }
            @media print { body { padding: 16px; } }
          </style>
        </head>
        <body>
          <h2>Shipment Receipt</h2>
          <div class="subtitle">Received No: ${row.receivedNo ?? "-"}</div>
          <table>
            <tr>
              <th>Receive Date &amp; Time</th>
              <th>Sample No. | Type</th>
              <th>Test Code | Name</th>
              <th>Service Name</th>
              <th>Patient</th>
              <th>Ship To</th>
              <th>Status</th>
            </tr>
            <tr>
              <td>
                <div class="value">${row.date}</div>
                <div class="sub">${row.time}</div>
              </td>
              <td>
                <div class="value">${row.sampleNo}</div>
                <div class="sub">${row.type}</div>
              </td>
              <td>
                <div class="value">${row.testCode}</div>
                <div class="sub">${row.testName}</div>
              </td>
              <td><div class="value">${row.serviceName}</div></td>
              <td>
                <div class="value">${row.patientName} | ${row.age}</div>
                <div class="sub">${row.patientCode} | ${row.gender}</div>
              </td>
              <td><div class="value">${row.shipTo}</div></td>
              <td>
                <span class="status ${(row.status || "").toLowerCase()}">${row.status}</span>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 300);
  };

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
              <div className="patient-name">
                {row.patientName && row.patientName !== "-" ? `${row.patientName} | ${row.age}` : "-"}
              </div>
              <div className="patient-details">
                {row.patientCode && row.patientCode !== "-" ? `${row.patientCode} | ${row.gender}` : "-"}
              </div>
            </td>
            <td><div className="cell-top">{row.shipTo}</div></td>
            <td>
              <span className={`status-pill ${(row.status || "").toLowerCase()}`}>{row.status}</span>
            </td>
            <td>
              <div className="result-cell">
                {row.status === "Accepted" ? (
                  <PrintOutlinedIcon
                    style={{ color: "#3b82f6", fontSize: "18px", cursor: "pointer" }}
                    onClick={() => handlePrint(row)}
                    titleAccess="Print receipt"
                  />
                ) : (
                  <span style={{ color: "#9ca3af", fontSize: "13px" }}>--</span>
                )}
              </div>
            </td>
            {/* Info icon with same 3-row tooltip as Shipped tab */}
            <td style={{ textAlign: "center", position: "relative" }}>
              <div
                style={{ position: "relative", display: "inline-block" }}
                onMouseEnter={() => setTooltip({ id: row.id })}
                onMouseLeave={() => setTooltip(null)}
              >
                <ErrorOutlineIcon style={{ color: "#fb923c", fontSize: "18px", cursor: "pointer" }} />
                {tooltip?.id === row.id && <InfoTooltip row={row} />}
              </div>
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