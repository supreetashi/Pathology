import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import "../../styles/Shipment/Shipment.css";
import {
  getPendingShipments,
  getShippedShipments,
  getReceivedShipments,
  getActivityLogs,
  scheduleShipping,
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

const ShipmentView: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [, setLoading] = useState(false);

  /* Shipping modal fields */
  const [shipDate, setShipDate] = useState(new Date().toISOString().split("T")[0]);
  const [shipTime, setShipTime] = useState("12:30");
  const [shipTo, setShipTo] = useState("Willowbrook");
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  /* API data state */
  const [pendingDataOriginal, setPendingDataOriginal] = useState<any[]>([]);
  const [shippedDataOriginal, setShippedDataOriginal] = useState<any[]>([]);
  const [receivedDataOriginal, setReceivedDataOriginal] = useState<any[]>([]);
  const [activityLogsDataOriginal, setActivityLogsDataOriginal] = useState<any[]>([]);

  /* Fetch data based on active tab */
  const fetchTabData = useCallback(async (tab: string) => {
    setLoading(true);
    try {
      if (tab === "pending") {
        const data = await getPendingShipments();
        setPendingDataOriginal(data.map((d: APIPending) => ({
          id: d.id,
          date: d.order_date ? new Date(d.order_date).toLocaleDateString("en-GB").replace(/\//g, "/") : "-",
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
          shipDate: d.ship_date ? new Date(d.ship_date).toLocaleDateString("en-GB").replace(/\//g, "/") : "-",
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
          date: d.receive_date ? new Date(d.receive_date).toLocaleDateString("en-GB").replace(/\//g, "/") : "-",
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
          date: d.ship_date_time ? new Date(d.ship_date_time).toLocaleDateString("en-GB").replace(/\//g, "/") : "-",
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

  /* Fetch on mount and tab change */
  useEffect(() => {
    fetchTabData(activeTab);
  }, [activeTab, fetchTabData]);

  const [filters, setFilters] = useState({
    fromDate: "", toDate: "", shipTo: "", specimenType: "",
    testName: "", service: "", shipFrom: "", shipBy: "", shipmentNo: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({ ...filters });

  const currentDataArray = useMemo(() => {
    switch (activeTab) {
      case "pending": return pendingDataOriginal;
      case "shipped": return shippedDataOriginal;
      case "received": return receivedDataOriginal;
      case "activity": return activityLogsDataOriginal;
      default: return [];
    }
  }, [activeTab, pendingDataOriginal, shippedDataOriginal, receivedDataOriginal, activityLogsDataOriginal]);

  const filteredData = useMemo(() => {
    return currentDataArray.filter((item: any) => {
      const pName = (item.patientName || item.shipBy || "").toLowerCase();
      const sNo = (item.sampleNo || item.shipNo || "").toLowerCase();
      const tName = (item.testName || "").toLowerCase();
      const query = searchQuery.toLowerCase();
      const matchesSearch = pName.includes(query) || sNo.includes(query) || tName.includes(query);
      if (activeTab === "activity") {
        const mSF = appliedFilters.shipFrom ? item.shipFrom.toLowerCase().includes(appliedFilters.shipFrom.toLowerCase()) : true;
        const mST = appliedFilters.shipTo ? item.shipTo.toLowerCase().includes(appliedFilters.shipTo.toLowerCase()) : true;
        const mSB = appliedFilters.shipBy ? item.shipBy.toLowerCase().includes(appliedFilters.shipBy.toLowerCase()) : true;
        const mSN = appliedFilters.shipmentNo ? item.shipNo.toLowerCase().includes(appliedFilters.shipmentNo.toLowerCase()) : true;
        return matchesSearch && mSF && mST && mSB && mSN;
      }
      const mSpec = appliedFilters.specimenType ? item.type?.toLowerCase() === appliedFilters.specimenType.toLowerCase() : true;
      const mSvc = appliedFilters.service ? item.serviceName?.toLowerCase().includes(appliedFilters.service.toLowerCase()) : true;
      const mTest = appliedFilters.testName ? item.testName?.toLowerCase().includes(appliedFilters.testName.toLowerCase()) : true;
      const mShipTo = appliedFilters.shipTo ? item.shipTo?.toLowerCase().includes(appliedFilters.shipTo.toLowerCase()) : true;
      return matchesSearch && mSpec && mSvc && mTest && mShipTo;
    });
  }, [currentDataArray, searchQuery, appliedFilters, activeTab]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
      case "pending": return <PendingTab data={currentItems} selectedRows={selectedRows} onToggleRow={toggleRow} onToggleSelectAll={toggleSelectAll} isAllSelected={isAllSelected} />;
      case "shipped": return <ShippedTab data={currentItems} />;
      case "received": return <ReceivedTab data={currentItems} />;
      case "activity": return <ActivityLogsTab data={currentItems} />;
      default: return null;
    }
  };

  const tabs = [
    { key: "pending", label: `Pending (${pendingDataOriginal.length})` },
    { key: "shipped", label: `Shipped (${shippedDataOriginal.length})` },
    { key: "received", label: `Received (${receivedDataOriginal.length})` },
    { key: "activity", label: "Activity Logs" },
  ];

  return (
    <div className="shipment-container">

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

          {/* ✅ FIXED: Same filter icon as Orders page — img tag pointing to shared filter.svg asset */}
          <button className="filter-button" onClick={() => setShowFilterModal(true)}>
            <img
              src={filterIcon}
              alt="filter"
              width="18"
              height="18"
            />
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
        <div className="table-footer">
          <div className="showing-entries">
            Showing {filteredData.length > 0 ? startIndex + 1 : 0} to{" "}
            {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} entries
          </div>
          <div className="pagination-controls">
            <ChevronLeftIcon className={`pagination-arrow ${currentPage === 1 ? "disabled" : ""}`}
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)} />
            {Array.from({ length: Math.min(totalPages || 1, 3) }, (_, i) => i + 1).map((num) => (
              <button key={num} className={`page-num ${currentPage === num ? "active" : ""}`}
                onClick={() => setCurrentPage(num)}>{num}</button>
            ))}
            <ChevronRightIcon className={`pagination-arrow ${currentPage === totalPages || totalPages === 0 ? "disabled" : ""}`}
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)} />
          </div>
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
            {/* Header */}
            <div className="fmodal-header">
              <span className="fmodal-title">Filters</span>
              <button className="fmodal-close" onClick={() => setShowFilterModal(false)}>
                <CloseIcon style={{ fontSize: 16, color: "#6b7280" }} />
              </button>
            </div>

            {/* Fields grid */}
            <div className="fmodal-grid">
              {/* From Date */}
              <div className="fmodal-field" onClick={() => (document.getElementById('filter-from-date') as HTMLInputElement)?.showPicker?.()}>
                <span className="fmodal-label">From Date</span>
                <div className="fmodal-input-wrap">
                  <input
                    id="filter-from-date"
                    className="fmodal-input fmodal-date-input"
                    type="date"
                    value={filters.fromDate || "2026-03-13"}
                    onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                  />
                  <CalendarMonthIcon className="fmodal-icon" style={{ cursor: "pointer", pointerEvents: "auto" }}
                    onClick={() => (document.getElementById('filter-from-date') as HTMLInputElement)?.showPicker?.()}
                  />
                </div>
              </div>

              {/* To Date */}
              <div className="fmodal-field" onClick={() => (document.getElementById('filter-to-date') as HTMLInputElement)?.showPicker?.()}>
                <span className="fmodal-label">To Date</span>
                <div className="fmodal-input-wrap">
                  <input
                    id="filter-to-date"
                    className="fmodal-input fmodal-date-input"
                    type="date"
                    value={filters.toDate || "2026-03-14"}
                    onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                  />
                  <CalendarMonthIcon className="fmodal-icon" style={{ cursor: "pointer", pointerEvents: "auto" }}
                    onClick={() => (document.getElementById('filter-to-date') as HTMLInputElement)?.showPicker?.()}
                  />
                </div>
              </div>

              {activeTab === "activity" ? (
                <>
                  <div className="fmodal-field">
                    <span className="fmodal-label">Ship From</span>
                    <div className="fmodal-input-wrap">
                      <select className="fmodal-select" value={filters.shipFrom} onChange={(e) => setFilters({ ...filters, shipFrom: e.target.value })}>
                        <option value="">All</option>
                        <option value="Vidai, Pune">Vidai, Pune</option>
                        <option value="Fertivue, Pune">Fertivue, Pune</option>
                      </select>
                      <KeyboardArrowDownIcon className="fmodal-icon" />
                    </div>
                  </div>
                  <div className="fmodal-field">
                    <span className="fmodal-label">Ship To</span>
                    <div className="fmodal-input-wrap">
                      <select className="fmodal-select" value={filters.shipTo} onChange={(e) => setFilters({ ...filters, shipTo: e.target.value })}>
                        <option value="">All</option>
                        <option value="Fertivue, Pune">Fertivue, Pune</option>
                        <option value="Vidai, Pune">Vidai, Pune</option>
                      </select>
                      <KeyboardArrowDownIcon className="fmodal-icon" />
                    </div>
                  </div>
                  <div className="fmodal-field">
                    <span className="fmodal-label">Ship By</span>
                    <div className="fmodal-input-wrap">
                      <select className="fmodal-select" value={filters.shipBy} onChange={(e) => setFilters({ ...filters, shipBy: e.target.value })}>
                        <option value="">All</option>
                        <option value="Jordan Blake">Jordan Blake</option>
                        <option value="Riley Brooks">Riley Brooks</option>
                      </select>
                      <KeyboardArrowDownIcon className="fmodal-icon" />
                    </div>
                  </div>
                  <div className="fmodal-field">
                    <span className="fmodal-label">Shipment No.</span>
                    <div className="fmodal-input-wrap">
                      <input className="fmodal-input" type="text" placeholder="AH-7651" value={filters.shipmentNo} onChange={(e) => setFilters({ ...filters, shipmentNo: e.target.value })} />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="fmodal-field">
                    <span className="fmodal-label">Ship To</span>
                    <div className="fmodal-input-wrap">
                      <select className="fmodal-select" value={filters.shipTo} onChange={(e) => setFilters({ ...filters, shipTo: e.target.value })}>
                        <option value="">Willowbrook</option>
                        <option value="Rosewood">Rosewood</option>
                        <option value="Redwood">Redwood</option>
                        <option value="Willowbrook">Willowbrook</option>
                        <option value="Silverlake">Silverlake</option>
                      </select>
                      <KeyboardArrowDownIcon className="fmodal-icon" />
                    </div>
                  </div>
                  <div className="fmodal-field">
                    <span className="fmodal-label">Specimen Type</span>
                    <div className="fmodal-input-wrap">
                      <select className="fmodal-select" value={filters.specimenType} onChange={(e) => setFilters({ ...filters, specimenType: e.target.value })}>
                        <option value="">Blood</option>
                        <option value="Blood">Blood</option>
                        <option value="Urine">Urine</option>
                        <option value="Saliva">Saliva</option>
                      </select>
                      <KeyboardArrowDownIcon className="fmodal-icon" />
                    </div>
                  </div>
                  <div className="fmodal-field">
                    <span className="fmodal-label">Test Name</span>
                    <div className="fmodal-input-wrap">
                      <select className="fmodal-select" value={filters.testName} onChange={(e) => setFilters({ ...filters, testName: e.target.value })}>
                        <option value="">Drug Testing</option>
                        <option value="Urine Culture">Urine Culture</option>
                        <option value="Biopsy">Biopsy</option>
                        <option value="Drug Testing">Drug Testing</option>
                        <option value="Dipstick Test">Dipstick Test</option>
                        <option value="Genetic Testing">Genetic Testing</option>
                        <option value="CBC">CBC</option>
                      </select>
                      <KeyboardArrowDownIcon className="fmodal-icon" />
                    </div>
                  </div>
                  <div className="fmodal-field">
                    <span className="fmodal-label">Service</span>
                    <div className="fmodal-input-wrap">
                      <select className="fmodal-select" value={filters.service} onChange={(e) => setFilters({ ...filters, service: e.target.value })}>
                        <option value="">Women Pathology 2...</option>
                        <option value="Women Pathology 2026">Women Pathology</option>
                        <option value="General Diagnostics">General Diagnostics</option>
                        <option value="Genetics Lab">Genetics Lab</option>
                      </select>
                      <KeyboardArrowDownIcon className="fmodal-icon" />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer buttons */}
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

              {/* Ship Date */}
              <div className="ship-field">
                <span className="ship-field-label">Ship Date</span>
                <div className="ship-field-inner">
                  <input
                    ref={dateInputRef}
                    className="ship-field-input ship-date-input"
                    type="date"
                    value={shipDate}
                    onChange={(e) => setShipDate(e.target.value)}
                  />
                  <CalendarMonthIcon
                    className="ship-picker-icon"
                    onClick={() => dateInputRef.current?.showPicker()}
                  />
                </div>
              </div>

              {/* Ship Time */}
              <div className="ship-field">
                <span className="ship-field-label">Ship Time</span>
                <div className="ship-field-inner">
                  <input
                    ref={timeInputRef}
                    className="ship-field-input ship-time-input"
                    type="time"
                    value={shipTime}
                    onChange={(e) => setShipTime(e.target.value)}
                  />
                  <AccessTimeIcon
                    className="ship-picker-icon"
                    onClick={() => timeInputRef.current?.showPicker()}
                  />
                </div>
              </div>

              {/* Dispatched By — disabled */}
              <div className="ship-field disabled">
                <span className="ship-field-label">Dispatched By</span>
                <div className="ship-field-inner">
                  <input
                    className="ship-field-input"
                    type="text"
                    value="Fertivue, Pune"
                    readOnly
                  />
                </div>
              </div>

              {/* Ship To */}
              <div className="ship-field">
                <span className="ship-field-label">Ship To</span>
                <div className="ship-field-inner">
                  <select
                    className="ship-field-select"
                    value={shipTo}
                    onChange={(e) => setShipTo(e.target.value)}
                  >
                    <option value="Willowbrook">Willowbrook</option>
                    <option value="Rosewood">Rosewood</option>
                    <option value="Redwood">Redwood</option>
                    <option value="Silverlake">Silverlake</option>
                  </select>
                  <KeyboardArrowDownIcon className="ship-picker-icon" style={{ pointerEvents: "none" }} />
                </div>
              </div>
            </div>

            {/* Shipping Details table */}
            <div className="shipping-details-section">
              <h4>Shipping Details ({selectedRows.length})</h4>
              <div className="mini-table-container">
                <table className="mini-table">
                  <thead>
                    <tr>
                      <th>Date | Time</th>
                      <th>Specimen No. | Type</th>
                      <th>Test Code | Name</th>
                      <th>Patient</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingDataOriginal.filter((item) => selectedRows.includes(item.id)).map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="mini-cell-top">{item.date}</div>
                          <div className="mini-cell-bottom">{item.time}</div>
                        </td>
                        <td>
                          <div className="mini-cell-top">{item.sampleNo}</div>
                          <div className="mini-cell-bottom">{item.type}</div>
                        </td>
                        <td>
                          <div className="mini-cell-top">{item.testCode}</div>
                          <div className="mini-cell-bottom">{item.testName}</div>
                        </td>
                        <td>
                          <div className="mini-cell-top">{item.patientName} | {item.age}</div>
                          <div className="mini-cell-bottom">{item.patientCode} | {item.gender}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer shipping-footer">
              <button className="cancel-btn" onClick={() => setShowShippingModal(false)}>Cancel</button>
              <button className="save-btn" onClick={async () => {
                try {
                  const isoDate = `${shipDate}T${shipTime}:00`;
                  await scheduleShipping({
                    ship_date: isoDate,
                    ship_to: shipTo,
                    pending_shipment_ids: selectedRows,
                  });
                  setSelectedRows([]);
                  setShowShippingModal(false);
                  fetchTabData("pending");
                  fetchTabData("shipped");
                } catch (err) {
                  console.error("Schedule shipping failed:", err);
                  alert("Failed to schedule shipping. Please try again.");
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