import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";

type ActivityRow = {
  id: number;
  shipDate: string;
  shipTime: string;
  shipmentNo: string;
  serviceName: string;
  // real backend fields when available
  receiveDate?: string | null;
  receiveTime?: string | null;
  receiveNo?: string | null;
  shipFrom?: string | null;
  shipTo?: string | null;
  shipBy?: string | null;
  receiveAt?: string | null;
  receivedBy?: string | null;
};

type ActivityLogsTabProps = {
  rows: ActivityRow[];
  rowOffset: number;
};

function ActivityLogsTab({ rows }: ActivityLogsTabProps) {
  const handlePrint = (row: ActivityRow) => {
    const printWindow = window.open("", "_blank", "width=720,height=900");
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Activity Log - ${row.shipmentNo}</title>
          <style>
            * { box-sizing: border-box; }
            body {
              font-family: 'Nunito', -apple-system, BlinkMacSystemFont, sans-serif;
              padding: 32px;
              color: #2d2d2d;
            }
            h1 {
              font-size: 18px;
              margin: 0 0 16px;
              border-bottom: 1px solid #e8e8e8;
              padding-bottom: 12px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 13px;
            }
            td {
              padding: 8px 0;
              border-bottom: 1px solid #f0f0f0;
              vertical-align: top;
            }
            td.label {
              color: #9ca3af;
              width: 180px;
            }
            td.value {
              color: #111827;
              font-weight: 500;
            }
          </style>
        </head>
        <body>
          <h1>Activity Log Details</h1>
          <table>
            <tr><td class="label">Ship Date | Time</td><td class="value">${row.shipDate} | ${row.shipTime}</td></tr>
            <tr><td class="label">Shipment No.</td><td class="value">${row.shipmentNo}</td></tr>
            <tr><td class="label">Receive Date | Time</td><td class="value">${row.receiveDate ?? "—"} | ${row.receiveTime ?? "—"}</td></tr>
            <tr><td class="label">Receive No.</td><td class="value">${row.receiveNo ?? "—"}</td></tr>
            <tr><td class="label">Ship From</td><td class="value">${row.shipFrom ?? "—"}</td></tr>
            <tr><td class="label">Ship To</td><td class="value">${row.shipTo ?? "—"}</td></tr>
            <tr><td class="label">Ship By</td><td class="value">${row.shipBy ?? "—"}</td></tr>
            <tr><td class="label">Receive At</td><td class="value">${row.receiveAt ?? "—"}</td></tr>
            <tr><td class="label">Received By</td><td class="value">${row.receivedBy ?? "—"}</td></tr>
            <tr><td class="label">Service</td><td class="value">${row.serviceName}</td></tr>
          </table>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  };

  return (
    <table className="receive-table">
      <thead>
        <tr>
          <th>Ship Date | Time</th>
          <th>Ship No.</th>
          <th>Receive Date | Time</th>
          <th>Receive No.</th>
          <th>Ship From | To</th>
          <th>Ship By</th>
          <th>Receive At</th>
          <th>Received By</th>
          <th className="info-column" />
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
              <div className="cell-primary">{row.receiveDate ?? "—"}</div>
              <div className="cell-secondary">{row.receiveTime ?? "—"}</div>
            </td>
            <td>
              <div className="cell-primary">{row.receiveNo ?? "—"}</div>
            </td>
            <td>
              <div className="cell-primary">{row.shipFrom ?? "—"}</div>
              <div className="cell-secondary">{row.shipTo ?? "—"}</div>
            </td>
            <td>
              <div className="cell-primary">{row.shipBy ?? "—"}</div>
            </td>
            <td>
              <div className="cell-primary">{row.receiveAt ?? "—"}</div>
            </td>
            <td>
              <div className="cell-primary">{row.receivedBy ?? "—"}</div>
            </td>
            <td className="info-column">
              <button
                type="button"
                className="print-icon-button"
                aria-label={`Print activity log for ${row.shipmentNo}`}
                onClick={() => handlePrint(row)}
              >
                <PrintOutlinedIcon className="print-icon" fontSize="small" />
              </button>
            </td>
          </tr>
        ))}

        {rows.length === 0 && (
          <tr>
            <td colSpan={9} className="empty-row">
              No matching records found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default ActivityLogsTab;