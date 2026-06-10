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
              <PrintOutlinedIcon className="print-icon" fontSize="small" />
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