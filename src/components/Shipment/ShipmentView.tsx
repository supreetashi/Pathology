import React, { useState, useMemo, useRef } from "react";
import "../../styles/Shipment/Shipment.css";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
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

/* ── Round geometric font used in Figma for all UI text ── */
const FONT = "'Plus Jakarta Sans', 'DM Sans', 'Inter', -apple-system, sans-serif";

const ShipmentView: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);

  const [shipDate, setShipDate] = useState("2026-03-13");
  const [shipTime, setShipTime] = useState("12:30");
  const [shipTo, setShipTo] = useState("Willowbrook");
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  const [filters, setFilters] = useState({
    fromDate: "", toDate: "", shipTo: "", specimenType: "",
    testName: "", service: "", shipFrom: "", shipBy: "", shipmentNo: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({ ...filters });

  const pendingDataOriginal = [
    { id: 1, date: "04/02/2024", time: "10:30 AM", sampleNo: "2786/B34", type: "Urine", testCode: "2786/B34", testName: "Urine Culture", serviceName: "Women Pathology 2026", patientName: "Cameron Williamson", age: 30, patientCode: "PCC-1719", gender: "Female" },
    { id: 2, date: "04/02/2024", time: "10:30 AM", sampleNo: "2786/B34", type: "Blood", testCode: "2786/B34", testName: "Biopsy", serviceName: "Women Pathology 2026", patientName: "Olivia Anderson", age: 29, patientCode: "PCC-1719", gender: "Female" },
    { id: 3, date: "04/02/2024", time: "10:30 AM", sampleNo: "2786/B34", type: "Blood", testCode: "2786/B34", testName: "Drug Testing", serviceName: "Women Pathology 2026", patientName: "Mia Thompson", age: 32, patientCode: "PCC-1719", gender: "Female" },
    { id: 4, date: "04/02/2024", time: "10:30 AM", sampleNo: "2786/B34", type: "Blood", testCode: "2786/B34", testName: "Dipstick Test", serviceName: "Women Pathology 2026", patientName: "Isabella Martinez", age: 33, patientCode: "PCC-1719", gender: "Female" },
    { id: 5, date: "04/02/2024", time: "10:30 AM", sampleNo: "2786/B34", type: "Blood", testCode: "2786/B34", testName: "Genetic Testing", serviceName: "Women Pathology 2026", patientName: "Sophia Wilson", age: 34, patientCode: "PCC-1719", gender: "Female" },
    { id: 6, date: "04/02/2024", time: "10:30 AM", sampleNo: "2786/B34", type: "Blood", testCode: "2786/B34", testName: "CBC", serviceName: "Women Pathology 2026", patientName: "Charlotte Anderson", age: 28, patientCode: "PCC-1719", gender: "Female" },
    { id: 7, date: "04/02/2024", time: "10:30 AM", sampleNo: "2786/B34", type: "Blood", testCode: "2786/B34", testName: "Drug Testing", serviceName: "Women Pathology 2026", patientName: "Olivia Anderson", age: 29, patientCode: "PCC-1719", gender: "Female" },
    { id: 8, date: "04/02/2024", time: "10:30 AM", sampleNo: "2786/B34", type: "Urine", testCode: "2786/B34", testName: "Urine Culture", serviceName: "Women Pathology 2026", patientName: "Sophia Wilson", age: 34, patientCode: "PCC-1719", gender: "Female" },
    { id: 9, date: "04/02/2024", time: "11:00 AM", sampleNo: "2787/B35", type: "Blood", testCode: "2787/B35", testName: "Glucose Test", serviceName: "General Diagnostics 2026", patientName: "James Wilson", age: 45, patientCode: "PCC-1820", gender: "Male" },
    { id: 10, date: "04/02/2024", time: "11:15 AM", sampleNo: "2788/B36", type: "Saliva", testCode: "2788/B36", testName: "DNA Panel", serviceName: "Genetics Lab 2026", patientName: "Emily Davis", age: 27, patientCode: "PCC-1921", gender: "Female" },
  ];

  const shippedDataOriginal = [
    { id: 1, shipDate: "04/02/2024", time: "10:30 AM", shipmentNo: "AH-7651", sampleNo: "2786/B34", type: "Urine", testCode: "2786/B34", testName: "Urine Culture", serviceName: "Women Pathology 2026", patientName: "Cameron Williamson", age: 30, patientCode: "PCC-1719", gender: "Female", shipTo: "Rosewood" },
    { id: 2, shipDate: "04/02/2024", time: "10:30 AM", shipmentNo: "AH-7651", sampleNo: "2786/B34", type: "Blood", testCode: "2786/B34", testName: "Biopsy", serviceName: "Women Pathology 2026", patientName: "Olivia Anderson", age: 29, patientCode: "PCC-1719", gender: "Female", shipTo: "Redwood" },
    { id: 3, shipDate: "04/02/2024", time: "10:30 AM", shipmentNo: "AH-7651", sampleNo: "2786/B34", type: "Blood", testCode: "2786/B34", testName: "Drug Testing", serviceName: "Women Pathology 2026", patientName: "Mia Thompson", age: 32, patientCode: "PCC-1719", gender: "Female", shipTo: "Silverlake" },
    { id: 4, shipDate: "04/02/2024", time: "10:30 AM", shipmentNo: "AH-7651", sampleNo: "2786/B34", type: "Blood", testCode: "2786/B34", testName: "Dipstick Test", serviceName: "Women Pathology 2026", patientName: "Isabella Martinez", age: 33, patientCode: "PCC-1719", gender: "Female", shipTo: "Willowbrook" },
    { id: 5, shipDate: "04/02/2024", time: "10:30 AM", shipmentNo: "AH-7651", sampleNo: "2786/B34", type: "Blood", testCode: "2786/B34", testName: "Genetic Testing", serviceName: "Women Pathology 2026", patientName: "Sophia Wilson", age: 34, patientCode: "PCC-1719", gender: "Female", shipTo: "Redwood" },
    { id: 6, shipDate: "04/02/2024", time: "10:30 AM", shipmentNo: "AH-7651", sampleNo: "2786/B34", type: "Blood", testCode: "2786/B34", testName: "CBC", serviceName: "Women Pathology 2026", patientName: "Charlotte Anderson", age: 28, patientCode: "PCC-1719", gender: "Female", shipTo: "Redwood" },
    { id: 7, shipDate: "04/02/2024", time: "10:30 AM", shipmentNo: "AH-7651", sampleNo: "2786/B34", type: "Blood", testCode: "2786/B34", testName: "Drug Testing", serviceName: "Women Pathology 2026", patientName: "Olivia Anderson", age: 29, patientCode: "PCC-1719", gender: "Female", shipTo: "Rosewood" },
    { id: 8, shipDate: "04/02/2024", time: "10:30 AM", shipmentNo: "AH-7651", sampleNo: "2786/B34", type: "Urine", testCode: "2786/B34", testName: "Urine Culture", serviceName: "Women Pathology 2026", patientName: "Sophia Wilson", age: 34, patientCode: "PCC-1719", gender: "Female", shipTo: "Willowbrook" },
  ];

  const receivedDataOriginal = [
    { id: 1, date: "04/02/2024", time: "10:30 AM", receivedNo: "AH-7651", sampleNo: "2786/B34", type: "Urine", testCode: "2786/B34", testName: "Urine Culture", serviceName: "Women Pathology 2026", patientName: "Cameron Williamson", age: 30, patientCode: "PCC-1719", gender: "Female", shipTo: "Rosewood", status: "Accepted" },
    { id: 2, date: "04/02/2024", time: "10:30 AM", receivedNo: "AH-7651", sampleNo: "2786/B34", type: "Urine", testCode: "2786/B34", testName: "Biopsy", serviceName: "Women Pathology 2026", patientName: "Olivia Anderson", age: 29, patientCode: "PCC-1719", gender: "Female", shipTo: "Redwood", status: "Accepted" },
    { id: 3, date: "04/02/2024", time: "10:30 AM", receivedNo: null, sampleNo: "2786/B34", type: "Blood", testCode: "2786/B34", testName: "Drug Testing", serviceName: "Women Pathology 2026", patientName: "Mia Thompson", age: 32, patientCode: "PCC-1719", gender: "Female", shipTo: "Silverlake", status: "Rejected" },
    { id: 4, date: "04/02/2024", time: "10:30 AM", receivedNo: "AH-7651", sampleNo: "2786/B34", type: "Blood", testCode: "2786/B34", testName: "Dipstick Test", serviceName: "Women Pathology 2026", patientName: "Isabella Martinez", age: 33, patientCode: "PCC-1719", gender: "Female", shipTo: "Willowbrook", status: "Accepted" },
    { id: 5, date: "04/02/2024", time: "10:30 AM", receivedNo: null, sampleNo: "2786/B34", type: "Blood", testCode: "2786/B34", testName: "Genetic Testing", serviceName: "Women Pathology 2026", patientName: "Sophia Wilson", age: 34, patientCode: "PCC-1719", gender: "Female", shipTo: "Redwood", status: "Rejected" },
    { id: 6, date: "04/02/2024", time: "10:30 AM", receivedNo: "AH-7651", sampleNo: "2786/B34", type: "Blood", testCode: "2786/B34", testName: "CBC", serviceName: "Women Pathology 2026", patientName: "Charlotte Anderson", age: 28, patientCode: "PCC-1719", gender: "Female", shipTo: "Redwood", status: "Accepted" },
    { id: 7, date: "04/02/2024", time: "10:30 AM", receivedNo: "AH-7651", sampleNo: "2786/B34", type: "Blood", testCode: "2786/B34", testName: "Drug Testing", serviceName: "Women Pathology 2026", patientName: "Olivia Anderson", age: 29, patientCode: "PCC-1719", gender: "Female", shipTo: "Rosewood", status: "Accepted" },
    { id: 8, date: "04/02/2024", time: "10:30 AM", receivedNo: null, sampleNo: "2786/B34", type: "Urine", testCode: "2786/B34", testName: "Urine Culture", serviceName: "Women Pathology 2026", patientName: "Sophia Wilson", age: 34, patientCode: "PCC-1719", gender: "Female", shipTo: "Willowbrook", status: "Rejected" },
  ];

  const activityLogsDataOriginal = [
    { id: 1, date: "04/02/2024", time: "10:30 AM", shipNo: "AH-7651", shipFrom: "Vidai, Pune", shipTo: "Fertivue, Pune", shipBy: "Jordan Blake" },
    { id: 2, date: "04/02/2024", time: "10:30 AM", shipNo: "AH-7651", shipFrom: "Vidai, Pune", shipTo: "Fertivue, Pune", shipBy: "Taylor Quinn" },
    { id: 3, date: "04/02/2024", time: "10:30 AM", shipNo: "AH-7651", shipFrom: "Vidai, Pune", shipTo: "Fertivue, Pune", shipBy: "Morgan Reed" },
    { id: 4, date: "04/02/2024", time: "10:30 AM", shipNo: "AH-7651", shipFrom: "Vidai, Pune", shipTo: "Fertivue, Pune", shipBy: "Casey Lane" },
    { id: 5, date: "04/02/2024", time: "10:30 AM", shipNo: "AH-7651", shipFrom: "Vidai, Pune", shipTo: "Fertivue, Pune", shipBy: "Riley Brooks" },
    { id: 6, date: "04/02/2024", time: "10:30 AM", shipNo: "AH-7651", shipFrom: "Vidai, Pune", shipTo: "Fertivue, Pune", shipBy: "Jamie Parker" },
    { id: 7, date: "04/02/2024", time: "10:30 AM", shipNo: "AH-7651", shipFrom: "Vidai, Pune", shipTo: "Fertivue, Pune", shipBy: "Skylar James" },
    { id: 8, date: "04/02/2024", time: "10:30 AM", shipNo: "AH-7651", shipFrom: "Vidai, Pune", shipTo: "Fertivue, Pune", shipBy: "Avery Taylor" },
  ];

  const currentDataArray = useMemo(() => {
    switch (activeTab) {
      case "pending": return pendingDataOriginal;
      case "shipped": return shippedDataOriginal;
      case "received": return receivedDataOriginal;
      case "activity": return activityLogsDataOriginal;
      default: return [];
    }
  }, [activeTab]);

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
    { key: "pending", label: "Pending (12)" },
    { key: "shipped", label: "Shipped (9)" },
    { key: "received", label: "Received (10)" },
    { key: "activity", label: "Activity Logs" },
  ];

  return (
    <div className="shipment-container" style={{ fontFamily: FONT }}>

      {/* ── Header ── */}
      <div className="shipment-header">
        <h2
          className="page-title"
          style={{ fontFamily: FONT }}
        >
          Sample List ({filteredData.length})
        </h2>
        <div className="header-right">
          <div className="search-wrapper">
            <SearchIcon className="search-icon" />
            <input
              type="text"
              placeholder={
                activeTab === "activity"
                  ? "Search by Ship No., ..."
                  : "Search by Patient name, MRN No., Specimen No., Test..."
              }
              className="search-input"
              style={{ fontFamily: FONT }}
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <button className="filter-button" onClick={() => setShowFilterModal(true)}>
            <FilterAltIcon fontSize="small" />
          </button>
        </div>
      </div>

      {/* ── Tabs — Plus Jakarta Sans, pill shape ── */}
      <div className="tabs-container">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            className={`tab-item ${activeTab === key ? "active" : ""}`}
            style={{ fontFamily: FONT }}
            onClick={() => { setActiveTab(key); setCurrentPage(1); setSearchQuery(""); }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Table ── */}
      <div className="table-container">
        {renderTabContent()}
        <div className="table-footer">
          <div className="showing-entries" style={{ fontFamily: FONT }}>
            Showing {filteredData.length > 0 ? startIndex + 1 : 0} to{" "}
            {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} entries
          </div>
          <div className="pagination-controls">
            <ChevronLeftIcon
              className={`pagination-arrow ${currentPage === 1 ? "disabled" : ""}`}
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            />
            {Array.from({ length: Math.min(totalPages || 1, 3) }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                className={`page-num ${currentPage === num ? "active" : ""}`}
                style={{ fontFamily: FONT }}
                onClick={() => setCurrentPage(num)}
              >
                {num}
              </button>
            ))}
            <ChevronRightIcon
              className={`pagination-arrow ${currentPage === totalPages || totalPages === 0 ? "disabled" : ""}`}
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
            />
          </div>
        </div>
      </div>

      {/* Schedule Shipping button */}
      {activeTab === "pending" && selectedRows.length > 0 && (
        <div className="shipping-button-container">
          <button
            className="schedule-shipping-btn"
            style={{ fontFamily: FONT }}
            onClick={() => setShowShippingModal(true)}
          >
            Schedule Shipping
          </button>
        </div>
      )}

      {/* ── FILTER MODAL ── */}
      {showFilterModal && (
        <div className="modal-overlay" onClick={() => setShowFilterModal(false)}>
          <div className="modal-content filter-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontFamily: FONT }}>Filters</h3>
              <CloseIcon className="close-icon-btn" onClick={() => setShowFilterModal(false)} />
            </div>
            <div className="filter-grid">
              <div className="filter-item">
                <label style={{ fontFamily: FONT }}>From Date</label>
                <div className="input-with-icon">
                  <input type="text" placeholder="13/03/2026" style={{ fontFamily: FONT }} value={filters.fromDate} onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })} />
                  <CalendarMonthIcon className="inner-icon" />
                </div>
              </div>
              <div className="filter-item">
                <label style={{ fontFamily: FONT }}>To Date</label>
                <div className="input-with-icon">
                  <input type="text" placeholder="14/03/2026" style={{ fontFamily: FONT }} value={filters.toDate} onChange={(e) => setFilters({ ...filters, toDate: e.target.value })} />
                  <CalendarMonthIcon className="inner-icon" />
                </div>
              </div>
              {activeTab === "activity" ? (
                <>
                  <div className="filter-item">
                    <label style={{ fontFamily: FONT }}>Ship From</label>
                    <div className="input-with-icon">
                      <select style={{ fontFamily: FONT }} value={filters.shipFrom} onChange={(e) => setFilters({ ...filters, shipFrom: e.target.value })}>
                        <option value="">All</option>
                        <option value="Vidai, Pune">Vidai, Pune</option>
                        <option value="Fertivue, Pune">Fertivue, Pune</option>
                      </select>
                      <KeyboardArrowDownIcon className="inner-icon" />
                    </div>
                  </div>
                  <div className="filter-item">
                    <label style={{ fontFamily: FONT }}>Ship To</label>
                    <div className="input-with-icon">
                      <select style={{ fontFamily: FONT }} value={filters.shipTo} onChange={(e) => setFilters({ ...filters, shipTo: e.target.value })}>
                        <option value="">All</option>
                        <option value="Fertivue, Pune">Fertivue, Pune</option>
                        <option value="Vidai, Pune">Vidai, Pune</option>
                      </select>
                      <KeyboardArrowDownIcon className="inner-icon" />
                    </div>
                  </div>
                  <div className="filter-item">
                    <label style={{ fontFamily: FONT }}>Ship By</label>
                    <div className="input-with-icon">
                      <select style={{ fontFamily: FONT }} value={filters.shipBy} onChange={(e) => setFilters({ ...filters, shipBy: e.target.value })}>
                        <option value="">All</option>
                        <option value="Jordan Blake">Jordan Blake</option>
                        <option value="Riley Brooks">Riley Brooks</option>
                      </select>
                      <KeyboardArrowDownIcon className="inner-icon" />
                    </div>
                  </div>
                  <div className="filter-item">
                    <label style={{ fontFamily: FONT }}>Shipment No.</label>
                    <div className="input-with-icon">
                      <input type="text" placeholder="AH-7651" style={{ fontFamily: FONT }} value={filters.shipmentNo} onChange={(e) => setFilters({ ...filters, shipmentNo: e.target.value })} />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="filter-item">
                    <label style={{ fontFamily: FONT }}>Ship To</label>
                    <div className="input-with-icon">
                      <select style={{ fontFamily: FONT }} value={filters.shipTo} onChange={(e) => setFilters({ ...filters, shipTo: e.target.value })}>
                        <option value="">All</option>
                        <option value="Rosewood">Rosewood</option>
                        <option value="Redwood">Redwood</option>
                        <option value="Willowbrook">Willowbrook</option>
                        <option value="Silverlake">Silverlake</option>
                      </select>
                      <KeyboardArrowDownIcon className="inner-icon" />
                    </div>
                  </div>
                  <div className="filter-item">
                    <label style={{ fontFamily: FONT }}>Specimen Type</label>
                    <div className="input-with-icon">
                      <select style={{ fontFamily: FONT }} value={filters.specimenType} onChange={(e) => setFilters({ ...filters, specimenType: e.target.value })}>
                        <option value="">All</option>
                        <option value="Blood">Blood</option>
                        <option value="Urine">Urine</option>
                        <option value="Saliva">Saliva</option>
                      </select>
                      <KeyboardArrowDownIcon className="inner-icon" />
                    </div>
                  </div>
                  <div className="filter-item">
                    <label style={{ fontFamily: FONT }}>Test Name</label>
                    <div className="input-with-icon">
                      <select style={{ fontFamily: FONT }} value={filters.testName} onChange={(e) => setFilters({ ...filters, testName: e.target.value })}>
                        <option value="">All</option>
                        <option value="Urine Culture">Urine Culture</option>
                        <option value="Biopsy">Biopsy</option>
                        <option value="Drug Testing">Drug Testing</option>
                        <option value="Dipstick Test">Dipstick Test</option>
                        <option value="Genetic Testing">Genetic Testing</option>
                        <option value="CBC">CBC</option>
                      </select>
                      <KeyboardArrowDownIcon className="inner-icon" />
                    </div>
                  </div>
                  <div className="filter-item">
                    <label style={{ fontFamily: FONT }}>Service</label>
                    <div className="input-with-icon">
                      <select style={{ fontFamily: FONT }} value={filters.service} onChange={(e) => setFilters({ ...filters, service: e.target.value })}>
                        <option value="">All</option>
                        <option value="Women Pathology 2026">Women Pathology</option>
                        <option value="General Diagnostics">General Diagnostics</option>
                        <option value="Genetics Lab">Genetics Lab</option>
                      </select>
                      <KeyboardArrowDownIcon className="inner-icon" />
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer filter-footer">
              <button className="clear-all-btn" style={{ fontFamily: FONT }} onClick={handleClearFilters}>Clear All</button>
              <button className="apply-btn" style={{ fontFamily: FONT }} onClick={handleApplyFilters}>Apply</button>
            </div>
          </div>
        </div>
      )}

      {/* ── SCHEDULE SHIPPING MODAL ── */}
      {showShippingModal && (
        <div className="modal-overlay" onClick={() => setShowShippingModal(false)}>
          <div className="modal-content shipping-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontFamily: FONT }}>Schedule Shipping</h3>
              <CloseIcon className="close-icon-btn" onClick={() => setShowShippingModal(false)} />
            </div>

            <div className="shipping-form-grid">
              <div className="ship-field">
                <span className="ship-field-label" style={{ fontFamily: FONT }}>Ship Date</span>
                <div className="ship-field-inner">
                  <input
                    ref={dateInputRef}
                    className="ship-field-input ship-date-input"
                    type="date"
                    style={{ fontFamily: FONT }}
                    value={shipDate}
                    onChange={(e) => setShipDate(e.target.value)}
                  />
                  <CalendarMonthIcon
                    className="ship-picker-icon"
                    onClick={() => dateInputRef.current?.showPicker()}
                  />
                </div>
              </div>

              <div className="ship-field">
                <span className="ship-field-label" style={{ fontFamily: FONT }}>Ship Time</span>
                <div className="ship-field-inner">
                  <input
                    ref={timeInputRef}
                    className="ship-field-input ship-time-input"
                    type="time"
                    style={{ fontFamily: FONT }}
                    value={shipTime}
                    onChange={(e) => setShipTime(e.target.value)}
                  />
                  <AccessTimeIcon
                    className="ship-picker-icon"
                    onClick={() => timeInputRef.current?.showPicker()}
                  />
                </div>
              </div>

              <div className="ship-field disabled">
                <span className="ship-field-label" style={{ fontFamily: FONT }}>Dispatched By</span>
                <div className="ship-field-inner">
                  <input
                    className="ship-field-input"
                    type="text"
                    style={{ fontFamily: FONT }}
                    value="Fertivue, Pune"
                    readOnly
                  />
                </div>
              </div>

              <div className="ship-field">
                <span className="ship-field-label" style={{ fontFamily: FONT }}>Ship To</span>
                <div className="ship-field-inner">
                  <select
                    className="ship-field-select"
                    style={{ fontFamily: FONT }}
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

            <div className="shipping-details-section">
              <h4 style={{ fontFamily: FONT }}>Shipping Details ({selectedRows.length})</h4>
              <div className="mini-table-container">
                <table className="mini-table" style={{ fontFamily: FONT }}>
                  <thead>
                    <tr>
                      <th style={{ fontFamily: FONT }}>Date | Time</th>
                      <th style={{ fontFamily: FONT }}>Specimen No. | Type</th>
                      <th style={{ fontFamily: FONT }}>Test Code | Name</th>
                      <th style={{ fontFamily: FONT }}>Patient</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingDataOriginal.filter((item) => selectedRows.includes(item.id)).map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="mini-cell-top" style={{ fontFamily: FONT }}>{item.date}</div>
                          <div className="mini-cell-bottom" style={{ fontFamily: FONT }}>{item.time}</div>
                        </td>
                        <td>
                          <div className="mini-cell-top" style={{ fontFamily: FONT }}>{item.sampleNo}</div>
                          <div className="mini-cell-bottom" style={{ fontFamily: FONT }}>{item.type}</div>
                        </td>
                        <td>
                          <div className="mini-cell-top" style={{ fontFamily: FONT }}>{item.testCode}</div>
                          <div className="mini-cell-bottom" style={{ fontFamily: FONT }}>{item.testName}</div>
                        </td>
                        <td>
                          <div className="mini-cell-top" style={{ fontFamily: FONT }}>{item.patientName} | {item.age}</div>
                          <div className="mini-cell-bottom" style={{ fontFamily: FONT }}>{item.patientCode} | {item.gender}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer shipping-footer">
              <button className="cancel-btn" style={{ fontFamily: FONT }} onClick={() => setShowShippingModal(false)}>Cancel</button>
              <button className="save-btn" style={{ fontFamily: FONT }} onClick={() => {
                alert("Shipping Scheduled!");
                setSelectedRows([]);
                setShowShippingModal(false);
              }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipmentView;