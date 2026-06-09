import React from "react";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";

interface ActivityLogsTabProps { data: any[]; }

const ActivityLogsTab: React.FC<ActivityLogsTabProps> = ({ data }) => {
  const handlePrint = (row: any) => {
    const printWindow = window.open("", "_blank", "width=800,height=500");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Activity Log - ${row.shipNo}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; color: #111827; font-size: 13px; }
            h2 { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
            .subtitle { color: #6b7280; font-size: 12px; margin-bottom: 24px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th { text-align: left; font-size: 11px; color: #9ca3af; font-weight: 500; padding: 8px 12px; border-bottom: 1px solid #e5e7eb; }
            td { padding: 10px 12px; border-bottom: 1px solid #f3f4f6; font-size: 12px; }
            @media print { body { padding: 16px; } }
          </style>
        </head>
        <body>
          <h2>Activity Log</h2>
          <div class="subtitle">Ship No: ${row.shipNo}</div>
          <table>
            <tr>
              <th>Ship Date &amp; Time</th>
              <th>Ship No.</th>
              <th>Ship From</th>
              <th>Ship To</th>
              <th>Ship By</th>
            </tr>
            <tr>
              <td>${row.date} ${row.time}</td>
              <td>${row.shipNo}</td>
              <td>${row.shipFrom}</td>
              <td>${row.shipTo}</td>
              <td>${row.shipBy}</td>
            </tr>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  return (
    <table className="custom-table" style={{ tableLayout: "fixed", width: "100%" }}>
      <colgroup>
        <col style={{ width: "155px" }} />
        <col style={{ width: "120px" }} />
        <col style={{ width: "160px" }} />
        <col style={{ width: "160px" }} />
        <col />
        <col style={{ width: "40px" }} />
      </colgroup>

      <thead>
        <tr>
          <th>Ship Date | Time</th>
          <th>Ship No.</th>
          <th>Ship From</th>
          <th>Ship To</th>
          <th>Ship By</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            <td>
              <div className="cell-top">{row.date}</div>
              <div className="cell-time">{row.time}</div>
            </td>
            <td><div className="cell-top">{row.shipNo}</div></td>
            <td><div className="cell-top">{row.shipFrom}</div></td>
            <td><div className="cell-top">{row.shipTo}</div></td>
            <td><div className="cell-top">{row.shipBy}</div></td>
            <td style={{ textAlign: "right", paddingRight: "0" }}>
              <PrintOutlinedIcon
                style={{ color: "#3b82f6", fontSize: "18px", cursor: "pointer" }}
                onClick={() => handlePrint(row)}
                titleAccess="Print log"
              />
            </td>
          </tr>
        ))}
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

export default ActivityLogsTab;