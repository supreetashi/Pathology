import { useState, useMemo, useRef, useEffect } from "react";
import styles from "./OrdersView.module.css";
import FilterIcon from "../../assets/icons/filter.svg";
import SearchIcon from "../../assets/icons/search.png";
import Calendar from "../../assets/icons/calendar2.svg";
import ViewOrderDetails from "./ViewOrderDetails";

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderStatus = "Pending" | "Partial" | "Complete";
type PatientType = "Walk-In" | "Registered";
type TabKey = "all" | "inhouse" | "outsource";

type OrderRow = {
  id: string;
  date: string;
  time: string;
  patientName: string;
  patientAge: number;
  mrn: string;
  gender: string;
  patientType: PatientType;
  doctorName: string;
  billNo: string;
  netAmt: number;
  billStatus: "Paid" | "Unpaid";
  totalTests: number;
  orderStatus: OrderStatus;
  type: "inhouse" | "outsource";
};

type FilterValues = {
  fromDate: string;
  toDate: string;
  doctor: string;
  orderStatus: string;
  patientType: string;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const DOCTORS = [
  "",
  "Dr. Emilia Clarke",
  "Dr. Olivia Bennett",
  "Dr. Lucas Harper",
  "Dr. Mia Thompson",
  "Dr. Ethan Carter",
  "Dr. Ava Johnson",
  "Dr. Noah Smith",
];
const ORDER_STATUSES = ["", "Pending", "Partial", "Complete"];
const PATIENT_TYPES = ["", "Walk-In", "Registered"];

const ALL_ORDERS: OrderRow[] = [
  { id: "o1",  date: "04/02/2024", time: "10:30 AM", patientName: "Emilia Williamson",  patientAge: 27, mrn: "PCC-1719", gender: "Female", patientType: "Walk-In",    doctorName: "Dr. Emilia Clarke",  billNo: "PCC/25/OP/000134", netAmt: 5463, billStatus: "Paid", totalTests: 16, orderStatus: "Pending",  type: "inhouse"   },
  { id: "o2",  date: "04/02/2024", time: "10:30 AM", patientName: "Olivia Anderson",    patientAge: 29, mrn: "PCC-1719", gender: "Female", patientType: "Registered", doctorName: "Dr. Olivia Bennett", billNo: "PCC/25/OP/000134", netAmt: 5463, billStatus: "Paid", totalTests: 16, orderStatus: "Pending",  type: "inhouse"   },
  { id: "o3",  date: "04/02/2024", time: "10:30 AM", patientName: "Mia Thompson",       patientAge: 32, mrn: "PCC-1719", gender: "Female", patientType: "Registered", doctorName: "Dr. Lucas Harper",   billNo: "PCC/25/OP/000134", netAmt: 5463, billStatus: "Paid", totalTests: 16, orderStatus: "Partial",  type: "inhouse"   },
  { id: "o4",  date: "04/02/2024", time: "10:30 AM", patientName: "Isabella Martinez",  patientAge: 33, mrn: "PCC-1719", gender: "Female", patientType: "Walk-In",    doctorName: "Dr. Mia Thompson",   billNo: "PCC/25/OP/000134", netAmt: 5463, billStatus: "Paid", totalTests: 16, orderStatus: "Partial",  type: "inhouse"   },
  { id: "o5",  date: "04/02/2024", time: "10:30 AM", patientName: "Sophia Wilson",      patientAge: 34, mrn: "PCC-1719", gender: "Female", patientType: "Registered", doctorName: "Dr. Ethan Carter",   billNo: "PCC/25/OP/000134", netAmt: 5463, billStatus: "Paid", totalTests: 5,  orderStatus: "Complete", type: "inhouse"   },
  { id: "o6",  date: "04/02/2024", time: "10:30 AM", patientName: "Charlotte Anderson", patientAge: 28, mrn: "PCC-1719", gender: "Female", patientType: "Walk-In",    doctorName: "Dr. Ava Johnson",    billNo: "PCC/25/OP/000134", netAmt: 5463, billStatus: "Paid", totalTests: 5,  orderStatus: "Complete", type: "inhouse"   },
  { id: "o7",  date: "04/02/2024", time: "10:30 AM", patientName: "Ava Wilson",         patientAge: 31, mrn: "PCC-1719", gender: "Female", patientType: "Walk-In",    doctorName: "Dr. Noah Smith",     billNo: "PCC/25/OP/000134", netAmt: 5463, billStatus: "Paid", totalTests: 5,  orderStatus: "Complete", type: "inhouse"   },
  { id: "o8",  date: "04/02/2024", time: "10:30 AM", patientName: "Olivia Anderson",    patientAge: 29, mrn: "PCC-1719", gender: "Female", patientType: "Registered", doctorName: "Dr. Olivia Bennett", billNo: "PCC/25/OP/000134", netAmt: 5463, billStatus: "Paid", totalTests: 5,  orderStatus: "Complete", type: "inhouse"   },
  { id: "o9",  date: "04/02/2024", time: "10:30 AM", patientName: "Olivia Anderson",    patientAge: 29, mrn: "PCC-1719", gender: "Female", patientType: "Registered", doctorName: "Dr. Olivia Bennett", billNo: "PCC/25/OP/000134", netAmt: 5463, billStatus: "Paid", totalTests: 5,  orderStatus: "Complete", type: "inhouse"   },
  { id: "o10", date: "04/02/2024", time: "10:30 AM", patientName: "Emilia Williamson",  patientAge: 27, mrn: "PCC-1719", gender: "Female", patientType: "Walk-In",    doctorName: "Dr. Emilia Clarke",  billNo: "PCC/25/OP/000134", netAmt: 5463, billStatus: "Paid", totalTests: 9,  orderStatus: "Pending",  type: "outsource" },
  { id: "o11", date: "04/02/2024", time: "10:30 AM", patientName: "Olivia Anderson",    patientAge: 29, mrn: "PCC-1719", gender: "Female", patientType: "Registered", doctorName: "Dr. Olivia Bennett", billNo: "PCC/25/OP/000134", netAmt: 5463, billStatus: "Paid", totalTests: 9,  orderStatus: "Pending",  type: "outsource" },
  { id: "o12", date: "04/02/2024", time: "10:30 AM", patientName: "Mia Thompson",       patientAge: 32, mrn: "PCC-1719", gender: "Female", patientType: "Registered", doctorName: "Dr. Lucas Harper",   billNo: "PCC/25/OP/000134", netAmt: 5463, billStatus: "Paid", totalTests: 9,  orderStatus: "Partial",  type: "outsource" },
  { id: "o13", date: "04/02/2024", time: "10:30 AM", patientName: "Isabella Martinez",  patientAge: 33, mrn: "PCC-1719", gender: "Female", patientType: "Walk-In",    doctorName: "Dr. Mia Thompson",   billNo: "PCC/25/OP/000134", netAmt: 5463, billStatus: "Paid", totalTests: 9,  orderStatus: "Partial",  type: "outsource" },
  { id: "o14", date: "04/02/2024", time: "10:30 AM", patientName: "Sophia Wilson",      patientAge: 34, mrn: "PCC-1719", gender: "Female", patientType: "Registered", doctorName: "Dr. Ethan Carter",   billNo: "PCC/25/OP/000134", netAmt: 5463, billStatus: "Paid", totalTests: 2,  orderStatus: "Complete", type: "outsource" },
  { id: "o15", date: "04/02/2024", time: "10:30 AM", patientName: "Charlotte Anderson", patientAge: 28, mrn: "PCC-1719", gender: "Female", patientType: "Walk-In",    doctorName: "Dr. Ava Johnson",    billNo: "PCC/25/OP/000134", netAmt: 5463, billStatus: "Paid", totalTests: 2,  orderStatus: "Complete", type: "outsource" },
  { id: "o16", date: "04/02/2024", time: "10:30 AM", patientName: "Ava Wilson",         patientAge: 31, mrn: "PCC-1719", gender: "Female", patientType: "Walk-In",    doctorName: "Dr. Noah Smith",     billNo: "PCC/25/OP/000134", netAmt: 5463, billStatus: "Paid", totalTests: 2,  orderStatus: "Complete", type: "outsource" },
  { id: "o17", date: "04/02/2024", time: "10:30 AM", patientName: "Ava Wilson",         patientAge: 31, mrn: "PCC-1719", gender: "Female", patientType: "Walk-In",    doctorName: "Dr. Noah Smith",     billNo: "PCC/25/OP/000134", netAmt: 5463, billStatus: "Paid", totalTests: 2,  orderStatus: "Complete", type: "outsource" },
  { id: "o18", date: "04/02/2024", time: "10:30 AM", patientName: "Ava Wilson",         patientAge: 31, mrn: "PCC-1719", gender: "Female", patientType: "Walk-In",    doctorName: "Dr. Noah Smith",     billNo: "PCC/25/OP/000134", netAmt: 5463, billStatus: "Paid", totalTests: 2,  orderStatus: "Complete", type: "outsource" },
  { id: "o19", date: "04/02/2024", time: "10:30 AM", patientName: "Ava Wilson",         patientAge: 31, mrn: "PCC-1719", gender: "Female", patientType: "Walk-In",    doctorName: "Dr. Noah Smith",     billNo: "PCC/25/OP/000134", netAmt: 5463, billStatus: "Paid", totalTests: 2,  orderStatus: "Complete", type: "outsource" },
  { id: "o20", date: "04/02/2024", time: "10:30 AM", patientName: "Ava Wilson",         patientAge: 31, mrn: "PCC-1719", gender: "Female", patientType: "Walk-In",    doctorName: "Dr. Noah Smith",     billNo: "PCC/25/OP/000134", netAmt: 5463, billStatus: "Paid", totalTests: 2,  orderStatus: "Complete", type: "outsource" },
];

const PAGE_SIZE = 10;

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`${styles.badge} ${styles[`badge${status}`]}`}>
      {status}
    </span>
  );
}

// ─── Bill Details Tooltip ─────────────────────────────────────────────────────

function BillTooltip({ billNo, netAmt, billStatus }: { billNo: string; netAmt: number; billStatus: "Paid" | "Unpaid" }) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setShow(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  return (
    <div className={styles.billWrapper} ref={ref}>
      <span className={styles.billNo}>
        <button className={styles.billInfoBtn} onClick={() => setShow((s) => !s)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9e9e9e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </button>
        {billNo}
      </span>
      {show && (
        <div className={styles.billTooltip}>
          <div className={styles.billTooltipRow}>
            <span className={styles.billTooltipLabel}>Net Amt.</span>
            <span className={styles.billTooltipValue}>${netAmt.toLocaleString()}.0</span>
          </div>
          <div className={styles.billTooltipRow}>
            <span className={styles.billTooltipLabel}>Status</span>
            <span className={`${styles.badge} ${styles[`badge${billStatus}`]}`}>{billStatus}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Filter Modal ─────────────────────────────────────────────────────────────

function FilterModal({ isOpen, onClose, onApply, onClear, values, onChange }: {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
  values: FilterValues;
  onChange: (f: FilterValues) => void;
}) {
  if (!isOpen) return null;

  const set = (field: keyof FilterValues, v: string) =>
    onChange({ ...values, [field]: v });

  const ChevronIcon = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <path fill="#9e9e9e" d="M6 8L1 3h10z" />
    </svg>
  );

  return (
    <div className={styles.filterOverlay} onClick={onClose}>
      <div className={styles.filterModal} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className={styles.filterHeader}>
          <span className={styles.filterTitle}>Filters</span>
          <button className={styles.filterClose} onClick={onClose}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <line x1="1" y1="1" x2="11" y2="11" stroke="#505050" strokeWidth="2" strokeLinecap="round" />
              <line x1="11" y1="1" x2="1" y2="11" stroke="#505050" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className={styles.filterBody}>

          {/* Row 1: From Date + To Date */}
          <div className={styles.filterGrid2}>
            <div className={styles.floatBorder}>
              <span className={styles.floatLabel}>From Date</span>
              <div className={styles.floatInputRow}>
                <input className={styles.floatInput} type="text" value={values.fromDate} onChange={(e) => set("fromDate", e.target.value)} placeholder="DD/MM/YYYY" />
                <img src={Calendar} alt="" width={16} height={16} style={{ flexShrink: 0 }} />
              </div>
            </div>
            <div className={styles.floatBorder}>
              <span className={styles.floatLabel}>To Date</span>
              <div className={styles.floatInputRow}>
                <input className={styles.floatInput} type="text" value={values.toDate} onChange={(e) => set("toDate", e.target.value)} placeholder="DD/MM/YYYY" />
                <img src={Calendar} alt="" width={16} height={16} style={{ flexShrink: 0 }} />
              </div>
            </div>
          </div>

          {/* Row 2: Doctor + Order Status */}
          <div className={styles.filterGrid2}>
            <div className={styles.floatBorder}>
              <span className={styles.floatLabel}>Doctor</span>
              <div className={styles.floatInputRow}>
                <select className={styles.floatSelect} value={values.doctor} onChange={(e) => set("doctor", e.target.value)}>
                  {DOCTORS.map((d) => <option key={d} value={d}>{d || "Select"}</option>)}
                </select>
                <ChevronIcon />
              </div>
            </div>
            <div className={styles.floatBorder}>
              <span className={styles.floatLabel}>Order Status</span>
              <div className={styles.floatInputRow}>
                <select className={styles.floatSelect} value={values.orderStatus} onChange={(e) => set("orderStatus", e.target.value)}>
                  {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s || "Select"}</option>)}
                </select>
                <ChevronIcon />
              </div>
            </div>
          </div>

          {/* Row 3: Patient Type — full width */}
          <div className={styles.floatBorder}>
            <span className={styles.floatLabel}>Patient Type</span>
            <div className={styles.floatInputRow}>
              <select className={styles.floatSelect} value={values.patientType} onChange={(e) => set("patientType", e.target.value)}>
                {PATIENT_TYPES.map((t) => <option key={t} value={t}>{t || "Select"}</option>)}
              </select>
              <ChevronIcon />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className={styles.filterFooter}>
          <button className={styles.filterClearBtn} onClick={onClear}>Clear All</button>
          <button className={styles.filterApplyBtn} onClick={() => { onApply(); onClose(); }}>Apply</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OrdersView() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);

  const [filters, setFilters] = useState<FilterValues>({ fromDate: "", toDate: "", doctor: "", orderStatus: "", patientType: "" });
  const [appliedFilters, setAppliedFilters] = useState<FilterValues>({ fromDate: "", toDate: "", doctor: "", orderStatus: "", patientType: "" });

  const tabFiltered = useMemo(() => {
    if (activeTab === "inhouse")   return ALL_ORDERS.filter((o) => o.type === "inhouse");
    if (activeTab === "outsource") return ALL_ORDERS.filter((o) => o.type === "outsource");
    return ALL_ORDERS;
  }, [activeTab]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tabFiltered.filter((o) => {
      const matchSearch = !q || o.patientName.toLowerCase().includes(q) || o.mrn.toLowerCase().includes(q) || o.billNo.toLowerCase().includes(q);
      const matchDoctor  = !appliedFilters.doctor      || o.doctorName  === appliedFilters.doctor;
      const matchStatus  = !appliedFilters.orderStatus || o.orderStatus === appliedFilters.orderStatus;
      const matchType    = !appliedFilters.patientType || o.patientType === appliedFilters.patientType;
      return matchSearch && matchDoctor && matchStatus && matchType;
    });
  }, [tabFiltered, search, appliedFilters]);

  const totalPages    = Math.ceil(filtered.length / PAGE_SIZE);
  const pageRows      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const inhouseCount  = ALL_ORDERS.filter((o) => o.type === "inhouse").length;
  const outsourceCount= ALL_ORDERS.filter((o) => o.type === "outsource").length;

  const handleTabChange = (tab: TabKey) => { setActiveTab(tab); setPage(1); };

  if (selectedOrder) {
    return <ViewOrderDetails order={selectedOrder} onBack={() => setSelectedOrder(null)} />;
  }

  return (
    <div className={styles.wrapper}>

      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className={styles.toolbar}>
        <h2 className={styles.title}>List of Work Orders ({filtered.length})</h2>
        <div className={styles.actions}>
          <div className={styles.searchWrap}>
            <img src={SearchIcon} className={styles.searchIcon} alt="" />
            <input
              className={styles.searchInput}
              placeholder="Search by Patient Name, MRN No., Bill No."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <button className={styles.filterBtn} onClick={() => setFilterOpen(true)}>
            <img src={FilterIcon} alt="filter" width={18} height={18} />
          </button>
        </div>
      </div>

      {/* ── Tab Pills ───────────────────────────────────────────────────── */}
      <div className={styles.tabRow}>
        {(["all", "inhouse", "outsource"] as TabKey[]).map((tab) => (
          <button
            key={tab}
            className={`${styles.tabPill} ${activeTab === tab ? styles.tabPillActive : ""}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab === "all" ? `All Orders (${ALL_ORDERS.length})` : tab === "inhouse" ? `Inhouse (${inhouseCount})` : `Outsource (${outsourceCount})`}
          </button>
        ))}
      </div>

      {/* ── Table ───────────────────────────────────────────────────────── */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.head}>
            <tr>
              <th style={{ width: "13%" }}>Order Date | Time</th>
              <th style={{ width: "20%" }}>Patient</th>
              <th style={{ width: "10%" }}>Patient Type</th>
              <th style={{ width: "14%" }}>Doctor Name</th>
              <th style={{ width: "16%" }}>Bill Details</th>
              <th style={{ width: "8%"  }}>Total Tests</th>
              <th style={{ width: "12%", textAlign: "right" }}>Order Status</th>
              <th style={{ width: "7%"  }}></th>
            </tr>
          </thead>
          <tbody className={styles.scrollBody}>
            {Array.from({ length: PAGE_SIZE }, (_, i) => {
              const row = pageRows[i];
              return row ? (
                <tr key={row.id} className={styles.row}>
                  <td>
                    <div className={styles.dateCell}>
                      <span className={styles.dateText}>{row.date}</span>
                      <span className={styles.timeText}>{row.time}</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.patientCell}>
                      <span className={styles.patientName}>{row.patientName} | {row.patientAge}</span>
                      <span className={styles.patientSub}>{row.mrn} | {row.gender}</span>
                    </div>
                  </td>
                  <td>{row.patientType}</td>
                  <td>{row.doctorName}</td>
                  <td>
                    <BillTooltip billNo={row.billNo} netAmt={row.netAmt} billStatus={row.billStatus} />
                  </td>
                  <td>{row.totalTests}</td>
                  <td style={{ textAlign: "right" }}>
                    <StatusBadge status={row.orderStatus} />
                  </td>
                  <td style={{ textAlign: "right", paddingRight: "1em" }}>
                    <button className={styles.viewBtn} onClick={() => setSelectedOrder(row)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9e9e9e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={`empty-${i}`} className={styles.row}>
                  {Array.from({ length: 8 }, (_, j) => <td key={j} />)}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Footer / Pagination ─────────────────────────────────────────── */}
      <div className={styles.footer}>
        <span>
          Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} entries
        </span>
        <div className={styles.pagination}>
          <button className={styles.pageBtn} disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            <svg width="7" height="11" viewBox="0 0 7 11" fill="none">
              <path d="M6 1L1 5.5L6 10" stroke="#505050" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
            <button key={p} className={`${styles.pageNumBtn} ${p === page ? styles.pageNumActive : ""}`} onClick={() => setPage(p)}>
              {p}
            </button>
          ))}
          <button className={styles.pageBtn} disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
            <svg width="7" height="11" viewBox="0 0 7 11" fill="none">
              <path d="M1 1L6 5.5L1 10" stroke="#505050" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Filter Modal ─────────────────────────────────────────────────── */}
      <FilterModal
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={() => setAppliedFilters(filters)}
        onClear={() => {
          const empty = { fromDate: "", toDate: "", doctor: "", orderStatus: "", patientType: "" };
          setFilters(empty);
          setAppliedFilters(empty);
        }}
        values={filters}
        onChange={setFilters}
      />
    </div>
  );
}