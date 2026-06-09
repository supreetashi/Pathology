import { useEffect, useState, useCallback } from "react";
import "./ResultEntry.css";
import { FiChevronLeft, FiChevronRight, FiInfo, FiSearch } from "react-icons/fi";
import { HiOutlineFilter } from "react-icons/hi";
import { FaRegFileAlt } from "react-icons/fa";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import CBC from "./CBC";
import { Result } from "./types";
import {
  getResultEntries,
  getPendingSamples,
  createResultEntry,
  completeResultEntry,
  toResult,
  type ResultEntryRecord,
  type PendingSample,
} from "../../services/resultEntry.api";

const ResultEntry = () => {
  // ── table data
  const [results, setResults] = useState<ResultEntryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── create-entry state (for the pending-samples picker dialog)
  const [pendingSamples, setPendingSamples] = useState<PendingSample[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedPendingId, setSelectedPendingId] = useState<number | "">("");

  // ── CBC drill-down
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);

  // ── search / filter / pagination
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [tempStatusFilter, setTempStatusFilter] = useState(statusFilter);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // ── fetch result entries list ─────────────────────────────────────────────
  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getResultEntries();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load results");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  // ── fetch pending samples (only when the create dialog opens) ────────────
  const openCreateDialog = async () => {
    try {
      const data = await getPendingSamples();
      setPendingSamples(data);
      setSelectedPendingId("");
      setShowCreateDialog(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not load pending samples");
    }
  };

  // ── create result entry ───────────────────────────────────────────────────
  const handleCreateEntry = async () => {
    if (selectedPendingId === "") return;
    setCreating(true);
    try {
      const selected = pendingSamples.find((s) => s.id === selectedPendingId);
      await createResultEntry(selectedPendingId, selected?.test_name ?? "N/A");
      setShowCreateDialog(false);
      await fetchResults();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create result entry");
    } finally {
      setCreating(false);
    }
  };

  // ── mark result as complete ───────────────────────────────────────────────
  const handleMarkComplete = async (resultId: number) => {
    try {
      await completeResultEntry(resultId);
      setResults((prev) =>
        prev.map((r) => (r.id === resultId ? { ...r, result_status: "Completed" } : r))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to complete result");
    }
  };

  // ── derive display rows ───────────────────────────────────────────────────
  const displayRows: Result[] = results.map(toResult);

  const filteredData = displayRows.filter((item) => {
    const searchText = search.toLowerCase();
    const matchesSearch = Object.values(item).join(" ").toLowerCase().includes(searchText);
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const startEntry = filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, filteredData.length);

  // ── CBC drill-down ────────────────────────────────────────────────────────
  if (selectedResult) {
    return (
      <CBC
        onBack={() => {
          setSelectedResult(null);
          fetchResults();
        }}
        data={selectedResult}
        initialMode={selectedResult.status === "Pending" ? "edit" : "view"}
      />
    );
  }

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="result-container">
      {/* HEADER */}
      <div className="result-header">
        <h3>Result Entry List ({filteredData.length})</h3>

        <div className="actions">
          <div className="search-box">
            <FiSearch />
            <input
              placeholder="Search by Patient name, MRN No."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter button */}
          <button
            className="filter-btn"
            onClick={() => {
              setTempStatusFilter(statusFilter);
              setFilterOpen(true);
            }}
          >
            <HiOutlineFilter />
          </button>

          {/* New entry button */}
          <button
            className="filter-btn"
            title="Create new result entry"
            style={{ marginLeft: 4 }}
            onClick={openCreateDialog}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
              <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Loading / error states ────────────────────────────────────────── */}
      {loading && (
        <p style={{ textAlign: "center", padding: "2rem", color: "#666" }}>Loading…</p>
      )}
      {error && (
        <p style={{ textAlign: "center", padding: "2rem", color: "#d32f2f" }}>
          {error}{" "}
          <button onClick={fetchResults} style={{ textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}>
            Retry
          </button>
        </p>
      )}

      {/* ── Filter dialog ─────────────────────────────────────────────────── */}
      <Dialog
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        PaperProps={{ style: { borderRadius: 20, minWidth: 340, padding: 0 } }}
      >
        <DialogTitle sx={{ m: 0, p: 2, fontWeight: 700, fontSize: 20, pb: 1 }}>
          Filters
          <IconButton
            aria-label="close"
            onClick={() => setFilterOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
            size="large"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 0, pb: 0 }}>
          <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
            <InputLabel id="status-filter-label">Result Entry Status</InputLabel>
            <Select
              labelId="status-filter-label"
              value={tempStatusFilter}
              label="Result Entry Status"
              onChange={(e) => setTempStatusFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Completed">Complete</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2, pt: 0 }}>
          <Button
            onClick={() => setTempStatusFilter("All")}
            sx={{ fontWeight: 700, borderRadius: 2, bgcolor: "#f5f5f5", color: "#222", boxShadow: "none", border: "none", px: 4, height: "40px", fontSize: 14, "&:hover": { bgcolor: "#ececec" } }}
          >
            Clear All
          </Button>
          <Button
            variant="contained"
            onClick={() => { setStatusFilter(tempStatusFilter); setFilterOpen(false); }}
            sx={{ fontWeight: 700, borderRadius: 2, bgcolor: "#444", color: "#fff", boxShadow: "none", border: "none", px: 4, height: "40px", fontSize: 14, "&:hover": { bgcolor: "#222" } }}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Create entry dialog ───────────────────────────────────────────── */}
      <Dialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        PaperProps={{ style: { borderRadius: 20, minWidth: 380 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: 18 }}>
          New Result Entry
          <IconButton
            aria-label="close"
            onClick={() => setShowCreateDialog(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1, mb: 1 }}>
            <InputLabel id="pending-sample-label">Select Received Sample</InputLabel>
            <Select
              labelId="pending-sample-label"
              value={selectedPendingId}
              label="Select Received Sample"
              onChange={(e) => setSelectedPendingId(e.target.value as number)}
            >
              {pendingSamples.length === 0 && (
                <MenuItem disabled value="">
                  No pending samples
                </MenuItem>
              )}
              {pendingSamples.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.specimen_no} — {s.patient_name} ({s.test_name})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
          <Button
            onClick={() => setShowCreateDialog(false)}
            sx={{ fontWeight: 700, borderRadius: 2, bgcolor: "#f5f5f5", color: "#222", boxShadow: "none", px: 3, height: "38px" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={selectedPendingId === "" || creating}
            onClick={handleCreateEntry}
            sx={{ fontWeight: 700, borderRadius: 2, bgcolor: "#444", color: "#fff", boxShadow: "none", px: 3, height: "38px", "&:hover": { bgcolor: "#222" } }}
          >
            {creating ? "Creating…" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── TABLE ────────────────────────────────────────────────────────── */}
      {!loading && !error && (
        <div className="table">
          <div className="table-head">
            <span>Order Date | Time</span>
            <span>Patient</span>
            <span>Patient Type</span>
            <span>Doctor Name</span>
            <span>Bill Details</span>
            <span>No. of Orders</span>
            <span>Result Entry Status</span>
            <span>Result</span>
          </div>

          {paginatedData.length === 0 && (
            <p style={{ textAlign: "center", padding: "2rem", color: "#999" }}>
              No results found.
            </p>
          )}

          {paginatedData.map((item) => {
            const record = results.find((r) => r.id === item.id);

            return (
              <div className="table-row" key={item.id}>
                <div>
                  <p>{item.date}</p>
                  <small>{item.time}</small>
                </div>

                <div>
                  <p>{item.patient}</p>
                  <small>{item.details}</small>
                </div>

                <span>{item.type}</span>
                <span>{item.doctor}</span>
                <span className="bill-cell">
                  <FiInfo className="bill-icon" />
                  {item.bill}
                </span>
                <span>{item.orders}</span>

                <span className={`status-pill ${item.status === "Pending" ? "pending" : "complete"}`}>
                  {item.status === "Completed" ? "Complete" : item.status}
                </span>

                <span
                  className="result-action"
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedResult(item);
                  }}
                >
                  {item.status === "Pending" ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" stroke="#1976d2" strokeWidth="2" fill="none" />
                      <line x1="12" y1="8" x2="12" y2="16" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" />
                      <line x1="8" y1="12" x2="16" y2="12" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <FaRegFileAlt />
                  )}
                </span>

                {item.status === "Pending" && record && (
                  <span
                    style={{ cursor: "pointer", color: "#2e7d32", fontSize: 12, paddingLeft: 6 }}
                    title="Mark as complete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkComplete(record.id);
                    }}
                  >
                    ✓
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── FOOTER / PAGINATION ──────────────────────────────────────────── */}
      {!loading && !error && (
        <div className="result-footer">
          <span>
            Showing {startEntry} to {endEntry} of {filteredData.length} entries
          </span>

          <div className="pagination">
            <button
              type="button"
              className="page-nav"
              aria-label="Previous page"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            >
              <FiChevronLeft />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNo) => (
              <button
                type="button"
                key={pageNo}
                onClick={() => setCurrentPage(pageNo)}
                className={currentPage === pageNo ? "active" : ""}
              >
                {pageNo}
              </button>
            ))}

            <button
              type="button"
              className="page-nav"
              aria-label="Next page"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultEntry;
