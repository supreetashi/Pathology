import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import "../../styles/Shipment/Shipment.css";
import {
  getPendingShipments,
  getShippedShipments,
  getReceivedShipments,
  getActivityLogs,
  type PendingShipment as APIPending,
  type ShipmentShipped as APIShipped,
  type ShipmentReceived as APIReceived,
  type ActivityLog as APIActivity,
} from "../../services/shipment.api";
import filterIcon from "../../assets/icons/filter.svg";
import SearchIcon from "@mui/icons-material/Search";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import PendingTab from "./PendingTab";
import ShippedTab from "./ShippedTab";
import ReceivedTab from "./ReceivedTab";
import ActivityLogsTab from "./ActivityLogsTab";

// ─── Toast ────────────────────────────────────────────────────────────────────
type ToastType = "success" | "error";
function Toast({ message, type, onClose }: { message: string; type: ToastType; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div style={{
      position: "fixed", top: "20px", right: "20px", zIndex: 99999,
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
    }}>
      <style>{`@keyframes toastIn { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
      <div style={{
        width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
        background: type === "success" ? "#10b981" : "#ef4444",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontSize: "12px", fontWeight: 700,
      }}>
        {type === "success" ? "✓" : "✕"}
      </div>
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{
        background: "none", border: "none", color: "#9ca3af",
        cursor: "pointer", fontSize: "18px", padding: 0, lineHeight: 1,
        flexShrink: 0,
      }}>×</button>
    </div>
  );
}

const ShipmentView: React.FC = () => {
  const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [, setLoading] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const showToast = useCallback((message: string, type: ToastType = "success") => {
    setToast({ message, type });
  }, []);

  const [shipDate, setShipDate] = useState(new Date().toISOString().split("T")[0]);
  const [shipTime, setShipTime] = useState("12:30");
  const [shipTo, setShipTo] = useState("Willowbrook");
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  const [pendingDataOriginal, setPendingDataOriginal] = useState<any[]>([]);
  const [shippedDataOriginal, setShippedDataOriginal] = useState<any[]>([]);
  const [receivedDataOriginal, setReceivedDataOriginal] = useState<any[]>([]);
  const [activityLogsDataOriginal, setActivityLogsDataOriginal] = useState<any[]>([]);

  const fetchTabData = useCallback(async (tab: string) => {
    setLoading(true);
    try {
      if (tab === "pending") {
        const data = await getPendingShipments();
        setPendingDataOriginal(data.map((d: APIPending) => ({
          id: d.id,
          date: d.order_date ? new Date(d.order_date).toLocaleDateString("en-GB") : "-",
          time: d.order_date ? new Date(d.order_date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "-",
          sampleNo: d.sample_no ?? "-",
          type: d.sample_type,
          testCode: d.test_code,
          testName: d.test_name,
          serviceName: d.service_name,
          patientName: d.patient?.name ?? "-",
          age: d.patient?.age ?? "-",
          patientCode: d.patient?.patient_code ?? "-",
          gender: d.patient?.gender ?? "-",
        })));
      } else if (tab === "shipped") {
        const data = await getShippedShipments();
        setShippedDataOriginal(data.map((d: APIShipped) => ({
          id: d.id,
          shipDate: d.ship_date ? new Date(d.ship_date).toLocaleDateString("en-GB") : "-",
          time: d.ship_date ? new Date(d.ship_date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "-",
          shipmentNo: d.shipment_no,
          sampleNo: d.pending_shipment?.sample_no ?? "-",
          type: d.pending_shipment?.sample_type ?? "-",
          testCode: d.pending_shipment?.test_code ?? "-",
          testName: d.pending_shipment?.test_name ?? "-",
          serviceName: d.pending_shipment?.service_name ?? "-",
          patientName: d.pending_shipment?.patient?.name ?? "-",
          age: d.pending_shipment?.patient?.age ?? "-",
          patientCode: d.pending_shipment?.patient?.patient_code ?? "-",
          gender: d.pending_shipment?.patient?.gender ?? "-",
          shipTo: d.ship_to,
        })));
      } else if (tab === "received") {
        const data = await getReceivedShipments();
        setReceivedDataOriginal(data.map((d: APIReceived) => ({
          id: d.id,
          date: d.receive_date ? new Date(d.receive_date).toLocaleDateString("en-GB") : "-",
          time: d.receive_date ? new Date(d.receive_date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "-",
          receivedNo: d.received_no,
          sampleNo: d.shipped_shipment?.pending_shipment?.sample_no ?? "-",
          type: d.shipped_shipment?.pending_shipment?.sample_type ?? "-",
          testCode: d.shipped_shipment?.pending_shipment?.test_code ?? "-",
          testName: d.shipped_shipment?.pending_shipment?.test_name ?? "-",
          serviceName: d.shipped_shipment?.pending_shipment?.service_name ?? "-",
          patientName: d.shipped_shipment?.pending_shipment?.patient?.name ?? "-",
          age: d.shipped_shipment?.pending_shipment?.patient?.age ?? "-",
          patientCode: d.shipped_shipment?.pending_shipment?.patient?.patient_code ?? "-",
          gender: d.shipped_shipment?.pending_shipment?.patient?.gender ?? "-",
          shipTo: d.shipped_shipment?.ship_to ?? "-",
          status: d.status,
        })));
      } else if (tab === "activity") {
        const data = await getActivityLogs();
        setActivityLogsDataOriginal(data.map((d: APIActivity) => ({
          id: d.id,
          date: d.ship_date_time ? new Date(d.ship_date_time).toLocaleDateString("en-GB") : "-",
          time: d.ship_date_time ? new Date(d.ship_date_time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "-",
          shipNo: d.shipped_shipment?.shipment_no ?? "-",
          shipFrom: d.ship_from,
          shipTo: d.ship_to,
          shipBy: d.ship_by,
        })));
      }
    } catch (err: any) {
      console.error("Shipment API error:", err?.response?.data || err?.message || err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load ALL tabs on mount for correct counts
  useEffect(() => {
    fetchTabData("pending");
    fetchTabData("shipped");
    fetchTabData("received");
    fetchTabData("activity");
  }, [fetchTabData]);

  const [filters, setFilters] = useState({
    fromDate: "", toDate: "", shipTo: "", specimenType: "",
    testName: "", service: "", shipFrom: "", shipBy: "", shipmentNo: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({ ...filters });

  const currentDataArray = useMemo(() => {
    switch (activeTab) {
      case "pending":  return pendingDataOriginal;
      case "shipped":  return shippedDataOriginal;
      case "received": return receivedDataOriginal;
      case "activity": return activityLogsDataOriginal;
      default: return [];
    }
  }, [activeTab, pendingDataOriginal, shippedDataOriginal, receivedDataOriginal, activityLogsDataOriginal]);

  const filteredData = useMemo(() => {
    return currentDataArray.filter((item: any) => {
      const pName = (item.patientName || item.shipBy || "").toLowerCase();
      const sNo   = (item.sampleNo || item.shipNo || "").toLowerCase();
      const tName = (item.testName || "").toLowerCase();
      const query = searchQuery.toLowerCase();
      const matchesSearch = pName.includes(query) || sNo.includes(query) || tName.includes(query);
      if (activeTab === "activity") {
        const mSF = appliedFilters.shipFrom ? item.shipFrom?.toLowerCase().includes(appliedFilters.shipFrom.toLowerCase()) : true;
        const mST = appliedFilters.shipTo   ? item.shipTo?.toLowerCase().includes(appliedFilters.shipTo.toLowerCase())   : true;
        const mSB = appliedFilters.shipBy   ? item.shipBy?.toLowerCase().includes(appliedFilters.shipBy.toLowerCase())   : true;
        const mSN = appliedFilters.shipmentNo ? item.shipNo?.toLowerCase().includes(appliedFilters.shipmentNo.toLowerCase()) : true;
        return matchesSearch && mSF && mST && mSB && mSN;
      }
      const mSpec   = appliedFilters.specimenType ? item.type?.toLowerCase() === appliedFilters.specimenType.toLowerCase() : true;
      const mSvc    = appliedFilters.service      ? item.serviceName?.toLowerCase().includes(appliedFilters.service.toLowerCase()) : true;
      const mTest   = appliedFilters.testName     ? item.testName?.toLowerCase().includes(appliedFilters.testName.toLowerCase())   : true;
      const mShipTo = appliedFilters.shipTo       ? item.shipTo?.toLowerCase().includes(appliedFilters.shipTo.toLowerCase())       : true;
      return matchesSearch && mSpec && mSvc && mTest && mShipTo;
    });
  }, [currentDataArray, searchQuery, appliedFilters, activeTab]);

  const startIndex   = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);
  const totalPages   = Math.ceil(filteredData.length / itemsPerPage);

  const toggleRow = (id: number) => {
    setSelectedRows((prev) => prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]);
  };

  const isAllSelected =
    activeTab === "pending" && currentItems.length > 0 &&
    currentItems.every((item) => selectedRows.includes(item.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      const ids = currentItems.map((i) => i.id);
      setSelectedRows((prev) => prev.filter((id) => !ids.includes(id)));
    } else {
      setSelectedRows((prev) => {
        const next = [...prev];
        currentItems.forEach((i) => { if (!next.includes(i.id)) next.push(i.id); });
        return next;
      });
    }
  };

  const handleApplyFilters = () => { setAppliedFilters({ ...filters }); setCurrentPage(1); setShowFilterModal(false); };
  const handleClearFilters = () => {
    const empty = { fromDate: "", toDate: "", shipTo: "", specimenType: "", testName: "", service: "", shipFrom: "", shipBy: "", shipmentNo: "" };
    setFilters(empty); setAppliedFilters(empty); setCurrentPage(1); setShowFilterModal(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "pending":  return <PendingTab data={currentItems} selectedRows={selectedRows} onToggleRow={toggleRow} onToggleSelectAll={toggleSelectAll} isAllSelected={isAllSelected} />;
      case "shipped":  return <ShippedTab data={currentItems} />;
      case "received": return <ReceivedTab data={currentItems} />;
      case "activity": return <ActivityLogsTab data={currentItems} />;
      default: return null;
    }
  };

  const tabs = [
    { key: "pending",  label: `Pending (${pendingDataOriginal.length})` },
    { key: "shipped",  label: `Shipped (${shippedDataOriginal.length})` },
    { key: "received", label: `Received (${receivedDataOriginal.length})` },
    { key: "activity", label: "Activity Logs" },
  ];

  return (
    <div className="shipment-container">

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="shipment-header">
        <h2 className="page-title">Sample List ({filteredData.length})</h2>
        <div className="header-right">
          <div className="search-wrapper">
            <SearchIcon className="search-icon" />
            <input
              type="text"
              placeholder={activeTab === "activity" ? "Search by Ship No., ..." : "Search by Patient name, MRN No., Specimen No., Test..."}
              className="search-input"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <button className="filter-button" onClick={() => setShowFilterModal(true)}>
            <img src={filterIcon} alt="filter" width="18" height="18" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        {tabs.map(({ key, label }) => (
          <button key={key} className={`tab-item ${activeTab === key ? "active" : ""}`}
            onClick={() => { setActiveTab(key); setCurrentPage(1); setSearchQuery(""); }}>
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="table-container">
        {renderTabContent()}
      </div>

      {/* Footer */}
      <div className="table-footer">
        <div className="showing-entries">
          Showing {filteredData.length > 0 ? startIndex + 1 : 0} to{" "}
          {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} entries
        </div>
        <div className="pagination-controls">
          <ChevronLeftIcon className={`pagination-arrow ${currentPage === 1 ? "disabled" : ""}`}
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)} />
          {Array.from({ length: Math.min(totalPages || 1, 5) }, (_, i) => i + 1).map((num) => (
            <button key={num} className={`page-num ${currentPage === num ? "active" : ""}`}
              onClick={() => setCurrentPage(num)}>{num}</button>
          ))}
          <ChevronRightIcon className={`pagination-arrow ${currentPage === totalPages || totalPages === 0 ? "disabled" : ""}`}
            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)} />
        </div>
      </div>

      {/* Schedule Shipping button — only when rows selected */}
      {activeTab === "pending" && selectedRows.length > 0 && (
        <div className="shipping-button-container">
          <button className="schedule-shipping-btn" onClick={() => setShowShippingModal(true)}>
            Schedule Shipping
          </button>
        </div>
      )}

      {/* FILTER MODAL */}
      {showFilterModal && (
        <div className="modal-overlay" onClick={() => setShowFilterModal(false)}>
          <div className="fmodal" onClick={(e) => e.stopPropagation()}>
            <div className="fmodal-header">
              <span className="fmodal-title">Filters</span>
              <button className="fmodal-close" onClick={() => setShowFilterModal(false)}>
                <CloseIcon style={{ fontSize: 16, color: "#6b7280" }} />
              </button>
            </div>
            <div className="fmodal-grid">
              <div className="fmodal-field" onClick={() => (document.getElementById('filter-from-date') as HTMLInputElement)?.showPicker?.()}>
                <span className="fmodal-label">From Date</span>
                <div className="fmodal-input-wrap">
                  <input id="filter-from-date" className="fmodal-input fmodal-date-input" type="date"
                    value={filters.fromDate} onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })} />
                  <CalendarMonthIcon className="fmodal-icon" style={{ cursor: "pointer", pointerEvents: "auto" }}
                    onClick={() => (document.getElementById('filter-from-date') as HTMLInputElement)?.showPicker?.()} />
                </div>
              </div>
              <div className="fmodal-field" onClick={() => (document.getElementById('filter-to-date') as HTMLInputElement)?.showPicker?.()}>
                <span className="fmodal-label">To Date</span>
                <div className="fmodal-input-wrap">
                  <input id="filter-to-date" className="fmodal-input fmodal-date-input" type="date"
                    value={filters.toDate} onChange={(e) => setFilters({ ...filters, toDate: e.target.value })} />
                  <CalendarMonthIcon className="fmodal-icon" style={{ cursor: "pointer", pointerEvents: "auto" }}
                    onClick={() => (document.getElementById('filter-to-date') as HTMLInputElement)?.showPicker?.()} />
                </div>
              </div>
              {activeTab === "activity" ? (
                <>
                  <div className="fmodal-field"><span className="fmodal-label">Ship From</span><div className="fmodal-input-wrap"><select className="fmodal-select" value={filters.shipFrom} onChange={(e) => setFilters({ ...filters, shipFrom: e.target.value })}><option value="">All</option><option value="Vidai, Pune">Vidai, Pune</option></select><KeyboardArrowDownIcon className="fmodal-icon" /></div></div>
                  <div className="fmodal-field"><span className="fmodal-label">Ship To</span><div className="fmodal-input-wrap"><select className="fmodal-select" value={filters.shipTo} onChange={(e) => setFilters({ ...filters, shipTo: e.target.value })}><option value="">All</option><option value="Willowbrook">Willowbrook</option></select><KeyboardArrowDownIcon className="fmodal-icon" /></div></div>
                  <div className="fmodal-field"><span className="fmodal-label">Ship By</span><div className="fmodal-input-wrap"><select className="fmodal-select" value={filters.shipBy} onChange={(e) => setFilters({ ...filters, shipBy: e.target.value })}><option value="">All</option></select><KeyboardArrowDownIcon className="fmodal-icon" /></div></div>
                  <div className="fmodal-field"><span className="fmodal-label">Shipment No.</span><div className="fmodal-input-wrap"><input className="fmodal-input" type="text" placeholder="AH-7651" value={filters.shipmentNo} onChange={(e) => setFilters({ ...filters, shipmentNo: e.target.value })} /></div></div>
                </>
              ) : (
                <>
                  <div className="fmodal-field"><span className="fmodal-label">Ship To</span><div className="fmodal-input-wrap"><select className="fmodal-select" value={filters.shipTo} onChange={(e) => setFilters({ ...filters, shipTo: e.target.value })}><option value="">All</option><option value="Willowbrook">Willowbrook</option><option value="Rosewood">Rosewood</option></select><KeyboardArrowDownIcon className="fmodal-icon" /></div></div>
                  <div className="fmodal-field"><span className="fmodal-label">Specimen Type</span><div className="fmodal-input-wrap"><select className="fmodal-select" value={filters.specimenType} onChange={(e) => setFilters({ ...filters, specimenType: e.target.value })}><option value="">All</option><option value="Blood">Blood</option><option value="Urine">Urine</option></select><KeyboardArrowDownIcon className="fmodal-icon" /></div></div>
                  <div className="fmodal-field"><span className="fmodal-label">Test Name</span><div className="fmodal-input-wrap"><select className="fmodal-select" value={filters.testName} onChange={(e) => setFilters({ ...filters, testName: e.target.value })}><option value="">All</option><option value="CBC">CBC</option><option value="Urine Culture">Urine Culture</option></select><KeyboardArrowDownIcon className="fmodal-icon" /></div></div>
                  <div className="fmodal-field"><span className="fmodal-label">Service</span><div className="fmodal-input-wrap"><select className="fmodal-select" value={filters.service} onChange={(e) => setFilters({ ...filters, service: e.target.value })}><option value="">All</option><option value="Women Pathology 2026">Women Pathology 2026</option></select><KeyboardArrowDownIcon className="fmodal-icon" /></div></div>
                </>
              )}
            </div>
            <div className="fmodal-footer">
              <button className="fmodal-clear" onClick={handleClearFilters}>Clear All</button>
              <button className="fmodal-apply" onClick={handleApplyFilters}>Apply</button>
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULE SHIPPING MODAL */}
      {showShippingModal && (
        <div className="modal-overlay" onClick={() => setShowShippingModal(false)}>
          <div className="modal-content shipping-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Schedule Shipping</h3>
              <CloseIcon className="close-icon-btn" onClick={() => setShowShippingModal(false)} />
            </div>
            <div className="shipping-form-grid">
              <div className="ship-field">
                <span className="ship-field-label">Ship Date</span>
                <div className="ship-field-inner">
                  <input ref={dateInputRef} className="ship-field-input ship-date-input" type="date"
                    value={shipDate} onChange={(e) => setShipDate(e.target.value)} />
                  <CalendarMonthIcon className="ship-picker-icon" onClick={() => dateInputRef.current?.showPicker()} />
                </div>
              </div>
              <div className="ship-field">
                <span className="ship-field-label">Ship Time</span>
                <div className="ship-field-inner">
                  <input ref={timeInputRef} className="ship-field-input ship-time-input" type="time"
                    value={shipTime} onChange={(e) => setShipTime(e.target.value)} />
                  <AccessTimeIcon className="ship-picker-icon" onClick={() => timeInputRef.current?.showPicker()} />
                </div>
              </div>
              <div className="ship-field disabled">
                <span className="ship-field-label">Dispatched By</span>
                <div className="ship-field-inner">
                  <input className="ship-field-input" type="text" value="Fertivue, Pune" readOnly />
                </div>
              </div>
              <div className="ship-field">
                <span className="ship-field-label">Ship To</span>
                <div className="ship-field-inner">
                  <select className="ship-field-select" value={shipTo} onChange={(e) => setShipTo(e.target.value)}>
                    <option value="Willowbrook">Willowbrook</option>
                    <option value="Rosewood">Rosewood</option>
                    <option value="Redwood">Redwood</option>
                    <option value="Silverlake">Silverlake</option>
                  </select>
                  <KeyboardArrowDownIcon className="ship-picker-icon" style={{ pointerEvents: "none" }} />
                </div>
              </div>
            </div>
            <div className="shipping-details-section">
              <h4>Shipping Details ({selectedRows.length})</h4>
              <div className="mini-table-container">
                <table className="mini-table">
                  <thead>
                    <tr><th>Date | Time</th><th>Specimen No. | Type</th><th>Test Code | Name</th><th>Patient</th></tr>
                  </thead>
                  <tbody>
                    {pendingDataOriginal.filter((item) => selectedRows.includes(item.id)).map((item) => (
                      <tr key={item.id}>
                        <td><div className="mini-cell-top">{item.date}</div><div className="mini-cell-bottom">{item.time}</div></td>
                        <td><div className="mini-cell-top">{item.sampleNo}</div><div className="mini-cell-bottom">{item.type}</div></td>
                        <td><div className="mini-cell-top">{item.testCode}</div><div className="mini-cell-bottom">{item.testName}</div></td>
                        <td><div className="mini-cell-top">{item.patientName} | {item.age}</div><div className="mini-cell-bottom">{item.patientCode} | {item.gender}</div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer shipping-footer">
              <button className="cancel-btn" onClick={() => setShowShippingModal(false)}>Cancel</button>
              <button className="save-btn" onClick={async () => {
                const shippedIds = [...selectedRows];
                try {
                  // Step 1: POST schedule-shipping for each pending row
                  for (const pendingId of shippedIds) {
                    const res1 = await fetch(`${BASE}/schedule-shipping/`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        pending_id: pendingId,
                        ship_date: shipDate,
                        ship_time: shipTime + ":00",
                        dispatched_by: "Receptionist",
                        ship_to: shipTo,
                      }),
                    });
                    if (!res1.ok) {
                      const e = await res1.json().catch(() => ({}));
                      throw new Error(`schedule-shipping failed: ${JSON.stringify(e)}`);
                    }
                  }

                  // Step 2: POST move-to-shipped for each pending row
                  for (const pendingId of shippedIds) {
                    const res2 = await fetch(`${BASE}/move-to-shipped/`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        pending_id: pendingId,
                        ship_to: shipTo,
                        ship_by: "Receptionist",
                      }),
                    });
                    if (!res2.ok) {
                      const e = await res2.json().catch(() => ({}));
                      console.warn(`move-to-shipped failed for ${pendingId}:`, e);
                    }
                  }

                  // ✅ Remove shipped items from pending list immediately (no wait for API)
                  setPendingDataOriginal(prev => prev.filter(p => !shippedIds.includes(p.id)));

                  setSelectedRows([]);
                  setShowShippingModal(false);

                  // Refresh ALL tabs to update counts correctly
                  await fetchTabData("pending");
                  await fetchTabData("shipped");
                  await fetchTabData("received");
                  await fetchTabData("activity");

                  showToast(`${shippedIds.length} sample(s) shipped successfully`, "success");
                } catch (err) {
                  console.error("Schedule shipping failed:", err);
                  showToast("Failed to schedule shipping: " + String(err), "error");
                }
              }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipmentView;