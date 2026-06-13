import { useState, useRef, useEffect } from "react";
import { FaRegFileAlt } from "react-icons/fa";
import UndoIcon from "../../assets/icons/undo.png";
import type { ChangeEvent, MouseEvent, RefObject } from "react";
import styles from "./ViewOrderDetails.module.css";

import type { TestRow, TestStatus } from "../../types/orders.types";

type ActiveTab = "inhouse" | "outsource";

type PatientOrder = {
  patientName?: string;
  patientAge?: number;
  gender?: string;
  mrn?: string;
  cycleId?: string;
  orderId?: number; // Vidai work_order id
};

type ProcessField = { label: string; val: string };
type ProcessSection = { title: string; fields: ProcessField[] };

type CheckCircleProps = { checked: boolean; onClick: () => void };
type FilterDropdownProps = {
  onClose: () => void;
  anchorRef: RefObject<HTMLButtonElement | null>;
};
type ProcessModalProps = { onClose: () => void };
type AgencyModalProps = { onClose: () => void };
type ScheduleModalProps = {
  rows: TestRow[];
  onClose: () => void;
  onCollect: () => void;
};

type ViewOrderDetailsProps = {
  order?: PatientOrder | null;
  orderId?: number;
  onBack?: () => void;
};

const INHOUSE_TESTS: TestRow[] = [
  {
    id: 1,
    source: "inhouse",
    date: "04/02/2024",
    time: "10:30 AM",
    code: "2786/B34",
    name: "Urine Culture",
    service: "Women Pathology 2026",
    specimenNo: "-",
    type: "Urine",
    collectorItem: "Urine Container",
    status: "Pending",
    checked: true,
  },
  {
    id: 2,
    source: "inhouse",
    date: "04/02/2024",
    time: "10:30 AM",
    code: "2786/B34",
    name: "Urine Culture",
    service: "Women Pathology 2026",
    specimenNo: "-",
    type: "Blood",
    collectorItem: "Yellow Top – Serum Separator Tube",
    status: "Recollection Pending",
    checked: true,
  },
  {
    id: 3,
    source: "inhouse",
    date: "04/02/2024",
    time: "10:30 AM",
    code: "2786/B34",
    name: "Biopsy",
    service: "Women Pathology 2026",
    specimenNo: "2786/B34",
    type: "Blood",
    collectorItem: "Purple Top – K2 – EDTA",
    status: "Collected",
    checked: false,
  },
  {
    id: 4,
    source: "inhouse",
    date: "04/02/2024",
    time: "10:30 AM",
    code: "2786/B34",
    name: "Drug Testing",
    service: "Women Pathology 2026",
    specimenNo: "2786/B34",
    type: "Blood",
    collectorItem: "Yellow Top – Serum Separator Tube",
    status: "Shipped",
    checked: false,
  },
  {
    id: 5,
    source: "inhouse",
    date: "04/02/2024",
    time: "10:30 AM",
    code: "2785/B34",
    name: "Dipstick Test",
    service: "Women Pathology 2026",
    specimenNo: "2786/B34",
    type: "Blood",
    collectorItem: "Yellow Top – Serum Separator Tube",
    status: "Accepted",
    checked: false,
  },
  {
    id: 6,
    source: "inhouse",
    date: "04/02/2024",
    time: "10:30 AM",
    code: "2786/B34",
    name: "CBC",
    service: "Women Pathology 2026",
    specimenNo: "2786/B34",
    type: "Blood",
    collectorItem: "Purple Top – K2 – EDTA",
    status: "Completed",
    checked: false,
  },
  {
    id: 7,
    source: "inhouse",
    date: "04/02/2024",
    time: "10:30 AM",
    code: "2786/B34",
    name: "Genetic Testing",
    service: "Women Pathology 2026",
    specimenNo: "2786/B34",
    type: "Blood",
    collectorItem: "Purple Top – K2 – EDTA",
    status: "Rejected",
    checked: false,
  },
];

const OUTSOURCE_TESTS: TestRow[] = [
  {
    id: 101,
    source: "outsource",
    date: "04/02/2024",
    time: "10:30 AM",
    code: "2786/B34",
    name: "Urine Culture",
    service: "Women Pathology 2026",
    specimenNo: "2786/B34",
    type: "Urine",
    collectorItem: "Urine Container",
    agency: "Progenesis, Delhi",
    status: "Pending",
    checked: true,
  },
  {
    id: 102,
    source: "outsource",
    date: "04/02/2024",
    time: "10:30 AM",
    code: "2786/B34",
    name: "Biopsy",
    service: "Women Pathology 2026",
    specimenNo: "2786/B34",
    type: "Blood",
    collectorItem: "Purple Top – K2 – EDTA",
    agency: "Akiara Lab, Pune",
    status: "Pending",
    checked: false,
  },
  {
    id: 103,
    source: "outsource",
    date: "04/02/2024",
    time: "10:30 AM",
    code: "2786/B34",
    name: "Drug Testing",
    service: "Women Pathology 2026",
    specimenNo: "2786/B34",
    type: "Blood",
    collectorItem: "Yellow Top – Serum Separator Tube",
    agency: "Akiara Lab, Pune",
    status: "Collected",
    checked: false,
  },
  {
    id: 104,
    source: "outsource",
    date: "04/02/2024",
    time: "10:30 AM",
    code: "2786/B34",
    name: "Drug Testing",
    service: "Women Pathology 2026",
    specimenNo: "2786/B34",
    type: "Blood",
    collectorItem: "Yellow Top – Serum Separator Tube",
    agency: "Progenesis, Delhi",
    status: "Collected",
    checked: false,
  },
  {
    id: 105,
    source: "outsource",
    date: "04/02/2024",
    time: "10:30 AM",
    code: "2786/B34",
    name: "Genetic Testing",
    service: "Women Pathology 2026",
    specimenNo: "2786/B34",
    type: "Blood",
    collectorItem: "Purple Top – K2 – EDTA",
    agency: "Progenesis, Delhi",
    status: "Completed",
    checked: false,
  },
  {
    id: 106,
    source: "outsource",
    date: "04/02/2024",
    time: "10:30 AM",
    code: "2786/B34",
    name: "CBC",
    service: "Women Pathology 2026",
    specimenNo: "2786/B34",
    type: "Blood",
    collectorItem: "Purple Top – K2 – EDTA",
    agency: "Akiara Lab, Pune",
    status: "Completed",
    checked: false,
  },
];

const PROCESS_SECTIONS: ProcessSection[] = [
  {
    title: "Sample Collection",
    fields: [
      { label: "Collection Date", val: "13/03/2026" },
      { label: "Collection Time", val: "12:30" },
      { label: "Collected By", val: "Alex Carrey" },
      { label: "Recollection 1 Date", val: "13/03/2026" },
      { label: "Recollection 1 Time", val: "12:30" },
      { label: "Collected By", val: "Alex Carrey" },
    ],
  },
  {
    title: "Sample Ship",
    fields: [
      { label: "Ship Date", val: "13/03/2026" },
      { label: "Ship Time", val: "12:30" },
      { label: "Ship By", val: "John Wick" },
      { label: "Ship To", val: "Willowbrook" },
    ],
  },
  {
    title: "Sample Receive",
    fields: [
      { label: "Receive Date", val: "13/03/2026" },
      { label: "Receive Time", val: "12:30" },
      { label: "Received By", val: "Emilia Clarke" },
      { label: "Remark", val: "Lorem Ipsum Dolor" },
    ],
  },
  {
    title: "Result Entry",
    fields: [
      { label: "Authorization Date", val: "13/03/2026" },
      { label: "Authorization Time", val: "12:30" },
      { label: "Done By", val: "Jennifer Lawrence" },
    ],
  },
  {
    title: "Authorization",
    fields: [
      { label: "Authorization Date", val: "13/03/2026" },
      { label: "Authorization Time", val: "12:30" },
      { label: "Authorization By", val: "Emma Watson" },
    ],
  },
  {
    title: "Result Value Edit History Details",
    fields: [
      { label: "Receive Date", val: "13/03/2026" },
      { label: "User Name", val: "Emily Carter" },
      { label: "Reason", val: "Sample reason" },
    ],
  },
];

const BADGE_CLASS: Record<TestStatus, string> = {
  Pending: styles.badgePending,
  "Recollection Pending": styles.badgeRecollectionPending,
  Collected: styles.badgeCollected,
  Shipped: styles.badgeShipped,
  Accepted: styles.badgeAccepted,
  Completed: styles.badgeCompleted,
  Rejected: styles.badgeRejected,
};

const HAS_INFO: TestStatus[] = [
  "Collected",
  "Shipped",
  "Accepted",
  "Completed",
  "Rejected",
];
const HAS_RESULT: TestStatus[] = ["Completed", "Collected"];

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconBack() {
  return (
    <img
      src={UndoIcon}
      alt="back"
      width={20}
      height={20}
      style={{ display: "block" }}
    />
  );
}
function IconSearch() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#9e9e9e"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function IconFilter() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#505050"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}
function IconInfo() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#9e9e9e"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
function IconEdit() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#5A8AEA"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}
function IconPrint() {
  return <FaRegFileAlt size={14} color="#5A8AEA" />;
}
function IconDownload() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#5A8AEA"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
function IconClose() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
      <line
        x1="1"
        y1="1"
        x2="11"
        y2="11"
        stroke="#505050"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="11"
        y1="1"
        x2="1"
        y2="11"
        stroke="#505050"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#9e9e9e"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#9e9e9e"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

