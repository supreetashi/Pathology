import { useState, useRef } from "react";
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
};

type ProcessField   = { label: string; val: string };
type ProcessSection = { title: string; fields: ProcessField[] };

type CheckCircleProps    = { checked: boolean; onClick: () => void };
type FilterDropdownProps = { onClose: () => void; anchorRef: RefObject<HTMLButtonElement | null> };
type ProcessModalProps   = { onClose: () => void };
type AgencyModalProps    = { onClose: () => void };
type ScheduleModalProps  = { rows: TestRow[]; onClose: () => void; onCollect: () => void };

type ViewOrderDetailsProps = {
  order?: PatientOrder | null;
  onBack?: () => void;
};

const INHOUSE_TESTS: TestRow[] = [
  { id: 1, source: "inhouse", date: "04/02/2024", time: "10:30 AM", code: "2786/B34", name: "Urine Culture",   service: "Women Pathology 2026", specimenNo: "-",        type: "Urine",  collectorItem: "Urine Container",                      status: "Pending",              checked: true  },
  { id: 2, source: "inhouse", date: "04/02/2024", time: "10:30 AM", code: "2786/B34", name: "Urine Culture",   service: "Women Pathology 2026", specimenNo: "-",        type: "Blood",  collectorItem: "Yellow Top – Serum Separator Tube",    status: "Recollection Pending", checked: true  },
  { id: 3, source: "inhouse", date: "04/02/2024", time: "10:30 AM", code: "2786/B34", name: "Biopsy",          service: "Women Pathology 2026", specimenNo: "2786/B34", type: "Blood",  collectorItem: "Purple Top – K2 – EDTA",               status: "Collected",            checked: false },
  { id: 4, source: "inhouse", date: "04/02/2024", time: "10:30 AM", code: "2786/B34", name: "Drug Testing",    service: "Women Pathology 2026", specimenNo: "2786/B34", type: "Blood",  collectorItem: "Yellow Top – Serum Separator Tube",    status: "Shipped",              checked: false },
  { id: 5, source: "inhouse", date: "04/02/2024", time: "10:30 AM", code: "2785/B34", name: "Dipstick Test",   service: "Women Pathology 2026", specimenNo: "2786/B34", type: "Blood",  collectorItem: "Yellow Top – Serum Separator Tube",    status: "Accepted",             checked: false },
  { id: 6, source: "inhouse", date: "04/02/2024", time: "10:30 AM", code: "2786/B34", name: "CBC",             service: "Women Pathology 2026", specimenNo: "2786/B34", type: "Blood",  collectorItem: "Purple Top – K2 – EDTA",               status: "Completed",            checked: false },
  { id: 7, source: "inhouse", date: "04/02/2024", time: "10:30 AM", code: "2786/B34", name: "Genetic Testing", service: "Women Pathology 2026", specimenNo: "2786/B34", type: "Blood",  collectorItem: "Purple Top – K2 – EDTA",               status: "Rejected",             checked: false },
];

const OUTSOURCE_TESTS: TestRow[] = [
  { id: 101, source: "outsource", date: "04/02/2024", time: "10:30 AM", code: "2786/B34", name: "Urine Culture",   service: "Women Pathology 2026", specimenNo: "2786/B34", type: "Urine", collectorItem: "Urine Container",                   agency: "Progenesis, Delhi", status: "Pending",   checked: true  },
  { id: 102, source: "outsource", date: "04/02/2024", time: "10:30 AM", code: "2786/B34", name: "Biopsy",          service: "Women Pathology 2026", specimenNo: "2786/B34", type: "Blood", collectorItem: "Purple Top – K2 – EDTA",            agency: "Akiara Lab, Pune",  status: "Pending",   checked: false },
  { id: 103, source: "outsource", date: "04/02/2024", time: "10:30 AM", code: "2786/B34", name: "Drug Testing",    service: "Women Pathology 2026", specimenNo: "2786/B34", type: "Blood", collectorItem: "Yellow Top – Serum Separator Tube", agency: "Akiara Lab, Pune",  status: "Collected", checked: false },
  { id: 104, source: "outsource", date: "04/02/2024", time: "10:30 AM", code: "2786/B34", name: "Drug Testing",    service: "Women Pathology 2026", specimenNo: "2786/B34", type: "Blood", collectorItem: "Yellow Top – Serum Separator Tube", agency: "Progenesis, Delhi", status: "Collected", checked: false },
  { id: 105, source: "outsource", date: "04/02/2024", time: "10:30 AM", code: "2786/B34", name: "Genetic Testing", service: "Women Pathology 2026", specimenNo: "2786/B34", type: "Blood", collectorItem: "Purple Top – K2 – EDTA",            agency: "Progenesis, Delhi", status: "Completed", checked: false },
  { id: 106, source: "outsource", date: "04/02/2024", time: "10:30 AM", code: "2786/B34", name: "CBC",             service: "Women Pathology 2026", specimenNo: "2786/B34", type: "Blood", collectorItem: "Purple Top – K2 – EDTA",            agency: "Akiara Lab, Pune",  status: "Completed", checked: false },
];

const PROCESS_SECTIONS: ProcessSection[] = [
  { title: "Sample Collection",   fields: [{ label: "Collection Date", val: "13/03/2026" }, { label: "Collection Time", val: "12:30" }, { label: "Collected By", val: "Alex Carrey" }, { label: "Recollection 1 Date", val: "13/03/2026" }, { label: "Recollection 1 Time", val: "12:30" }, { label: "Collected By", val: "Alex Carrey" }] },
  { title: "Sample Ship",         fields: [{ label: "Ship Date", val: "13/03/2026" }, { label: "Ship Time", val: "12:30" }, { label: "Ship By", val: "John Wick" }, { label: "Ship To", val: "Willowbrook" }] },
  { title: "Sample Receive",      fields: [{ label: "Receive Date", val: "13/03/2026" }, { label: "Receive Time", val: "12:30" }, { label: "Received By", val: "Emilia Clarke" }, { label: "Remark", val: "Lorem Ipsum Dolor" }] },
  { title: "Result Entry",        fields: [{ label: "Authorization Date", val: "13/03/2026" }, { label: "Authorization Time", val: "12:30" }, { label: "Done By", val: "Jennifer Lawrence" }] },
  { title: "Authorization",       fields: [{ label: "Authorization Date", val: "13/03/2026" }, { label: "Authorization Time", val: "12:30" }, { label: "Authorization By", val: "Emma Watson" }] },
  { title: "Result Value Edit History Details", fields: [{ label: "Receive Date", val: "13/03/2026" }, { label: "User Name", val: "Emily Carter" }, { label: "Reason", val: "Sample reason" }] },
];

const BADGE_CLASS: Record<TestStatus, string> = {
  Pending:                styles.badgePending,
  "Recollection Pending": styles.badgeRecollectionPending,
  Collected:              styles.badgeCollected,
  Shipped:                styles.badgeShipped,
  Accepted:               styles.badgeAccepted,
  Completed:              styles.badgeCompleted,
  Rejected:               styles.badgeRejected,
};

const HAS_INFO:   TestStatus[] = ["Collected", "Shipped", "Accepted", "Completed", "Rejected"];
const HAS_RESULT: TestStatus[] = ["Completed", "Collected"];

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconBack() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#505050" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>;
}
function IconSearch() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9e9e9e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
}
function IconFilter() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#505050" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>;
}
function IconInfo() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9e9e9e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>;
}
function IconEdit() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5A8AEA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
}
function IconPrint() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5A8AEA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>;
}
function IconDownload() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5A8AEA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>;
}
function IconClose() {
  return <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><line x1="1" y1="1" x2="11" y2="11" stroke="#505050" strokeWidth="2" strokeLinecap="round" /><line x1="11" y1="1" x2="1" y2="11" stroke="#505050" strokeWidth="2" strokeLinecap="round" /></svg>;
}
function IconCalendar() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9e9e9e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
}
function IconClock() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9e9e9e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
}

