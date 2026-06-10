import { useCallback, useEffect, useMemo, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  getAllSamples,
  getActivityLogSamples,
  receiveSample,
  rejectSample,
  type ReceiveSample,
} from "../../services/ReceiveTab.api";
import ReceiveSpecimenModal from "./ReceiveSpecimenModal";
import RejectSpecimenModal from "./RejectSpecimenModal";
import ActivityLogFilterModal, {
  type ActivityLogFilterValues,
} from "./ActivityLogFilterModal";
import ShippedFilterModal, {
  type ShippedFilterValues,
} from "./ShippedFilterModal";
import ShippedTab from "./ShippedTab";
import ReceivedTab from "./ReceivedTab";
import RejectedTab from "./RejectedTab";
import ActivityLogsTab from "./ActivityLogsTab";
import "../../styles/Recieve/ReceiveView.css";

type ReceiveTab = "shipped" | "received" | "rejected" | "activity";

const ITEMS_PER_PAGE = 10;

const EMPTY_SHIPPED_FILTERS: ShippedFilterValues = {
  fromDate: "",
  toDate: "",
  specimenType: "",
  testName: "",
  service: "",
};

const EMPTY_ACTIVITY_FILTERS: ActivityLogFilterValues = {
  dateFilterType: "ship",
  fromDate: "",
  toDate: "",
  shipFrom: "",
  shipTo: "",
  shipBy: "",
  receiveAt: "",
  receiveBy: "",
  service: "",
};

const tabConfig: Record<ReceiveTab, { label: string; withCount: boolean }> = {
  shipped: { label: "Shipped", withCount: true },
  received: { label: "Received", withCount: true },
  rejected: { label: "Rejected", withCount: true },
  activity: { label: "Activity Logs", withCount: false },
};

