import { useState, useMemo, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../store";
import { fetchOrders, selectOrders, selectOrdersLoading, setSelectedOrder, selectSelectedOrder, clearSelectedOrder } from "../../store/orders.slice";
import styles from "./OrdersView.module.css";
import FilterIcon from "../../assets/icons/filter.svg";
import SearchIcon from "../../assets/icons/search.png";
import Calendar from "../../assets/icons/calendar2.svg";
import ViewOrderDetails from "./ViewOrderDetails";

// import shared types — no need to redefine them here
import type { OrderRow, OrderFilters } from "../../types/orders.types";

// ─── Component-only types ─────────────────────────────────────────────────────

type TabKey = "all" | "inhouse" | "outsource";

// ─── Constants ────────────────────────────────────────────────────────────────

const ORDER_STATUSES = ["", "Pending", "Partial", "Complete"];
const PATIENT_TYPES  = ["", "Walk-In", "Registered"];
const PAGE_SIZE      = 10;

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: OrderRow["orderStatus"] }) {
  return (
    <span className={`${styles.badge} ${styles[`badge${status}`]}`}>
      {status}
    </span>
  );
}

// ─── Bill Details Tooltip ─────────────────────────────────────────────────────

function BillTooltip({ billNo, netAmt, billStatus }: { billNo: string; netAmt: number; billStatus: OrderRow["billStatus"] }) {
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

function FilterModal({ isOpen, onClose, onApply, onClear, values, onChange, doctors }: {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
  values: OrderFilters;
  onChange: (f: OrderFilters) => void;
  doctors: string[];
}) {
  if (!isOpen) return null;

  const set = (field: keyof OrderFilters, v: string) =>
    onChange({ ...values, [field]: v });

  const ChevronIcon = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <path fill="#9e9e9e" d="M6 8L1 3h10z" />
    </svg>
  );

  return (
    <div className={styles.filterOverlay} onClick={onClose}>
      <div className={styles.filterModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.filterHeader}>
          <span className={styles.filterTitle}>Filters</span>
          <button className={styles.filterClose} onClick={onClose}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <line x1="1" y1="1" x2="11" y2="11" stroke="#505050" strokeWidth="2" strokeLinecap="round" />
              <line x1="11" y1="1" x2="1" y2="11" stroke="#505050" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className={styles.filterBody}>
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

          <div className={styles.filterGrid2}>
            <div className={styles.floatBorder}>
              <span className={styles.floatLabel}>Doctor</span>
              <div className={styles.floatInputRow}>
                <select className={styles.floatSelect} value={values.doctor} onChange={(e) => set("doctor", e.target.value)}>
                  <option value="">Select</option>
                  {doctors.map((d) => <option key={d} value={d}>{d}</option>)}
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
  const dispatch = useDispatch<AppDispatch>();
  const orders   = useSelector(selectOrders);
  const loading  = useSelector(selectOrdersLoading);
  const selectedOrder = useSelector(selectSelectedOrder);

  const [activeTab, setActiveTab]       = useState<TabKey>("all");
  const [search, setSearch]             = useState("");
  const [page, setPage]                 = useState(1);
  const [filterOpen, setFilterOpen]     = useState(false);

  const emptyFilters: OrderFilters = { fromDate: "", toDate: "", doctor: "", orderStatus: "", patientType: "" };
  const [filters, setFilters]           = useState<OrderFilters>(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState<OrderFilters>(emptyFilters);

  // Fetch on mount
  useEffect(() => { dispatch(fetchOrders()); }, [dispatch]);

  // Derive unique doctor names from real data for the filter dropdown
  const doctors = useMemo(() =>
    [...new Set(orders.map((o) => o.doctorName).filter(Boolean))],
    [orders]
  );

  const tabFiltered = useMemo(() => {
    if (activeTab === "inhouse")   return orders.filter((o) => o.type === "inhouse");
    if (activeTab === "outsource") return orders.filter((o) => o.type === "outsource");
    return orders;
  }, [activeTab, orders]);

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

  const totalPages     = Math.ceil(filtered.length / PAGE_SIZE);
  const pageRows       = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const inhouseCount   = orders.filter((o) => o.type === "inhouse").length;
  const outsourceCount = orders.filter((o) => o.type === "outsource").length;

  const handleTabChange = (tab: TabKey) => { setActiveTab(tab); setPage(1); };

  if (selectedOrder) {
    return (
      <ViewOrderDetails
        order={{
          patientName: selectedOrder.patientName,
          patientAge:  selectedOrder.patientAge,
          gender:      selectedOrder.gender,
          mrn:         selectedOrder.mrn,
        }}
        onBack={() => dispatch(clearSelectedOrder())}
      />
    );
  }

  if (loading) {
    return <div className={styles.wrapper} style={{ padding: "2rem" }}>Loading...</div>;
  }

  return (
    <div className={styles.wrapper}>

      {/* ── Toolbar ── */}
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

      {/* ── Tab Pills ── */}
      <div className={styles.tabRow}>
        {(["all", "inhouse", "outsource"] as TabKey[]).map((tab) => (
          <button
            key={tab}
            className={`${styles.tabPill} ${activeTab === tab ? styles.tabPillActive : ""}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab === "all" ? `All Orders (${orders.length})` : tab === "inhouse" ? `Inhouse (${inhouseCount})` : `Outsource (${outsourceCount})`}
          </button>
        ))}
      </div>

      {/* ── Table ── */}
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
                    <button className={styles.viewBtn} onClick={() => dispatch(setSelectedOrder(row))}>
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

      {/* ── Footer / Pagination ── */}
      <div className={styles.footer}>
        <span>
          Showing {filtered.length > 0 ? (page - 1) * PAGE_SIZE + 1 : 0} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} entries
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

      {/* ── Filter Modal ── */}
      <FilterModal
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={() => setAppliedFilters(filters)}
        onClear={() => { setFilters(emptyFilters); setAppliedFilters(emptyFilters); }}
        values={filters}
        onChange={setFilters}
        doctors={doctors}
      />
    </div>
  );
}