// FIX 1: Checkbox is SQUARE (rounded square) not circle, matches Figma
function CheckCircle({ checked, onClick }: CheckCircleProps) {
  return checked ? (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      style={{ cursor: "pointer", flexShrink: 0 }}
      onClick={onClick}
    >
      <rect
        x="0.5"
        y="0.5"
        width="17"
        height="17"
        rx="4"
        fill="#4CAF50"
        stroke="#4CAF50"
      />
      <polyline
        points="4 9 7.5 12.5 14 6"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      style={{ cursor: "pointer", flexShrink: 0 }}
      onClick={onClick}
    >
      <rect
        x="0.5"
        y="0.5"
        width="17"
        height="17"
        rx="4"
        fill="#fff"
        stroke="#d1d5db"
        strokeWidth="1.5"
      />
    </svg>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function FilterDropdown({ onClose }: FilterDropdownProps) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [testStatus, setTestStatus] = useState<string>("");
  const [service, setService] = useState("");

  const handleClear = () => {
    setFromDate("");
    setToDate("");
    setTestStatus("");
    setService("");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        zIndex: 10002,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          width: "360px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          overflow: "hidden",
          fontFamily: "var(--shipment-font-family)",
          fontSize: "13px",
        }}
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 18px 10px",
          }}
        >
          <span style={{ fontWeight: 700, fontSize: "15px", color: "#111827" }}>
            Filters
          </span>
          <button
            onClick={onClose}
            type="button"
            style={{
              background: "#f0f0f0",
              border: "none",
              borderRadius: "50%",
              width: 26,
              height: 26,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconClose />
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            padding: "0 18px 8px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {/* From / To Date */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "2px" }}
            >
              <span style={{ fontSize: "10px", color: "#9ca3af" }}>
                From Date
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #E2E3E5",
                  borderRadius: "6px",
                  padding: "0 6px",
                  height: "28px",
                }}
              >
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFromDate(e.target.value)
                  }
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    fontSize: "11px",
                    fontFamily: "var(--shipment-font-family)",
                    color: "#111827",
                    background: "transparent",
                  }}
                />
              </div>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "2px" }}
            >
              <span style={{ fontSize: "10px", color: "#9ca3af" }}>
                To Date
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #E2E3E5",
                  borderRadius: "6px",
                  padding: "0 6px",
                  height: "28px",
                }}
              >
                <input
                  type="date"
                  value={toDate}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setToDate(e.target.value)
                  }
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    fontSize: "11px",
                    fontFamily: "var(--shipment-font-family)",
                    color: "#111827",
                    background: "transparent",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Test Status */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontSize: "10px", color: "#9ca3af" }}>
              Test Status
            </span>
            <select
              value={testStatus}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setTestStatus(e.target.value)
              }
              style={{
                width: "100%",
                height: "28px",
                padding: "0 8px",
                border: "1px solid #E2E3E5",
                borderRadius: "6px",
                fontSize: "12px",
                fontFamily: "var(--shipment-font-family)",
                color: "#111827",
                outline: "none",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Recollection Pending">Recollection Pending</option>
              <option value="Collected">Collected</option>
              <option value="Shipped">Shipped</option>
              <option value="Accepted">Accepted</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Service */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontSize: "10px", color: "#9ca3af" }}>Service</span>
            <select
              value={service}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setService(e.target.value)
              }
              style={{
                width: "100%",
                height: "28px",
                padding: "0 8px",
                border: "1px solid #E2E3E5",
                borderRadius: "6px",
                fontSize: "12px",
                fontFamily: "var(--shipment-font-family)",
                color: "#111827",
                outline: "none",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              <option value="">All</option>
              <option value="Women Pathology 2026">Women Pathology 2026</option>
              <option value="Men Pathology 2026">Men Pathology 2026</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", gap: "8px", padding: "6px 18px 14px" }}>
          <button
            onClick={handleClear}
            type="button"
            style={{
              flex: 1,
              height: "32px",
              border: "1px solid #E2E3E5",
              borderRadius: "8px",
              background: "#f5f5f5",
              fontSize: "12px",
              fontWeight: 600,
              color: "#374151",
              cursor: "pointer",
              fontFamily: "var(--shipment-font-family)",
            }}
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            type="button"
            style={{
              flex: 1,
              height: "32px",
              border: "none",
              borderRadius: "8px",
              background: "#1a1a1a",
              color: "#fff",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "var(--shipment-font-family)",
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

function ProcessModal({ onClose }: ProcessModalProps) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.processModal}
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>Test Process Details</span>
          <button className={styles.panelClose} onClick={onClose} type="button">
            <IconClose />
          </button>
        </div>
        <div className={styles.processModalBody}>
          {PROCESS_SECTIONS.map(({ title, fields }) => (
            <div key={title} className={styles.processSection}>
              <p className={styles.processSectionTitle}>{title}</p>
              <div className={styles.processFields}>
                {fields.map(({ label, val }, i) => (
                  <div key={`${label}-${i}`} className={styles.processField}>
                    <span className={styles.processFieldLabel}>{label}</span>
                    <span className={styles.processFieldValue}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AgencyModal({ onClose }: AgencyModalProps) {
  const [agency, setAgency] = useState("Progenesis, Delhi");
  const [reason, setReason] = useState("Service Not available today");
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.agencyModal}
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>Change Agency</span>
          <button className={styles.panelClose} onClick={onClose} type="button">
            <IconClose />
          </button>
        </div>
        <div className={styles.agencyBody}>
          <div className={styles.filterField}>
            <span className={styles.filterLabel}>Select Agency</span>
            <select
              className={styles.filterSelect}
              value={agency}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setAgency(e.target.value)
              }
            >
              <option>Progenesis, Delhi</option>
              <option>Akiara Lab, Pune</option>
            </select>
          </div>
          <div className={styles.filterField}>
            <span className={styles.filterLabel}>Reason Of Change</span>
            <textarea
              className={styles.agencyTextarea}
              value={reason}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setReason(e.target.value)
              }
            />
          </div>
        </div>
        <div className={styles.filterFooter}>
          <button className={styles.clearBtn} onClick={onClose} type="button">
            Cancel
          </button>
          <button className={styles.applyBtn} onClick={onClose} type="button">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function ScheduleModal({ rows, onClose, onCollect }: ScheduleModalProps) {
  const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

  const [collectionDate, setCollectionDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [collectionTime, setCollectionTime] = useState("12:30");
  const [barcodesPrinted, setBarcodesPrinted] = useState(false);
  const [barcodeData, setBarcodeData] = useState<
    Record<number, { barcode_value: string; specimen_no: string }>
  >({});
  const [loadingBarcode, setLoadingBarcode] = useState(false);
  const [loadingCollect, setLoadingCollect] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Generate barcodes for each selected row
  const handlePrintBarcode = async () => {
    setLoadingBarcode(true);
    setError(null);
    try {
      const results: Record<
        number,
        { barcode_value: string; specimen_no: string }
      > = {};
      for (const row of rows) {
        const res = await fetch(`${BASE}/collections/generate-barcode/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok)
          throw new Error(`Barcode generation failed for ${row.code}`);
        const data = await res.json();
        results[row.id] = {
          barcode_value: data.barcode_value,
          specimen_no: data.specimen_no,
        };
      }
      setBarcodeData(results);
      setBarcodesPrinted(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Barcode generation failed");
    } finally {
      setLoadingBarcode(false);
    }
  };

  // Step 2: Create PendingShipment records → appears in Shipment > Pending tab
  const handleCollect = async () => {
    if (!barcodesPrinted) return;
    setLoadingCollect(true);
    setError(null);
    try {
      for (const row of rows) {
        const bc = barcodeData[row.id];

        let patientId: number | null = null;

        // Try to find existing patient
        const patientsRes = await fetch(`${BASE}/patients/`);
        if (patientsRes.ok) {
          const patients = await patientsRes.json();
          const found = Array.isArray(patients)
            ? patients.find(
                (p: Record<string, unknown>) =>
                  String(p.patient_name) === String(row.name),
              )
            : null;
          if (found) patientId = found.id;
        }

        // Create patient if not found
        if (!patientId) {
          const createPatientRes = await fetch(`${BASE}/patients/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              patient_name: row.name || "Unknown",
              age: 0,
              sex: "Unknown",
              mrn: bc?.specimen_no || "N/A",
              cycle_id: "N/A",
            }),
          });
          if (createPatientRes.ok) {
            const p = await createPatientRes.json();
            patientId = p.id;
          }
        }

        // Create pending shipment
        const pendingRes = await fetch(`${BASE}/pending-shipment/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patient: patientId,
            order_date: collectionDate,
            sample_no: bc?.specimen_no || row.specimenNo,
            sample_type: row.type === "Blood" ? "Blood" : "Urine",
            test_code: row.code,
            test_name: row.name,
            service_name: row.service,
          }),
        });

        if (!pendingRes.ok) {
          const errData = await pendingRes.json().catch(() => ({}));
          throw new Error(`Failed: ${JSON.stringify(errData)}`);
        }
      }

      // ✅ Success: close modal immediately, no alert
      onCollect();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Collection failed.");
      console.error("Collect error:", e);
      setLoadingCollect(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>Schedule Collection</span>
          <button className={styles.panelClose} onClick={onClose} type="button">
            <IconClose />
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.modalDateRow}>
            <div className={styles.modalField}>
              <span className={styles.modalLabel}>Collection Date</span>
              <div className={styles.dateInputWrap}>
                <input
                  className={styles.filterInput}
                  type="date"
                  value={collectionDate}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setCollectionDate(e.target.value)
                  }
                />
                <IconCalendar />
              </div>
            </div>
            <div className={styles.modalField}>
              <span className={styles.modalLabel}>Collection Time</span>
              <div className={styles.dateInputWrap}>
                <input
                  className={styles.filterInput}
                  type="time"
                  value={collectionTime}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setCollectionTime(e.target.value)
                  }
                />
                <IconClock />
              </div>
            </div>
          </div>

          {error && (
            <div
              style={{ color: "#E15A5A", fontSize: "12px", padding: "6px 0" }}
            >
              {error}
            </div>
          )}

          <div>
            <p className={styles.collectionDetailsTitle}>
              Collection Details ({rows.length})
            </p>
            <table className={styles.collectionTable}>
              <thead>
                <tr>
                  <th>Specimen No. | Type</th>
                  <th>Service Name</th>
                  <th>Test Code | Name</th>
                  <th>Collector Item</th>
                  {barcodesPrinted && <th>Barcode</th>}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const bc = barcodeData[row.id];
                  return (
                    <tr key={row.id}>
                      <td>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <span style={{ fontWeight: 600, fontSize: "0.88em" }}>
                            {bc?.specimen_no || row.specimenNo}
                          </span>
                          <span
                            style={{ color: "#9e9e9e", fontSize: "0.78em" }}
                          >
                            {row.type}
                          </span>
                        </div>
                      </td>
                      <td>{row.service}</td>
                      <td>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <span style={{ fontWeight: 600, fontSize: "0.88em" }}>
                            {row.code}
                          </span>
                          <span style={{ fontSize: "0.85em" }}>{row.name}</span>
                        </div>
                      </td>
                      <td>{row.collectorItem}</td>
                      {barcodesPrinted && (
                        <td
                          style={{
                            fontSize: "11px",
                            color: "#5A8AEA",
                            fontWeight: 600,
                          }}
                        >
                          {bc?.barcode_value || "—"}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button
            className={styles.modalCancelBtn}
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className={styles.modalPrintBtn}
            onClick={handlePrintBarcode}
            disabled={loadingBarcode || barcodesPrinted}
            type="button"
            style={{ opacity: barcodesPrinted ? 0.5 : 1 }}
          >
            {loadingBarcode
              ? "Generating..."
              : barcodesPrinted
                ? "Printed ✓"
                : "Print Barcode"}
          </button>
          <button
            className={`${styles.modalCollectBtn} ${!barcodesPrinted ? styles.modalCollectBtnDisabled : ""}`}
            disabled={!barcodesPrinted || loadingCollect}
            onClick={handleCollect}
            type="button"
          >
            {loadingCollect ? "Collecting..." : "Collect"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

// ─── Toast ────────────────────────────────────────────────────────────────────
function VODToast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 99999,
        background: "#ffffff",
        border: `1px solid ${type === "success" ? "#10b981" : "#ef4444"}`,
        borderLeft: `4px solid ${type === "success" ? "#10b981" : "#ef4444"}`,
        color: "#111827",
        borderRadius: "8px",
        padding: "12px 16px",
        fontSize: "13px",
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        gap: "10px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
        minWidth: "260px",
        maxWidth: "360px",
        fontFamily: "var(--shipment-font-family)",
        animation: "toastIn 0.25s ease",
      }}
    >
      <style>{`@keyframes toastIn { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
      <div
        style={{
          width: "22px",
          height: "22px",
          borderRadius: "50%",
          flexShrink: 0,
          background: type === "success" ? "#10b981" : "#ef4444",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "12px",
          fontWeight: 700,
        }}
      >
        {type === "success" ? "✓" : "✕"}
      </div>
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: "#9ca3af",
          cursor: "pointer",
          fontSize: "18px",
          padding: 0,
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        ×
      </button>
    </div>
  );
}

export default function ViewOrderDetails({
  order,
  orderId,
  onBack,
}: ViewOrderDetailsProps) {
  const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

  const [activeTab, setActiveTab] = useState<ActiveTab>("inhouse");
  const [search, setSearch] = useState("");
  const [inhouseTests, setInhouseTests] = useState<TestRow[]>([]);
  const [outsourceTests, setOutsourceTests] = useState<TestRow[]>([]);
  const [testsLoading, setTestsLoading] = useState(false);
  const [checkedRows, setCheckedRows] = useState<Set<number>>(new Set());
  const [filterOpen, setFilterOpen] = useState(false);
  const [processOpen, setProcessOpen] = useState(false);
  const [agencyOpen, setAgencyOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [testsError, setTestsError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const filterBtnRef = useRef<HTMLButtonElement | null>(null);

  // Fetch real tests from Vidai order detail API
  const realOrderId = orderId ?? order?.orderId;
  useEffect(() => {
    if (!realOrderId) return;
    setTestsLoading(true);
    setTestsError(null);
    fetch(`${BASE}/orders/${realOrderId}/`)
      .then(async (r) => {
        if (!r.ok) {
          const body = await r.text();
          throw new Error(
            `Failed to load order details (${r.status}): ${body}`,
          );
        }

        return r.json();
      })
      .then((data) => {
        const items = data.invoice_items ?? [];
        const mapStatus = (s: string): TestStatus => {
          const lower = (s || "").toLowerCase();
          if (lower === "collected") return "Collected";
          if (lower === "shipped") return "Shipped";
          if (lower === "accepted") return "Accepted";
          if (lower === "completed") return "Completed";
          if (lower === "rejected") return "Rejected";
          if (
            lower === "recollection_pending" ||
            lower === "recollection pending"
          )
            return "Recollection Pending";
          return "Pending";
        };
        const inhouse: TestRow[] = items
          .filter(
            (item: Record<string, unknown>) => item.test_type !== "OUTSOURCE",
          )
          .map((item: Record<string, unknown>, idx: number) => ({
            id: Number(item.invoice_item_id) || idx + 1,
            source: "inhouse" as const,
            date: data.visit_date
              ? new Date(data.visit_date as string).toLocaleDateString("en-GB")
              : "-",
            time: data.visit_date
              ? new Date(data.visit_date as string).toLocaleTimeString(
                  "en-US",
                  { hour: "2-digit", minute: "2-digit" },
                )
              : "-",
            code: String(
              item.test_service_code || item.billing_source_code || "-",
            ),
            name: String(
              item.test_service_name || item.billing_source_name || "-",
            ),
            service: String(item.service_name || "-"),
            specimenNo: String(item.specimen_no || "-"),
            type: String(item.sample_type || item.tube_type || "-"),
            collectorItem: String(item.tube_type || item.tube_name || "-"),
            status: mapStatus(String(item.collection_status || "Pending")),
            checked: false,
            testServiceId: Number(item.test_service_id),
          }));
        const outsource: TestRow[] = items
          .filter(
            (item: Record<string, unknown>) => item.test_type === "OUTSOURCE",
          )
          .map((item: Record<string, unknown>, idx: number) => ({
            id: Number(item.invoice_item_id) || idx + 1000,
            source: "outsource" as const,
            date: data.visit_date
              ? new Date(data.visit_date as string).toLocaleDateString("en-GB")
              : "-",
            time: data.visit_date
              ? new Date(data.visit_date as string).toLocaleTimeString(
                  "en-US",
                  { hour: "2-digit", minute: "2-digit" },
                )
              : "-",
            code: String(
              item.test_service_code || item.billing_source_code || "-",
            ),
            name: String(
              item.test_service_name || item.billing_source_name || "-",
            ),
            service: String(item.service_name || "-"),
            specimenNo: String(item.specimen_no || "-"),
            type: String(item.sample_type || "-"),
            collectorItem: String(item.tube_type || item.tube_name || "-"),
            agency: String(item.agency_name || "-"),
            status: mapStatus(String(item.collection_status || "Pending")),
            checked: false,
            testServiceId: Number(item.test_service_id),
          }));
        setInhouseTests(inhouse);
        setOutsourceTests(outsource);
        setCheckedRows(new Set());
      })
      .catch((err) => {
        console.error(err);
        setTestsError("Unable to load test details. Please try again later.");
        setInhouseTests([]);
        setOutsourceTests([]);
      })
      .finally(() => setTestsLoading(false));
  }, [BASE, realOrderId, refreshKey]);

  const isOutsource = activeTab === "outsource";
  const tests: TestRow[] = isOutsource ? outsourceTests : inhouseTests;
  const totalInhouse = realOrderId
    ? inhouseTests.filter((t) => !INHOUSE_TESTS.includes(t)).length ||
      inhouseTests.length
    : inhouseTests.length;
  const totalOutsource = realOrderId
    ? outsourceTests.filter((t) => !OUTSOURCE_TESTS.includes(t)).length ||
      outsourceTests.length
    : outsourceTests.length;

  const toggleRow = (id: number) => {
    setCheckedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const checkedTests = tests.filter((t) => checkedRows.has(t.id));
  const filteredTests = tests.filter(
    (t) =>
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.code.toLowerCase().includes(search.toLowerCase()),
  );

  // ─── Download / Print handlers ────────────────────────────────────────────
  const handleDownload = (row: (typeof tests)[0]) => {
    const NL = String.fromCharCode(10);
    const text = [
      "Test Result Report",
      "==================",
      "Patient   : " + (patient.patientName ?? "-"),
      "Age       : " + (patient.patientAge ?? "-") + " Years",
      "Gender    : " + (patient.gender ?? "-"),
      "MRN       : " + (patient.mrn ?? "-"),
      "Cycle ID  : " + (patient.cycleId ?? "-"),
      "",
      "Test Code : " + row.code,
      "Test Name : " + row.name,
      "Service   : " + row.service,
      "Specimen  : " + row.specimenNo,
      "Type      : " + row.type,
      "Status    : " + row.status,
      "Date      : " + row.date + " " + row.time,
    ].join(NL);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download =
      "result_" + row.code + "_" + row.name.replace(/\s+/g, "_") + ".txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = (row: (typeof tests)[0]) => {
    const patientName = patient.patientName ?? "-";
    const patientAge = patient.patientAge ? patient.patientAge + " Years" : "-";
    const gender = patient.gender ?? "-";
    const mrn = patient.mrn ?? "-";
    const cycleId = patient.cycleId ?? "-";
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-GB");
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const html = [
      "<!DOCTYPE html><html><head>",
      "<title>Test Result - " + row.name + "</title>",
      "<style>",
      "body{font-family:Plus Jakarta Sans,sans-serif;padding:32px;color:#111827;font-size:13px}",
      "h1{font-size:18px;font-weight:700;margin-bottom:4px}",
      ".sub{color:#6b7280;font-size:12px;margin-bottom:24px}",
      "table{width:100%;border-collapse:collapse;margin-top:16px}",
      "th{text-align:left;font-size:11px;color:#9ca3af;font-weight:400;padding:8px 12px;background:#f9fafb;border-bottom:1px solid #e5e7eb}",
      "td{padding:10px 12px;font-size:13px;border-bottom:1px solid #f3f4f6}",
      ".badge{display:inline-block;padding:2px 10px;border-radius:20px;font-size:11px;font-weight:600;background:#f0fdf4;color:#10b981;border:1px solid #10b981}",
      ".grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px}",
      ".field label{font-size:10px;color:#9ca3af;display:block;margin-bottom:2px}",
      ".field span{font-size:13px;font-weight:600;color:#111827}",
      "@media print{body{padding:16px}}",
      "</style></head><body>",
      "<h1>Test Result Report</h1>",
      '<div class="sub">Generated on ' + dateStr + " at " + timeStr + "</div>",
      '<div class="grid">',
      '<div class="field"><label>Patient Name</label><span>' +
        patientName +
        "</span></div>",
      '<div class="field"><label>Age</label><span>' +
        patientAge +
        "</span></div>",
      '<div class="field"><label>Gender</label><span>' +
        gender +
        "</span></div>",
      '<div class="field"><label>MRN</label><span>' + mrn + "</span></div>",
      '<div class="field"><label>Cycle ID</label><span>' +
        cycleId +
        "</span></div>",
      "</div>",
      "<table><thead><tr>",
      "<th>Test Code</th><th>Test Name</th><th>Service</th>",
      "<th>Specimen No.</th><th>Type</th><th>Collector Item</th><th>Status</th><th>Date | Time</th>",
      "</tr></thead><tbody><tr>",
      "<td>" + row.code + "</td>",
      "<td>" + row.name + "</td>",
      "<td>" + row.service + "</td>",
      "<td>" + row.specimenNo + "</td>",
      "<td>" + row.type + "</td>",
      "<td>" + row.collectorItem + "</td>",
      '<td><span class="badge">' + row.status + "</span></td>",
      "<td>" + row.date + " " + row.time + "</td>",
      "</tr></tbody></table>",
      "<script>window.onload=function(){window.print();window.onafterprint=function(){window.close();}}<\\/script>",
      "</body></html>",
    ].join("");

    const w = window.open("", "_blank", "width=900,height=600");
    if (w) {
      w.document.write(html);
      w.document.close();
    }
  };

  const patient: PatientOrder = order ?? {};

  return (
    <div className={styles.page}>
      {toast && (
        <VODToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className={styles.card}>
        {/* FIX 3: Card header with back arrow and title */}
        <div className={styles.cardHeader}>
          <button className={styles.backBtn} onClick={onBack} type="button">
            <IconBack />
          </button>
          <h2 className={styles.cardTitle}>View Order Details</h2>
        </div>

        {/* FIX 3: Patient bar — label small grey, value dark bold */}
        <div className={styles.patientBar}>
          <div className={styles.avatar}>
            {patient.patientName?.charAt(0) ?? "-"}
          </div>
          <div className={styles.patientFields}>
            {[
              { label: "Patient Name", val: patient.patientName },
              {
                label: "Age",
                val: patient.patientAge ? `${patient.patientAge} Years` : "-",
              },
              {
                label: "Sex Assigned At Birth",
                val: patient.gender ?? "-",
              },
              { label: "MRN", val: patient.mrn ?? "-" },
              { label: "Cycle ID", val: patient.cycleId ?? "-" },
            ].map(({ label, val }) => (
              <div key={label} className={styles.field}>
                <span className={styles.fieldLabel}>{label}</span>
                <span className={styles.fieldValue}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FIX 3: List of Tests heading */}
        <div className={styles.listHeader}>
          <h3 className={styles.listTitle}>
            List of Tests{" "}
            <span
              style={{ fontWeight: 400, color: "#6b7280", fontSize: "11px" }}
            >
              ({totalInhouse + totalOutsource})
            </span>
          </h3>
          <div className={styles.listActions}>
            <div className={styles.searchWrap}>
              <span className={styles.searchIcon}>
                <IconSearch />
              </span>
              <input
                className={styles.searchInput}
                placeholder="Search by Test Name / Code"
                value={search}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSearch(e.target.value)
                }
              />
            </div>
            <div className={styles.filterBtnWrap}>
              <button
                ref={filterBtnRef}
                className={`${styles.iconBtn} ${filterOpen ? styles.iconBtnActive : ""}`}
                onClick={() => setFilterOpen((o) => !o)}
                type="button"
              >
                <IconFilter />
              </button>
              {filterOpen && (
                <FilterDropdown
                  onClose={() => setFilterOpen(false)}
                  anchorRef={filterBtnRef}
                />
              )}
            </div>
          </div>
        </div>

        <div className={styles.tabRow}>
          <button
            className={`${styles.tabPill} ${activeTab === "inhouse" ? styles.tabPillActive : ""}`}
            onClick={() => setActiveTab("inhouse")}
            type="button"
          >
            Inhouse ({totalInhouse})
          </button>
          <button
            className={`${styles.tabPill} ${activeTab === "outsource" ? styles.tabPillActive : ""}`}
            onClick={() => setActiveTab("outsource")}
            type="button"
          >
            Outsource ({totalOutsource})
          </button>
        </div>

        {/* FIX 4 & 5: Table with proper column spacing, status centered, result icons blue */}
        <div className={styles.tableWrap}>
          {testsLoading ? (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                color: "#9ca3af",
              }}
            >
              Loading tests...
            </div>
          ) : testsError ? (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                color: "#dc2626",
                fontSize: "14px",
              }}
            >
              {testsError}
            </div>
          ) : tests.length === 0 ? (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                color: "#9ca3af",
                fontSize: "14px",
              }}
            >
              No tests available for this order.
            </div>
          ) : filteredTests.length === 0 ? (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                color: "#9ca3af",
                fontSize: "14px",
              }}
            >
              No matching tests found.
            </div>
          ) : (
            <table
              className={styles.table}
              style={{ display: testsLoading ? "none" : "table" }}
            >
              <thead className={styles.head}>
                <tr>
                  <th style={{ width: "3%" }}></th>
                  <th style={{ width: "12%" }}>Date | Time</th>
                  <th style={{ width: isOutsource ? "13%" : "16%" }}>
                    Test Code | Name
                  </th>
                  <th style={{ width: "16%" }}>Service Name</th>
                  <th style={{ width: "13%" }}>Specimen No. | Type</th>
                  <th style={{ width: isOutsource ? "14%" : "19%" }}>
                    Collector Item
                  </th>
                  {isOutsource && <th style={{ width: "10%" }}>Agency</th>}
                  <th style={{ width: "14%", textAlign: "center" }}>
                    Test Status
                  </th>
                  <th style={{ width: "7%", textAlign: "center" }}>Result</th>
                  <th style={{ width: "5%", textAlign: "center" }}>Print</th>
                </tr>
              </thead>
              <tbody>
                {filteredTests.map((row) => (
                  <tr key={row.id} className={styles.row}>
                    {/* FIX 1: Square checkbox */}
                    <td style={{ verticalAlign: "middle" }}>
                      <CheckCircle
                        checked={checkedRows.has(row.id)}
                        onClick={() => toggleRow(row.id)}
                      />
                    </td>

                    {/* FIX 2: Date/time same dark color */}
                    <td>
                      <div className={styles.dateCell}>
                        <span className={styles.datePrimary}>{row.date}</span>
                        <span className={styles.dateSub}>{row.time}</span>
                      </div>
                    </td>

                    <td>
                      <div className={styles.codeCell}>
                        <span className={styles.codePrimary}>{row.code}</span>
                        <span
                          className={styles.codeSub}
                          style={{ color: "#6b7280" }}
                        >
                          {row.name}
                        </span>
                      </div>
                    </td>

                    <td style={{ color: "#111827" }}>{row.service}</td>

                    <td>
                      <div className={styles.specimenCell}>
                        <span className={styles.specimenPrimary}>
                          {row.specimenNo}
                        </span>
                        <span className={styles.specimenSub}>{row.type}</span>
                      </div>
                    </td>

                    <td style={{ color: "#111827" }}>{row.collectorItem}</td>

                    {isOutsource && "agency" in row && (
                      <td>
                        <div className={styles.agencyCell}>
                          <span style={{ color: "#111827" }}>{row.agency}</span>
                          <button
                            className={styles.actionBtn}
                            onClick={() => setAgencyOpen(true)}
                            type="button"
                          >
                            <IconEdit />
                          </button>
                        </div>
                      </td>
                    )}

                    {/* FIX 4: Status centered */}
                    <td style={{ textAlign: "center" }}>
                      <div className={styles.statusCell}>
                        <span
                          className={`${styles.badge} ${BADGE_CLASS[row.status]}`}
                        >
                          {row.status}
                        </span>
                        {HAS_INFO.includes(row.status) && (
                          <button
                            className={styles.actionBtn}
                            onClick={() => setProcessOpen(true)}
                            type="button"
                          >
                            <IconInfo />
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Result col - download icon */}
                    <td style={{ textAlign: "center" }}>
                      <div className={styles.resultCell}>
                        {HAS_RESULT.includes(row.status) ? (
                          <button
                            className={styles.actionBtn}
                            type="button"
                            title="Download result"
                            onClick={() => handleDownload(row)}
                          >
                            <IconDownload />
                          </button>
                        ) : (
                          <span className={styles.dash}>—</span>
                        )}
                      </div>
                    </td>
                    {/* Print col - print icon */}
                    <td style={{ textAlign: "center" }}>
                      <div className={styles.resultCell}>
                        {HAS_RESULT.includes(row.status) ? (
                          <button
                            className={styles.actionBtn}
                            type="button"
                            title="Print result"
                            onClick={() => handlePrint(row)}
                          >
                            <IconPrint />
                          </button>
                        ) : (
                          <span className={styles.dash}>—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className={styles.cardFooter}>
          {(() => {
            const hasChecked = checkedTests.length > 0;
            const allDone = checkedTests.every(
              (t) =>
                t.status === "Completed" ||
                t.status === "Collected" ||
                t.status === "Shipped" ||
                t.status === "Accepted",
            );
            const canSchedule = hasChecked && !allDone;
            return (
              <button
                className={styles.scheduleBtn}
                onClick={() => canSchedule && setScheduleOpen(true)}
                type="button"
                disabled={!canSchedule}
                style={{
                  opacity: canSchedule ? 1 : 0.4,
                  cursor: canSchedule ? "pointer" : "not-allowed",
                }}
              >
                Schedule Collection
              </button>
            );
          })()}
        </div>
      </div>

      {agencyOpen && <AgencyModal onClose={() => setAgencyOpen(false)} />}
      {processOpen && <ProcessModal onClose={() => setProcessOpen(false)} />}
      {scheduleOpen && (
        <ScheduleModal
          rows={checkedTests.length > 0 ? checkedTests : tests.slice(0, 3)}
          onClose={() => setScheduleOpen(false)}
          onCollect={() => {
            setScheduleOpen(false);
            setCheckedRows(new Set()); // ✅ uncheck all rows after collect
            setRefreshKey((prev) => prev + 1);
            setToast({
              message: "Samples collected successfully!",
              type: "success",
            });
          }}
        />
      )}
    </div>
  );
}