function toSampleRow(r: ReceiveSample) {
  const shipDate = r.ship_date
    ? r.ship_date.split("-").reverse().join("/")
    : "—";

  const shipTime = r.ship_time
    ? (() => {
        const [h, m] = r.ship_time.split(":").map(Number);
        const ampm = h >= 12 ? "PM" : "AM";
        const h12 = h % 12 || 12;
        return `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
      })()
    : "—";

  return {
    id: r.id,
    shipDate,
    shipTime,
    shipmentNo: r.shipment_no,
    sampleNo: r.specimen_no,
    type: r.specimen_type,
    testCode: r.test_code,
    testName: r.test_name,
    serviceName: r.service_name,
    patientName: r.patient_name,
    age: Number(r.patient_age) || 0,
    patientCode: r.patient_code,
    gender: r.patient_gender,
    remark: typeof r.remark === "string" ? r.remark : null,
    receiveDate: typeof r.receive_date === "string" ? r.receive_date : null,
    receiveTime: typeof r.receive_time === "string" ? r.receive_time : null,
  };
}

type SampleRow = ReturnType<typeof toSampleRow>;

// ── Payload types ────────────────────────────────────────────
type ReceivePayload = {
  receiveDate: string;
  receiveTime: string;
  remark: string;
  subOptimal: boolean;
};

type RejectPayload = {
  rejectDate: string;
  rejectTime: string;
  remark: string;
  resend: boolean;
};

function ReceiveView() {
  const [shippedData, setShippedData] = useState<SampleRow[]>([]);
  const [receivedData, setReceivedData] = useState<SampleRow[]>([]);
  const [rejectedData, setRejectedData] = useState<SampleRow[]>([]);
  const [activityData, setActivityData] = useState<SampleRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<ReceiveTab>("shipped");
  const [searchValue, setSearchValue] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showShippedFilterModal, setShowShippedFilterModal] = useState(false);
  const [showActivityFilterModal, setShowActivityFilterModal] = useState(false);
  const [shippedFilters, setShippedFilters] = useState<ShippedFilterValues>(EMPTY_SHIPPED_FILTERS);
  const [receivedFilters, setReceivedFilters] = useState<ShippedFilterValues>(EMPTY_SHIPPED_FILTERS);
  const [activityFilters, setActivityFilters] = useState<ActivityLogFilterValues>(EMPTY_ACTIVITY_FILTERS);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [allSamples, activitySamples] = await Promise.all([
        getAllSamples(),
        getActivityLogSamples(),
      ]);
      setShippedData(allSamples.filter((r) => r.status === "Shipped").map(toSampleRow));
      setReceivedData(allSamples.filter((r) => r.status === "Received").map(toSampleRow));
      setRejectedData(allSamples.filter((r) => r.status === "Rejected").map(toSampleRow));
      setActivityData(activitySamples.map(toSampleRow));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filterSourceRows = activeTab === "received" ? receivedData : shippedData;

  const specimenOptions = useMemo(
    () => Array.from(new Set(filterSourceRows.map((row) => row.type))),
    [filterSourceRows],
  );
  const testOptions = useMemo(
    () => Array.from(new Set(filterSourceRows.map((row) => row.testName))),
    [filterSourceRows],
  );
  const serviceOptions = useMemo(
    () => Array.from(new Set(filterSourceRows.map((row) => row.serviceName))),
    [filterSourceRows],
  );
  const activityServiceOptions = useMemo(
    () => Array.from(new Set(activityData.map((row) => row.serviceName))),
    [activityData],
  );

  const parseDate = (value: string) => {
    if (!value) return null;
    let day = 0, month = 0, year = 0;
    if (value.includes("/")) {
      const parts = value.split("/");
      if (parts.length !== 3) return null;
      day = Number(parts[0]);
      month = Number(parts[1]) - 1;
      year = Number(parts[2]);
    } else if (value.includes("-")) {
      const parts = value.split("-");
      if (parts.length !== 3) return null;
      year = Number(parts[0]);
      month = Number(parts[1]) - 1;
      day = Number(parts[2]);
    } else return null;
    if (!Number.isFinite(day) || !Number.isFinite(month) || !Number.isFinite(year)) return null;
    const parsed = new Date(year, month, day);
    if (Number.isNaN(parsed.getTime())) return null;
    parsed.setHours(0, 0, 0, 0);
    return parsed;
  };

  const tabCounts: Record<ReceiveTab, number> = {
    shipped: shippedData.length,
    received: receivedData.length,
    rejected: rejectedData.length,
    activity: activityData.length,
  };

  const sourceRows = useMemo(() => {
    if (activeTab === "received") return receivedData;
    if (activeTab === "rejected") return rejectedData;
    if (activeTab === "activity") return activityData;
    return shippedData;
  }, [activeTab, shippedData, receivedData, rejectedData, activityData]);

  const filteredRows = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    return sourceRows.filter((row) => {
      const searchableText = [
        row.patientName,
        row.patientCode,
        row.sampleNo,
        row.testName,
        row.shipmentNo,
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch = !query || searchableText.includes(query);

      if (activeTab === "activity") {
        const activityDate = parseDate(row.shipDate);
        const fromDate = parseDate(activityFilters.fromDate);
        const toDate = parseDate(activityFilters.toDate);
        return (
          matchesSearch &&
          (!fromDate || (activityDate !== null && activityDate >= fromDate)) &&
          (!toDate || (activityDate !== null && activityDate <= toDate)) &&
          (!activityFilters.service ||
            row.serviceName.toLowerCase() === activityFilters.service.toLowerCase())
        );
      }

      if (activeTab !== "shipped" && activeTab !== "received") return matchesSearch;

      const activeFilters = activeTab === "received" ? receivedFilters : shippedFilters;
      const rowDate = parseDate(row.shipDate);
      const fromDate = parseDate(activeFilters.fromDate);
      const toDate = parseDate(activeFilters.toDate);

      return (
        matchesSearch &&
        (!fromDate || (rowDate !== null && rowDate >= fromDate)) &&
        (!toDate || (rowDate !== null && rowDate <= toDate)) &&
        (!activeFilters.specimenType ||
          row.type.toLowerCase() === activeFilters.specimenType.toLowerCase()) &&
        (!activeFilters.testName ||
          row.testName.toLowerCase() === activeFilters.testName.toLowerCase()) &&
        (!activeFilters.service ||
          row.serviceName.toLowerCase() === activeFilters.service.toLowerCase())
      );
    });
  }, [sourceRows, searchValue, activeTab, shippedFilters, receivedFilters, activityFilters]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pagedRows = filteredRows.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const allSelected =
    activeTab === "shipped" &&
    pagedRows.length > 0 &&
    pagedRows.every((row) => selectedIds.includes(row.id));

  const selectedRows = useMemo(
    () => shippedData.filter((row) => selectedIds.includes(row.id)),
    [shippedData, selectedIds],
  );

  // ── Confirm handlers with payload ───────────────────────────
  const handleReceiveConfirm = async (payload: ReceivePayload) => {
    if (selectedIds.length === 0) {
      setShowReceiveModal(false);
      return;
    }
    try {
      await Promise.all(
        selectedIds.map((id) =>
          receiveSample(id, {
            receive_date: payload.receiveDate,
            receive_time: payload.receiveTime + ":00",
            remark: payload.remark,
            sub_optimal: payload.subOptimal,
          })
        )
      );
      setSelectedIds([]);
      setShowReceiveModal(false);
      setActiveTab("received");
      setCurrentPage(1);
      await fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to receive samples");
    }
  };

  const handleRejectConfirm = async (payload: RejectPayload) => {
    if (selectedIds.length === 0) {
      setShowRejectModal(false);
      return;
    }
    try {
      await Promise.all(
        selectedIds.map((id) =>
          rejectSample(id, {
            reject_date: payload.rejectDate,
            reject_time: payload.rejectTime + ":00",
            remark: payload.remark,
            resend: payload.resend,
          })
        )
      );
      setSelectedIds([]);
      setShowRejectModal(false);
      setActiveTab("rejected");
      setCurrentPage(1);
      await fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reject samples");
    }
  };

  const toggleAllRows = () => {
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pagedRows.some((row) => row.id === id)));
      return;
    }
    setSelectedIds((prev) => {
      const next = [...prev];
      pagedRows.forEach((row) => { if (!next.includes(row.id)) next.push(row.id); });
      return next;
    });
  };

  const toggleSingleRow = (id: number) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const renderActiveTab = () => {
    if (activeTab === "received")
      return <ReceivedTab rows={pagedRows} rowOffset={startIndex} />;
    if (activeTab === "rejected")
      return <RejectedTab rows={pagedRows} rowOffset={startIndex} />;
    if (activeTab === "activity")
      return <ActivityLogsTab rows={pagedRows} rowOffset={startIndex} />;
    return (
      <ShippedTab
        data={pagedRows}
        selectedIds={selectedIds}
        allSelected={allSelected}
        onToggleAllRows={toggleAllRows}
        onToggleSingleRow={toggleSingleRow}
      />
    );
  };

  return (
    <section className="receive-view">
      <div className="receive-header">
        <h2 className="receive-title">Sample List ({filteredRows.length})</h2>
        <div className="receive-header-actions">
          <label className="receive-search-box" aria-label="Search in receive table">
            <SearchIcon className="receive-search-icon" fontSize="small" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={
                activeTab === "activity"
                  ? "Search by Ship No., Receive No."
                  : "Search by Patient name, MRN No., Specimen No., Shipment No."
              }
            />
          </label>
          <button
            type="button"
            className="receive-filter-button"
            aria-label="Open filters"
            disabled={activeTab === "rejected"}
            onClick={() => {
              if (activeTab === "shipped" || activeTab === "received")
                setShowShippedFilterModal(true);
              else if (activeTab === "activity")
                setShowActivityFilterModal(true);
            }}
          >
            <FilterAltIcon fontSize="small" />
          </button>
        </div>
      </div>

      <div className="receive-tabs" role="tablist" aria-label="Receive tabs">
        {(Object.keys(tabConfig) as ReceiveTab[]).map((tab) => {
          const isActive = tab === activeTab;
          const { label, withCount } = tabConfig[tab];
          return (
            <button
              type="button"
              role="tab"
              key={tab}
              aria-selected={isActive}
              className={`receive-tab ${isActive ? "active" : ""}`}
              onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
            >
              {label}{withCount ? ` (${tabCounts[tab]})` : ""}
            </button>
          );
        })}
      </div>

      <div className="receive-table-shell">
        {loading && (
          <p style={{ textAlign: "center", padding: "2rem", color: "#666" }}>Loading…</p>
        )}
        {error && !loading && (
          <p style={{ textAlign: "center", padding: "2rem", color: "#d32f2f" }}>
            {error}{" "}
            <button
              type="button"
              onClick={fetchData}
              style={{ textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}
            >
              Retry
            </button>
          </p>
        )}
        {!loading && !error && renderActiveTab()}

        <div className="receive-table-footer">
          <span>
            Showing {filteredRows.length === 0 ? 0 : startIndex + 1} to{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, filteredRows.length)} of{" "}
            {filteredRows.length} entries
          </span>
          <div className="pagination-wrap" aria-label="Receive pagination">
            <button
              type="button"
              className="pagination-arrow"
              aria-label="Previous page"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeftIcon fontSize="small" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNo) => (
              <button
                type="button"
                key={pageNo}
                className={`page-number ${currentPage === pageNo ? "active" : ""}`}
                onClick={() => setCurrentPage(pageNo)}
              >
                {pageNo}
              </button>
            ))}
            <button
              type="button"
              className="pagination-arrow"
              aria-label="Next page"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRightIcon fontSize="small" />
            </button>
          </div>
        </div>
      </div>

      {activeTab === "shipped" && (
        <div className="receive-footer-actions">
          <button
            type="button"
            className="btn-secondary"
            disabled={selectedRows.length === 0}
            onClick={() => setShowRejectModal(true)}
          >
            Reject
          </button>
          <button
            type="button"
            className="btn-primary"
            disabled={selectedRows.length === 0}
            onClick={() => setShowReceiveModal(true)}
          >
            Receive
          </button>
        </div>
      )}

      <ReceiveSpecimenModal
        isOpen={showReceiveModal}
        rows={selectedRows}
        onClose={() => setShowReceiveModal(false)}
        onConfirm={handleReceiveConfirm}
      />
      <RejectSpecimenModal
        isOpen={showRejectModal}
        rows={selectedRows}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleRejectConfirm}
      />

      <ShippedFilterModal
        isOpen={showShippedFilterModal}
        initialValues={activeTab === "received" ? receivedFilters : shippedFilters}
        specimenOptions={specimenOptions}
        testOptions={testOptions}
        serviceOptions={serviceOptions}
        onClose={() => setShowShippedFilterModal(false)}
        onApply={(values) => {
          if (activeTab === "received") setReceivedFilters(values);
          else setShippedFilters(values);
          setCurrentPage(1);
          setShowShippedFilterModal(false);
        }}
        onClear={() => {
          if (activeTab === "received") setReceivedFilters(EMPTY_SHIPPED_FILTERS);
          else setShippedFilters(EMPTY_SHIPPED_FILTERS);
          setCurrentPage(1);
          setShowShippedFilterModal(false);
        }}
      />

      <ActivityLogFilterModal
        isOpen={showActivityFilterModal}
        initialValues={activityFilters}
        shipFromOptions={["Vidai, Pune"]}
        shipToOptions={["Fertivue, Pune"]}
        shipByOptions={[]}
        receiveAtOptions={["Fertivue, Pune"]}
        receiveByOptions={[]}
        serviceOptions={activityServiceOptions}
        onClose={() => setShowActivityFilterModal(false)}
        onApply={(values) => {
          setActivityFilters(values);
          setCurrentPage(1);
          setShowActivityFilterModal(false);
        }}
        onClear={() => {
          setActivityFilters(EMPTY_ACTIVITY_FILTERS);
          setCurrentPage(1);
          setShowActivityFilterModal(false);
        }}
      />
    </section>
  );
}

export default ReceiveView;