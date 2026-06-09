import React, { useState } from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface ShippedTabProps {
  data: any[];
}

const ShippedTab: React.FC<ShippedTabProps> = ({ data }) => {
  const [tooltip, setTooltip] = useState<{ id: number } | null>(null);

  return (
    <table className="custom-table" style={{ tableLayout: "fixed", width: "100%" }}>
      <colgroup>
        {/* Order Date | Time — wider to match Figma gap from left */}
        <col style={{ width: "150px" }} />
        {/* Shipment No. */}
        <col style={{ width: "130px" }} />
        {/* Sample No. | Type */}
        <col style={{ width: "140px" }} />
        {/* Test Code | Name */}
        <col style={{ width: "160px" }} />
        {/* Service Name */}
        <col style={{ width: "180px" }} />
        {/* Patient */}
        <col style={{ width: "200px" }} />
        {/* Ship To */}
        <col style={{ width: "140px" }} />
        {/* Icon */}
        <col style={{ width: "48px" }} />
      </colgroup>

      <thead>
        <tr>
          {/* Headers: #6b7280 (not #9ca3af) to match Figma — slightly darker grey */}
          <th
            style={{
              padding: "12px 16px 12px 20px",
              fontSize: "12px",
              fontWeight: 400,
              color: "#6b7280",
              textAlign: "left",
              borderBottom: "1px solid #f3f4f6",
              whiteSpace: "nowrap",
              background: "#ffffff",
            }}
          >
            Ship Date | Time
          </th>
          <th
            style={{
              padding: "12px 16px",
              fontSize: "12px",
              fontWeight: 400,
              color: "#6b7280",
              textAlign: "left",
              borderBottom: "1px solid #f3f4f6",
              whiteSpace: "nowrap",
              background: "#ffffff",
            }}
          >
            Shipment No.
          </th>
          <th
            style={{
              padding: "12px 16px",
              fontSize: "12px",
              fontWeight: 400,
              color: "#6b7280",
              textAlign: "left",
              borderBottom: "1px solid #f3f4f6",
              whiteSpace: "nowrap",
              background: "#ffffff",
            }}
          >
            Sample No. | Type
          </th>
          <th
            style={{
              padding: "12px 16px",
              fontSize: "12px",
              fontWeight: 400,
              color: "#6b7280",
              textAlign: "left",
              borderBottom: "1px solid #f3f4f6",
              whiteSpace: "nowrap",
              background: "#ffffff",
            }}
          >
            Test Code | Name
          </th>
          <th
            style={{
              padding: "12px 16px",
              fontSize: "12px",
              fontWeight: 400,
              color: "#6b7280",
              textAlign: "left",
              borderBottom: "1px solid #f3f4f6",
              whiteSpace: "nowrap",
              background: "#ffffff",
            }}
          >
            Service Name
          </th>
          <th
            style={{
              padding: "12px 16px",
              fontSize: "12px",
              fontWeight: 400,
              color: "#6b7280",
              textAlign: "left",
              borderBottom: "1px solid #f3f4f6",
              whiteSpace: "nowrap",
              background: "#ffffff",
            }}
          >
            Patient
          </th>
          <th
            style={{
              padding: "12px 16px",
              fontSize: "12px",
              fontWeight: 400,
              color: "#6b7280",
              textAlign: "left",
              borderBottom: "1px solid #f3f4f6",
              whiteSpace: "nowrap",
              background: "#ffffff",
            }}
          >
            Ship To
          </th>
          <th
            style={{
              padding: "12px 8px",
              borderBottom: "1px solid #f3f4f6",
              background: "#ffffff",
            }}
          />
        </tr>
      </thead>

      <tbody>
        {data.map((row) => (
          <tr
            key={row.id}
            style={{
              borderBottom: "1px solid #f3f4f6",
              background: "#ffffff",
            }}
          >
            {/* Order / Ship Date | Time */}
            <td style={{ padding: "14px 16px 14px 20px", verticalAlign: "middle" }}>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "#111827",
                  lineHeight: "1.5",
                }}
              >
                {row.shipDate}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "#111827",
                  lineHeight: "1.5",
                  marginTop: "1px",
                }}
              >
                {row.time}
              </div>
            </td>

            {/* Shipment No. */}
            <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "#111827",
                  lineHeight: "1.5",
                }}
              >
                {row.shipmentNo}
              </div>
            </td>

            {/* Sample No. | Type */}
            <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "#111827",
                  lineHeight: "1.5",
                }}
              >
                {row.sampleNo}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "#111827",
                  lineHeight: "1.5",
                  marginTop: "1px",
                }}
              >
                {row.type}
              </div>
            </td>

            {/* Test Code | Name */}
            <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "#111827",
                  lineHeight: "1.5",
                }}
              >
                {row.testCode}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "#111827",
                  lineHeight: "1.5",
                  marginTop: "1px",
                }}
              >
                {row.testName}
              </div>
            </td>

            {/* Service Name */}
            <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "#111827",
                  lineHeight: "1.5",
                }}
              >
                {row.serviceName}
              </div>
            </td>

            {/* Patient — name is BOLD (500) to match Figma, sub-line normal */}
            <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 500,       /* ← bold in Figma */
                  color: "#111827",
                  lineHeight: "1.5",
                }}
              >
                {row.patientName} | {row.age}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "#111827",
                  lineHeight: "1.5",
                  marginTop: "1px",
                }}
              >
                {row.patientCode} | {row.gender}
              </div>
            </td>

            {/* Ship To */}
            <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "#111827",
                  lineHeight: "1.5",
                }}
              >
                {row.shipTo}
              </div>
            </td>

            {/* Action icon — hover shows 3-row tooltip: Order Date & Time, Ship Date & Time, Shipment No. */}
            <td
              style={{
                padding: "14px 8px",
                textAlign: "center",
                verticalAlign: "middle",
                width: "48px",
              }}
            >
              <div
                style={{ position: "relative", display: "inline-block" }}
                onMouseEnter={() => setTooltip({ id: row.id })}
                onMouseLeave={() => setTooltip(null)}
              >
                <ErrorOutlineIcon
                  style={{
                    color: "#fb923c",
                    fontSize: "18px",
                    cursor: "pointer",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
                {tooltip?.id === row.id && (
                  <div
                    style={{
                      position: "absolute",
                      right: "28px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                      zIndex: 200,
                      minWidth: "210px",
                      whiteSpace: "nowrap",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                      <span style={{ fontSize: "10px", color: "#9ca3af", minWidth: "110px" }}>Order Date &amp; Time</span>
                      <span style={{ fontSize: "11px", color: "#374151" }}>:</span>
                      <span style={{ fontSize: "11px", fontWeight: 500, color: "#111827" }}>
                        {row.orderDate || "-"} | {row.orderTime || "-"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </td>
          </tr>
        ))}

        {data.length === 0 && (
          <tr>
            <td
              colSpan={8}
              style={{
                textAlign: "center",
                padding: "40px",
                color: "#9ca3af",
                fontSize: "13px",
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

export default ShippedTab;