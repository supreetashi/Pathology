import { useState, useMemo, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../store";
import { fetchOrders, selectOrders, selectOrdersError, selectOrdersLoading, selectOrdersMeta, setSelectedOrder, selectSelectedOrder, clearSelectedOrder } from "../../store/orders.slice";
import styles from "./OrdersView.module.css";
import FilterIcon from "../../assets/icons/filter.svg";
import SearchIcon from "../../assets/icons/search.png";
import ViewOrderDetails from "./ViewOrderDetails";

import type { OrderRow, OrderFilters } from "../../types/orders.types";

type TabKey = "all" | "inhouse" | "outsource";

const ORDER_STATUSES = ["", "Pending", "Partial", "Complete"];
const PATIENT_TYPES  = ["", "Walk-In", "Registered"];

const PAGE_SIZE = 10;

function isWithinDateRange(visitDate: string | null, fromDate: string, toDate: string) {
  if (!fromDate && !toDate) return true;
  if (!visitDate) return false;

  const value = new Date(visitDate);
  if (Number.isNaN(value.getTime())) return false;

  if (fromDate) {
    const from = new Date(`${fromDate}T00:00:00`);
    if (value < from) return false;
  }

  if (toDate) {
    const to = new Date(`${toDate}T23:59:59`);
    if (value > to) return false;
  }

  return true;
}

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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E17C64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            <span className={styles.billTooltipValue}>Rs. {netAmt.toLocaleString()}</span>
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

  return (
    <div className={styles.filterOverlay} onClick={onClose}>
      <div className={styles.filterModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.filterHeader}>
          <span className={styles.filterTitle}>Filters</span>
          <button className={styles.filterClose} onClick={onClose}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <line x1="1" y1="1" x2="9" y2="9" stroke="#505050" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="9" y1="1" x2="1" y2="9" stroke="#505050" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className={styles.filterBody}>
          <div className={styles.filterGrid2}>
            <div className={styles.floatBorder}>
              <span className={styles.floatLabel}>From Date</span>
              <div className={styles.floatInputRow}>
                <input className={styles.floatInput} type="date" value={values.fromDate} onChange={(e) => set("fromDate", e.target.value)} />
              </div>
            </div>
            <div className={styles.floatBorder}>
              <span className={styles.floatLabel}>To Date</span>
              <div className={styles.floatInputRow}>
                <input className={styles.floatInput} type="date" value={values.toDate} onChange={(e) => set("toDate", e.target.value)} />
              </div>
            </div>
          </div>

          <div className={styles.filterGrid2}>
            <div className={styles.floatBorder}>
              <span className={styles.floatLabel}>Doctor</span>
              <div className={styles.floatInputRow}>
                <select className={styles.floatSelect} value={values.doctor} onChange={(e) => set("doctor", e.target.value)}>
                  <option value="">All</option>
                  {doctors.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div className={styles.floatBorder}>
              <span className={styles.floatLabel}>Order Status</span>
              <div className={styles.floatInputRow}>
                <select className={styles.floatSelect} value={values.orderStatus} onChange={(e) => set("orderStatus", e.target.value)}>
                  {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s || "All"}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className={styles.floatBorder}>
            <span className={styles.floatLabel}>Patient Type</span>
            <div className={styles.floatInputRow}>
              <select className={styles.floatSelect} value={values.patientType} onChange={(e) => set("patientType", e.target.value)}>
                {PATIENT_TYPES.map((t) => <option key={t} value={t}>{t || "All"}</option>)}
              </select>
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
  const dispatch      = useDispatch<AppDispatch>();
  const orders        = useSelector(selectOrders);
  const loading       = useSelector(selectOrdersLoading);
  const error         = useSelector(selectOrdersError);
  const selectedOrder = useSelector(selectSelectedOrder);
  const meta          = useSelector(selectOrdersMeta);

  const [activeTab, setActiveTab]           = useState<TabKey>("all");
  const [search, setSearch]                 = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterOpen, setFilterOpen]         = useState(false);

  const emptyFilters: OrderFilters = { fromDate: "", toDate: "", doctor: "", orderStatus: "", patientType: "" };
  const [filters, setFilters]               = useState<OrderFilters>(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState<OrderFilters>(emptyFilters);

  const [apiPage, setApiPage] = useState(1);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    dispatch(fetchOrders({
      limit: PAGE_SIZE,
      offset: (apiPage - 1) * PAGE_SIZE,
      search: debouncedSearch,
      fromDate: appliedFilters.fromDate,
      toDate: appliedFilters.toDate,
    }));
  }, [dispatch, apiPage, debouncedSearch, appliedFilters.fromDate, appliedFilters.toDate]);

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
      const matchDate    = isWithinDateRange(o.visitDate, appliedFilters.fromDate, appliedFilters.toDate);
      const matchDoctor  = !appliedFilters.doctor      || o.doctorName  === appliedFilters.doctor;
      const matchStatus  = !appliedFilters.orderStatus || o.orderStatus === appliedFilters.orderStatus;
      const matchType    = !appliedFilters.patientType || o.patientType === appliedFilters.patientType;
      return matchSearch && matchDate && matchDoctor && matchStatus && matchType;
    });
  }, [tabFiltered, search, appliedFilters]);


  // API pagination - 10 records per page
  const totalCount     = meta?.total_count ?? orders.length;
  const totalApiPages  = Math.ceil(totalCount / PAGE_SIZE) || 1;
  const hasPrevious    = apiPage > 1;
  const hasNext        = !!meta?.next;

  // Client-side filtering on current page records
  const pageRows       = filtered; // filtered is already current page from API
  const inhouseCount   = orders.filter((o) => o.type === "inhouse").length;
  const outsourceCount = orders.filter((o) => o.type === "outsource").length;

  const handleTabChange = (tab: TabKey) => { setActiveTab(tab); setApiPage(1); };

  // Show 3 page numbers centered around current API page
  const pageNumbers = useMemo(() => {
    const nums: number[] = [];
    const start = Math.max(1, Math.min(apiPage - 1, totalApiPages - 2));
    for (let i = start; i <= Math.min(start + 2, totalApiPages); i++) nums.push(i);
    return nums;
  }, [apiPage, totalApiPages]);

  const startEntry = totalCount > 0 ? (apiPage - 1) * PAGE_SIZE + 1 : 0;
  const endEntry   = Math.min(apiPage * PAGE_SIZE, totalCount);
  const retryOrders = () => {
    dispatch(fetchOrders({
      limit: PAGE_SIZE,
      offset: (apiPage - 1) * PAGE_SIZE,
      search: debouncedSearch,
      fromDate: appliedFilters.fromDate,
      toDate: appliedFilters.toDate,
    }));
  };

  if (selectedOrder) {
    return (
      <ViewOrderDetails
        order={{
          patientName: selectedOrder.patientName,
          patientAge:  selectedOrder.patientAge,
          gender:      selectedOrder.gender,
          mrn:         selectedOrder.mrn,
          cycleId:     selectedOrder.cycleNumber,
          orderId:     selectedOrder.orderId,
        }}
        orderId={selectedOrder.orderId}
        onBack={() => dispatch(clearSelectedOrder())}
      />
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        <h2 className={styles.title}> List of Work Orders ({totalCount})</h2>
        <div className={styles.actions}>
          <div className={styles.searchWrap}>
            <img src={SearchIcon} className={styles.searchIcon} alt="" />
            <input
              className={styles.searchInput}
              placeholder="Search by Patient Name, MRN No., Bill No."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setApiPage(1);
              }}
            />
          </div>
          <button
            className={styles.filterBtn}
            onClick={() => setFilterOpen(true)}
          >
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
            {tab === "all"
              ? `All Orders (${orders.length})`
              : tab === "inhouse"
                ? `Inhouse (${inhouseCount})`
                : `Outsource (${outsourceCount})`}
          </button>
        ))}
      </div>

      {/* ── Table — only real rows, no empty fillers ── */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.head}>
            <tr>
              <th style={{ width: "13%" }}>Order Date | Time</th>
              <th style={{ width: "19%" }}>Patient</th>
              <th style={{ width: "10%" }}>Patient Type</th>
              <th style={{ width: "14%" }}>Doctor Name</th>
              <th style={{ width: "18%" }}>Bill Details</th>
              <th style={{ width: "8%", textAlign: "center" }}>Total Tests</th>
              <th style={{ width: "12%", textAlign: "right" }}>Order Status</th>
              <th style={{ width: "6%" }}></th>
            </tr>
          </thead>
          <tbody className={styles.scrollBody}>
            {loading ? (
              <tr>
                <td colSpan={8}>
                  <div className={styles.tableState}>Loading orders...</div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={8}>
                  <div className={`${styles.tableState} ${styles.tableError}`}>
                    <strong>{error}</strong>
                    <span>Could not load this page. Please retry.</span>
                    <button className={styles.retryBtn} onClick={retryOrders}>
                      Retry
                    </button>
                  </div>
                </td>
              </tr>
            ) : pageRows.length > 0 ? (
              pageRows.map((row) => (
                <tr key={row.id} className={styles.row}>
                  <td>
                    <div className={styles.dateCell}>
                      <span className={styles.dateText}>{row.date}</span>
                      <span className={styles.timeText}>{row.time}</span>
                    </div>
                  </td>

                  <td>
                    <div className={styles.patientCell}>
                      <span className={styles.patientName}>
                        {row.patientName} | {row.patientAge}
                      </span>
                      <span className={styles.patientSub}>
                        {row.mrn} | {row.gender}
                      </span>
                    </div>
                  </td>

                  <td style={{ color: "#111827", fontSize: "12px" }}>
                    {row.patientType}
                  </td>
                  <td style={{ color: "#111827", fontSize: "12px" }}>
                    {row.doctorName}
                  </td>

                  <td>
                    <BillTooltip
                      billNo={row.billNo}
                      netAmt={row.netAmt}
                      billStatus={row.billStatus}
                    />
                  </td>

                  <td
                    style={{
                      textAlign: "center",
                      color: "#111827",
                      fontSize: "12px",
                    }}
                  >
                    {row.totalTests}
                  </td>

                  <td style={{ textAlign: "right" }}>
                    <StatusBadge status={row.orderStatus} />
                  </td>

                  <td style={{ textAlign: "center" }}>
                    <button
                      className={styles.viewBtn}
                      onClick={() => dispatch(setSelectedOrder(row))}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#5A8AEA"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="3" />
                        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    textAlign: "center",
                    padding: "2rem",
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
      </div>

      {/* ── Footer / Pagination ── */}
      <div className={styles.footer}>
        <span>
          Showing {startEntry} to {endEntry} of {totalCount} entries
        </span>
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            disabled={!hasPrevious}
            onClick={() => setApiPage((p) => Math.max(1, p - 1))}
            aria-label="Previous page"
          >
            <svg width="7" height="11" viewBox="0 0 7 11" fill="none">
              <path
                d="M6 1L1 5.5L6 10"
                stroke="#505050"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* 3 page numbers */}
          {pageNumbers.map((p) => (
            <button
              key={p}
              className={`${styles.pageNumBtn} ${p === apiPage ? styles.pageNumActive : ""}`}
              onClick={() => setApiPage(p)}
            >
              {p}
            </button>
          ))}

          {/* Next — enabled only when API has next page */}
          <button
            className={styles.pageBtn}
            disabled={!hasNext}
            onClick={() => setApiPage((p) => p + 1)}
          >
            <svg width="7" height="11" viewBox="0 0 7 11" fill="none">
              <path
                d="M1 1L6 5.5L1 10"
                stroke="#505050"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Filter Modal ── */}
      <FilterModal
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={() => {
          setAppliedFilters(filters);
          setApiPage(1);
        }}
        onClear={() => {
          setFilters(emptyFilters);
          setAppliedFilters(emptyFilters);
          setApiPage(1);
        }}
        values={filters}
        onChange={setFilters}
        doctors={doctors}
      />
    </div>
  );
}
