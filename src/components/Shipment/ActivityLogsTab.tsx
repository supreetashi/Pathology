import React from "react";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";

interface ActivityLogsTabProps { data: any[]; }

const ActivityLogsTab: React.FC<ActivityLogsTabProps> = ({ data }) => {
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
              <PrintOutlinedIcon style={{ color: "#3b82f6", fontSize: "18px", cursor: "pointer" }} />
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