// FIX 1: Checkbox is SQUARE (rounded square) not circle, matches Figma
function CheckCircle({ checked, onClick }: CheckCircleProps) {
  return checked ? (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ cursor: "pointer", flexShrink: 0 }} onClick={onClick}>
      <rect x="0.5" y="0.5" width="17" height="17" rx="4" fill="#4CAF50" stroke="#4CAF50" />
      <polyline points="4 9 7.5 12.5 14 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ cursor: "pointer", flexShrink: 0 }} onClick={onClick}>
      <rect x="0.5" y="0.5" width="17" height="17" rx="4" fill="#fff" stroke="#d1d5db" strokeWidth="1.5" />
    </svg>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function FilterDropdown({ onClose }: FilterDropdownProps) {
  const [fromDate, setFromDate]     = useState("13/03/2026");
  const [toDate, setToDate]         = useState("14/03/2026");
  const [testStatus, setTestStatus] = useState<TestStatus>("Pending");
  const [service, setService]       = useState("Women Patholog...");

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.filterModal} onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
        <div className={styles.filterDropdownHeader}>
          <span className={styles.filterDropdownTitle}>Filters</span>
          <button className={styles.panelClose} onClick={onClose} type="button"><IconClose /></button>
        </div>
        <div className={styles.filterBody}>
          <div className={styles.filterDateRow}>
            <div className={styles.filterField}>
              <span className={styles.filterLabel}>From Date</span>
              <div className={styles.dateInputWrap}>
                <input className={styles.filterInput} value={fromDate} onChange={(e: ChangeEvent<HTMLInputElement>) => setFromDate(e.target.value)} placeholder="DD/MM/YYYY" />
                <IconCalendar />
              </div>
            </div>
            <div className={styles.filterField}>
              <span className={styles.filterLabel}>To Date</span>
              <div className={styles.dateInputWrap}>
                <input className={styles.filterInput} value={toDate} onChange={(e: ChangeEvent<HTMLInputElement>) => setToDate(e.target.value)} placeholder="DD/MM/YYYY" />
                <IconCalendar />
              </div>
            </div>
          </div>
          <div className={styles.filterField}>
            <span className={styles.filterLabel}>Test Status</span>
            <select className={styles.filterSelect} value={testStatus} onChange={(e: ChangeEvent<HTMLSelectElement>) => setTestStatus(e.target.value as TestStatus)}>
              <option>Pending</option><option>Collected</option><option>Completed</option><option>Rejected</option>
            </select>
          </div>
          <div className={styles.filterField}>
            <span className={styles.filterLabel}>Service</span>
            <select className={styles.filterSelect} value={service} onChange={(e: ChangeEvent<HTMLSelectElement>) => setService(e.target.value)}>
              <option>Women Patholog...</option><option>Men Pathology 2026</option>
            </select>
          </div>
        </div>
        <div className={styles.filterFooter}>
          <button className={styles.clearBtn} onClick={onClose} type="button">Clear All</button>
          <button className={styles.applyBtn} onClick={onClose} type="button">Apply</button>
        </div>
      </div>
    </div>
  );
}

function ProcessModal({ onClose }: ProcessModalProps) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.processModal} onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>Test Process Details</span>
          <button className={styles.panelClose} onClick={onClose} type="button"><IconClose /></button>
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
      <div className={styles.agencyModal} onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>Change Agency</span>
          <button className={styles.panelClose} onClick={onClose} type="button"><IconClose /></button>
        </div>
        <div className={styles.agencyBody}>
          <div className={styles.filterField}>
            <span className={styles.filterLabel}>Select Agency</span>
            <select className={styles.filterSelect} value={agency} onChange={(e: ChangeEvent<HTMLSelectElement>) => setAgency(e.target.value)}>
              <option>Progenesis, Delhi</option><option>Akiara Lab, Pune</option>
            </select>
          </div>
          <div className={styles.filterField}>
            <span className={styles.filterLabel}>Reason Of Change</span>
            <textarea className={styles.agencyTextarea} value={reason} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)} />
          </div>
        </div>
        <div className={styles.filterFooter}>
          <button className={styles.clearBtn} onClick={onClose} type="button">Cancel</button>
          <button className={styles.applyBtn} onClick={onClose} type="button">Save</button>
        </div>
      </div>
    </div>
  );
}

