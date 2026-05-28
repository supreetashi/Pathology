import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import type { SampleRow } from "./ReceiveMockData";

type ShippedTabProps = {
  rows: SampleRow[];
  selectedIds: number[];
  allSelected: boolean;
  onToggleAllRows: () => void;
  onToggleSingleRow: (id: number) => void;
};

function ShippedTab({
  rows,
  selectedIds,
  allSelected,
  onToggleAllRows,
  onToggleSingleRow,
}: ShippedTabProps) {
  return (
    <table className="receive-table">
      <thead>
        <tr>
          <th className="checkbox-column">
            <button
              type="button"
              className={`select-checkbox ${allSelected ? "selected" : ""}`}
              onClick={onToggleAllRows}
              aria-label="Select all rows"
            >
              {allSelected ? <CheckCircleIcon fontSize="small" /> : null}
            </button>
          </th>
          <th>Ship Date | Time</th>
          <th>Shipment No.</th>
          <th>Sample No. | Type</th>
          <th>Test Code | Name</th>
          <th>Service Name</th>
          <th>Patient</th>
          <th className="info-column" />
        </tr>
      </thead>

      <tbody>
        {rows.map((row) => {
          const selected = selectedIds.includes(row.id);

          return (
            <tr key={row.id}>
              <td className="checkbox-column">
                <button
                  type="button"
                  className={`select-checkbox ${selected ? "selected" : ""}`}
                  onClick={() => onToggleSingleRow(row.id)}
                  aria-label={`Select sample ${row.sampleNo}`}
                >
                  {selected ? <CheckCircleIcon fontSize="small" /> : null}
                </button>
              </td>
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
            <td colSpan={8} className="empty-row">
              No matching records found.
            </td>
          </tr>
        ) : null}
      </tbody>
    </table>
  );
}

export default ShippedTab;
