import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import type { SampleRow } from "../ReceiveMockData";

type ActivityLogsTabProps = {
  rows: SampleRow[];
  rowOffset: number;
};

export const ACTIVITY_SHIP_BY = [
  "Jordan Blake",
  "Taylor Reed",
  "Morgan Lee",
  "Casey Quinn",
  "Riley Morgan",
  "Jamie Parker",
  "Skylar James",
  "Avery Taylor",
  "Drew Jordan",
  "Kai Morgan",
];

export const ACTIVITY_RECEIVED_BY = [
  "Jordan Blake",
  "Taylor Morgan",
  "Riley Quinn",
  "Casey Jordan",
  "Jamie Lee",
  "Skylar Reed",
  "Morgan Taylor",
  "Avery James",
  "Drew Quinn",
  "Kai Jordan",
];

function ActivityLogsTab({ rows, rowOffset }: ActivityLogsTabProps) {
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
        {rows.map((row, index) => {
          const activityIndex = (rowOffset + index) % ACTIVITY_SHIP_BY.length;

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
              <div className="cell-primary">{row.shipDate}</div>
              <div className="cell-secondary">{row.shipTime}</div>
            </td>
            <td>
              <div className="cell-primary">{row.shipmentNo}</div>
            </td>
            <td>
              <div className="cell-primary">Vidai, Pune</div>
              <div className="cell-secondary">Fertivue, Pune</div>
            </td>
            <td>
              <div className="cell-primary">{ACTIVITY_SHIP_BY[activityIndex]}</div>
            </td>
            <td>
              <div className="cell-primary">Fertivue, Pune</div>
            </td>
            <td>
              <div className="cell-primary">{ACTIVITY_RECEIVED_BY[activityIndex]}</div>
            </td>
            <td className="info-column">
              <PrintOutlinedIcon className="print-icon" fontSize="small" />
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

export default ActivityLogsTab;