function ScheduleModal({ rows, onClose, onCollect }: ScheduleModalProps) {
  const [collectionDate, setCollectionDate] = useState("13/03/2026");
  const [collectionTime, setCollectionTime] = useState("12:30");
  const [barcodesPrinted, setBarcodesPrinted] = useState(false);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>Schedule Collection</span>
          <button className={styles.panelClose} onClick={onClose} type="button"><IconClose /></button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.modalDateRow}>
            <div className={styles.modalField}>
              <span className={styles.modalLabel}>Collection Date</span>
              <div className={styles.dateInputWrap}>
                <input className={styles.filterInput} value={collectionDate} onChange={(e: ChangeEvent<HTMLInputElement>) => setCollectionDate(e.target.value)} placeholder="DD/MM/YYYY" />
                <IconCalendar />
              </div>
            </div>
            <div className={styles.modalField}>
              <span className={styles.modalLabel}>Collection Time</span>
              <div className={styles.dateInputWrap}>
                <input className={styles.filterInput} value={collectionTime} onChange={(e: ChangeEvent<HTMLInputElement>) => setCollectionTime(e.target.value)} placeholder="HH:MM" />
                <IconClock />
              </div>
            </div>
          </div>
          <div>
            <p className={styles.collectionDetailsTitle}>Collection Details ({rows.length})</p>
            <table className={styles.collectionTable}>
              <thead>
                <tr><th>Specimen No. | Type</th><th>Service Name</th><th>Test Code | Name</th><th>Collector Item</th></tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td><div style={{ display: "flex", flexDirection: "column" }}><span style={{ fontWeight: 600, fontSize: "0.88em" }}>{row.specimenNo}</span><span style={{ color: "#9e9e9e", fontSize: "0.78em" }}>{row.type}</span></div></td>
                    <td>{row.service}</td>
                    <td><div style={{ display: "flex", flexDirection: "column" }}><span style={{ fontWeight: 600, fontSize: "0.88em" }}>{row.code}</span><span style={{ fontSize: "0.85em" }}>{row.name}</span></div></td>
                    <td>{row.collectorItem}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.modalCancelBtn} onClick={onClose} type="button">Cancel</button>
          <button className={styles.modalPrintBtn} onClick={() => setBarcodesPrinted(true)} type="button">Print Barcode</button>
          <button className={`${styles.modalCollectBtn} ${!barcodesPrinted ? styles.modalCollectBtnDisabled : ""}`} disabled={!barcodesPrinted} onClick={barcodesPrinted ? onCollect : undefined} type="button">Collect</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ViewOrderDetails({ order, onBack }: ViewOrderDetailsProps) {
  const [activeTab, setActiveTab]     = useState<ActiveTab>("inhouse");
  const [search, setSearch]           = useState("");
  const [checkedRows, setCheckedRows] = useState<Set<number>>(
    new Set(INHOUSE_TESTS.filter((t) => t.checked).map((t) => t.id))
  );
  const [filterOpen, setFilterOpen]     = useState(false);
  const [processOpen, setProcessOpen]   = useState(false);
  const [agencyOpen, setAgencyOpen]     = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const filterBtnRef = useRef<HTMLButtonElement | null>(null);

  const isOutsource    = activeTab === "outsource";
  const tests: TestRow[] = isOutsource ? OUTSOURCE_TESTS : INHOUSE_TESTS;
  const totalInhouse   = INHOUSE_TESTS.length;
  const totalOutsource = OUTSOURCE_TESTS.length;

  const toggleRow = (id: number) => {
    setCheckedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const checkedTests  = tests.filter((t) => checkedRows.has(t.id));
  const filteredTests = tests.filter((t) =>
    !search ||
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.code.toLowerCase().includes(search.toLowerCase())
  );

  const patient: PatientOrder = order ?? {
    patientName: "Emilia Williamson",
    patientAge: 27,
    gender: "Female",
    mrn: "PCC - 4912",
    cycleId: "PCC/727/3",
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {/* FIX 3: Card header with back arrow and title */}
        <div className={styles.cardHeader}>
          <button className={styles.backBtn} onClick={onBack} type="button"><IconBack /></button>
          <h2 className={styles.cardTitle}>View Order Details</h2>
        </div>

        {/* FIX 3: Patient bar — label small grey, value dark bold */}
        <div className={styles.patientBar}>
          <div className={styles.avatar}>{patient.patientName?.charAt(0) ?? "E"}</div>
          <div className={styles.patientFields}>
            {[
              { label: "Patient Name",          val: patient.patientName },
              { label: "Age",                   val: patient.patientAge ? `${patient.patientAge} Years` : "27 Years" },
              { label: "Sex Assigned At Birth",  val: patient.gender ?? "Female" },
              { label: "MRN",                   val: patient.mrn ?? "PCC - 4912" },
              { label: "Cycle ID",              val: patient.cycleId ?? "PCC/727/3" },
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
          <h3 className={styles.listTitle}>List of Tests <span style={{ fontWeight: 400, color: "#6b7280", fontSize: "11px" }}>({totalInhouse + totalOutsource})</span></h3>
          <div className={styles.listActions}>
            <div className={styles.searchWrap}>
              <span className={styles.searchIcon}><IconSearch /></span>
              <input
                className={styles.searchInput}
                placeholder="Search by Test Name / Code"
                value={search}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
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
              {filterOpen && <FilterDropdown onClose={() => setFilterOpen(false)} anchorRef={filterBtnRef} />}
            </div>
          </div>
        </div>

        <div className={styles.tabRow}>
          <button className={`${styles.tabPill} ${activeTab === "inhouse"   ? styles.tabPillActive : ""}`} onClick={() => setActiveTab("inhouse")}   type="button">Inhouse ({totalInhouse})</button>
          <button className={`${styles.tabPill} ${activeTab === "outsource" ? styles.tabPillActive : ""}`} onClick={() => setActiveTab("outsource")} type="button">Outsource ({totalOutsource})</button>
        </div>

        {/* FIX 4 & 5: Table with proper column spacing, status centered, result icons blue */}
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead className={styles.head}>
              <tr>
                <th style={{ width: "3%"  }}></th>
                <th style={{ width: "12%" }}>Date | Time</th>
                <th style={{ width: isOutsource ? "13%" : "16%" }}>Test Code | Name</th>
                <th style={{ width: "16%" }}>Service Name</th>
                <th style={{ width: "13%" }}>Specimen No. | Type</th>
                <th style={{ width: isOutsource ? "14%" : "19%" }}>Collector Item</th>
                {isOutsource && <th style={{ width: "10%" }}>Agency</th>}
                <th style={{ width: "14%", textAlign: "center" }}>Test Status</th>
                <th style={{ width: "9%",  textAlign: "right", paddingRight: "16px" }}>Result</th>
              </tr>
            </thead>
            <tbody>
              {filteredTests.map((row) => (
                <tr key={row.id} className={styles.row}>

                  {/* FIX 1: Square checkbox */}
                  <td style={{ verticalAlign: "middle" }}>
                    <CheckCircle checked={checkedRows.has(row.id)} onClick={() => toggleRow(row.id)} />
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
                      <span className={styles.codeSub}>{row.name}</span>
                    </div>
                  </td>

                  <td style={{ color: "#111827" }}>{row.service}</td>

                  <td>
                    <div className={styles.specimenCell}>
                      <span className={styles.specimenPrimary}>{row.specimenNo}</span>
                      <span className={styles.specimenSub}>{row.type}</span>
                    </div>
                  </td>

                  <td style={{ color: "#111827" }}>{row.collectorItem}</td>

                  {isOutsource && "agency" in row && (
                    <td>
                      <div className={styles.agencyCell}>
                        <span style={{ color: "#111827" }}>{row.agency}</span>
                        <button className={styles.actionBtn} onClick={() => setAgencyOpen(true)} type="button"><IconEdit /></button>
                      </div>
                    </td>
                  )}

                  {/* FIX 4: Status centered */}
                  <td style={{ textAlign: "center" }}>
                    <div className={styles.statusCell}>
                      <span className={`${styles.badge} ${BADGE_CLASS[row.status]}`}>{row.status}</span>
                      {HAS_INFO.includes(row.status) && (
                        <button className={styles.actionBtn} onClick={() => setProcessOpen(true)} type="button">
                          <IconInfo />
                        </button>
                      )}
                    </div>
                  </td>

                  {/* FIX 5: Result — blue icons right-aligned like Figma */}
                  <td style={{ textAlign: "right", paddingRight: "8px" }}>
                    <div className={styles.resultCell} style={{ justifyContent: "flex-end" }}>
                      {HAS_RESULT.includes(row.status) ? (
                        <>
                          <button className={styles.actionBtn} type="button"><IconDownload /></button>
                          <button className={styles.actionBtn} type="button"><IconPrint /></button>
                        </>
                      ) : (
                        <span className={styles.dash}>—</span>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.cardFooter}>
          <button className={styles.scheduleBtn} onClick={() => setScheduleOpen(true)} type="button">
            Schedule Collection
          </button>
        </div>
      </div>

      {agencyOpen   && <AgencyModal  onClose={() => setAgencyOpen(false)} />}
      {processOpen  && <ProcessModal onClose={() => setProcessOpen(false)} />}
      {scheduleOpen && (
        <ScheduleModal
          rows={checkedTests.length > 0 ? checkedTests : tests.slice(0, 3)}
          onClose={() => setScheduleOpen(false)}
          onCollect={() => { setScheduleOpen(false); setProcessOpen(true); }}
        />
      )}
    </div>
  );
}