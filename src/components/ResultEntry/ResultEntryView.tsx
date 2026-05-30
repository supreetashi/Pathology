import { useEffect, useState } from "react";
import "./ResultEntry.css";
import { FiChevronLeft, FiChevronRight, FiInfo, FiSearch } from "react-icons/fi";
import { HiOutlineFilter } from "react-icons/hi";
import { FaRegFileAlt } from "react-icons/fa";
import CirclePlusIcon from "./CirclePlusIcon";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import CBC from "./CBC";
import { Result } from "./types";

const ResultEntry = () => {
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [tempStatusFilter, setTempStatusFilter] = useState(statusFilter);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const data: Result[] = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    date: "04/02/2024",
    time: "10:30 AM",
    patient: i % 2 ? "Olivia Anderson" : "Emilia Williamson",
    details: "PCC-1719 | Female",
    type: "Registered",
    doctor: "Dr. Emilia Clarke",
    bill: "PCC/25/OP/000134",
    orders: 16,
    status: i % 3 === 0 ? "Pending" : "Completed",
  }));

  // 🔍 FILTER DATA
  const filteredData = data.filter((item) => {
    const searchText = search.toLowerCase();
    return (
      Object.values(item).join(" ").toLowerCase().includes(searchText) &&
      (statusFilter === "All" || item.status === statusFilter)
    );
  });

  // 🔁 RESET PAGE ON SEARCH/FILTER CHANGE
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // 📄 PAGINATION
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const startEntry = filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, filteredData.length);

  // 🔙 OPEN CBC PAGE
  if (selectedResult) {
    return (
      <CBC
        onBack={() => setSelectedResult(null)}
        data={selectedResult}
        initialMode={selectedResult.status === "Pending" ? "edit" : "view"}
      />
    );
  }

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

          <button className="filter-btn" onClick={() => { setTempStatusFilter(statusFilter); setFilterOpen(true); }}>
            <HiOutlineFilter />
          </button>

          {/* Filter Modal */}
          <Dialog open={filterOpen} onClose={() => setFilterOpen(false)} PaperProps={{ style: { borderRadius: 20, minWidth: 340, padding: 0 } }}>
            <DialogTitle sx={{ m: 0, p: 2, fontWeight: 700, fontSize: 20, pb: 1 }}>
              Filters
              <IconButton
                aria-label="close"
                onClick={() => setFilterOpen(false)}
                sx={{ position: 'absolute', right: 8, top: 8 }}
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
            <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2, pt: 0 }}>
              <Button
                onClick={() => { setTempStatusFilter("All"); }}
                sx={{
                  fontWeight: 700,
                  borderRadius: 2,
                  bgcolor: '#f5f5f5',
                  color: '#222',
                  boxShadow: 'none',
                  border: 'none',
                  px: 4,
                  height: '40px',
                  fontSize: 14,
                  '&:hover': { bgcolor: '#ececec' },
                }}
              >
                Clear All
              </Button>
              <Button
                variant="contained"
                onClick={() => { setStatusFilter(tempStatusFilter); setFilterOpen(false); }}
                sx={{
                  fontWeight: 700,
                  borderRadius: 2,
                  bgcolor: '#444',
                  color: '#fff',
                  boxShadow: 'none',
                  border: 'none',
                  px: 4,
                  height: '40px',
                  fontSize: 14,
                  '&:hover': { bgcolor: '#222' },
                }}
              >
                Apply
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>

      {/* TABLE */}
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

        {paginatedData.map((item) => (
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
              onClick={(e) => {
                e.stopPropagation();
                setSelectedResult(item);
              }}
              style={{ cursor: "pointer" }}
            >
              {item.status === "Pending" ? <CirclePlusIcon size={20} color="#1976d2" /> : <FaRegFileAlt />}
            </span>
          </div>
        ))}
      </div>

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
    </div>
  );
};

export default ResultEntry;