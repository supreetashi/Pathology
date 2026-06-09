import React, { useEffect, useState, useCallback } from "react";
import "./Agency.css";
import { FiSearch, FiPlus } from "react-icons/fi";
import AddNewAgency from "./Add_agency";
import editicon from "../../../assets/icons/edit.svg";
import { agencyApi, type Agency } from "../../../services/agency.api";

interface Linking {
  id: number;
  clinic: string;
  agencyCount: number;
}

const AgencyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"agency" | "linking">("agency");
  const [page, setPage] = useState<"list" | "add">("list");
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);

  const [agencyData, setAgencyData] = useState<Agency[]>([]);
  const [agencyTotal, setAgencyTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [linkingData] = useState<Linking[]>([
    { id: 1, clinic: "Apollo Clinic", agencyCount: 4 },
    { id: 2, clinic: "Fortis", agencyCount: 2 },
    { id: 3, clinic: "Manipal Hospital", agencyCount: 5 },
    { id: 4, clinic: "Aster Clinic", agencyCount: 3 },
    { id: 5, clinic: "Narayana Health", agencyCount: 6 },
  ]);

  const [agencySearch, setAgencySearch] = useState("");
  const [linkingSearch, setLinkingSearch] = useState("");
  const [agencyPage, setAgencyPage] = useState(1);
  const [linkingPage, setLinkingPage] = useState(1);

  const itemsPerPage = 10;

  // ── Fetch agencies ───────────────────────────────────
  const fetchAgencies = useCallback(async (search?: string) => {
    setLoading(true);
    try {
      const res: any = await agencyApi.getAll(search);

      // Handle every possible shape http.ts might return
      let results: Agency[] = [];
      let total = 0;

      if (!res) {
        results = [];
        total = 0;
      } else if (Array.isArray(res)) {
        // http returns plain array
        results = res;
        total = res.length;
      } else if (Array.isArray(res?.results)) {
        // http returns {count, results} directly
        results = res.results;
        total = res.count ?? res.results.length;
      } else if (Array.isArray(res?.data)) {
        // axios shape: {data: Agency[]}
        results = res.data;
        total = res.data.length;
      } else if (Array.isArray(res?.data?.results)) {
        // axios + paginated: {data: {count, results}}
        results = res.data.results;
        total = res.data.count ?? res.data.results.length;
      } else {
        results = [];
        total = 0;
      }

      setAgencyData(results);
      setAgencyTotal(total);
    } catch (err) {
      console.error("Failed to fetch agencies:", err);
      setAgencyData([]);
      setAgencyTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgencies();
  }, [fetchAgencies]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAgencies(agencySearch || undefined);
      setAgencyPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [agencySearch, fetchAgencies]);

  // ── Toggle status optimistic ─────────────────────────
  const toggleStatus = async (agency: Agency) => {
    setAgencyData((prev) =>
      prev.map((item) =>
        item.id === agency.id ? { ...item, status: !item.status } : item
      )
    );
    try {
      await agencyApi.update(agency.id, { status: !agency.status });
    } catch (err) {
      console.error("Failed to toggle status:", err);
      setAgencyData((prev) =>
        prev.map((item) =>
          item.id === agency.id ? { ...item, status: agency.status } : item
        )
      );
    }
  };

  // ── Navigation ───────────────────────────────────────
  const handleAddNew = () => {
    setEditingAgency(null);
    setPage("add");
  };

  const handleEdit = (agency: Agency) => {
    setEditingAgency(agency);
    setPage("add");
  };

  const handleFormBack = () => {
    setEditingAgency(null);
    setPage("list");
  };

  const handleFormSaved = () => {
    setEditingAgency(null);
    setPage("list");
    fetchAgencies(agencySearch || undefined);
  };

  // ── Linking (client-side) ────────────────────────────
  const filteredLinking = linkingData.filter((l) =>
    l.clinic.toLowerCase().includes(linkingSearch.toLowerCase())
  );
  const linkingTotalPages = Math.max(
    1,
    Math.ceil(filteredLinking.length / itemsPerPage)
  );
  const linkingDataPaginated = filteredLinking.slice(
    (linkingPage - 1) * itemsPerPage,
    linkingPage * itemsPerPage
  );
  useEffect(() => setLinkingPage(1), [linkingSearch]);

  // ── Agency pagination ────────────────────────────────
  const agencyTotalPages = Math.max(1, Math.ceil(agencyTotal / itemsPerPage));

  return (
    <div className="agency-container">
      {page === "list" ? (
        <>
          {/* Tabs */}
          <div className="tabs">
            <div
              className={`tab ${activeTab === "agency" ? "active" : ""}`}
              onClick={() => setActiveTab("agency")}
            >
              Agency
            </div>
            <div
              className={`tab ${activeTab === "linking" ? "active" : ""}`}
              onClick={() => setActiveTab("linking")}
            >
              Agency-Clinic Linking
            </div>
          </div>

          {/* Header */}
          <div className="header-row">
            <h3>
              {activeTab === "agency"
                ? `List of Agency (${agencyTotal})`
                : `Agency-Clinic Linking (${filteredLinking.length})`}
            </h3>

            <div className="actions">
              <div className="search-box">
                <FiSearch />
                <input
                  placeholder={
                    activeTab === "agency"
                      ? "Search by Code, Name"
                      : "Search by Clinic"
                  }
                  value={
                    activeTab === "agency" ? agencySearch : linkingSearch
                  }
                  onChange={(e) =>
                    activeTab === "agency"
                      ? setAgencySearch(e.target.value)
                      : setLinkingSearch(e.target.value)
                  }
                />
              </div>

              {activeTab === "agency" && (
                <button className="add-btn" onClick={handleAddNew}>
                  <FiPlus /> Add New Agency
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="table">
            <div className="table-head">
              {activeTab === "agency" ? (
                <>
                  <span>Code</span>
                  <span>Name</span>
                  <span>Country</span>
                  <span>City</span>
                  <span>Services</span>
                  <span>Status</span>
                </>
              ) : (
                <>
                  <span>Clinic Name</span>
                  <span>No. of Agencies Linked</span>
                  <span>Action</span>
                </>
              )}
            </div>

            {/* Loading */}
            {loading && (
              <div className="table-row">
                <span style={{ padding: "16px", color: "#888" }}>
                  Loading...
                </span>
              </div>
            )}

            {/* Agency rows */}
            {!loading &&
              activeTab === "agency" &&
              agencyData.length > 0 &&
              agencyData.map((item) => (
                <div className="table-row" key={item.id}>
                  <span>{item.agency_code}</span>
                  <span>{item.agency_name}</span>
                  <span>{item.country ?? "—"}</span>
                  <span>{item.city ?? "—"}</span>
                  <span>
                    {Array.isArray(item.agency_services)
                      ? item.agency_services.length
                      : 0}
                  </span>
                  <div className="status-cell">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={item.status}
                        onChange={() => toggleStatus(item)}
                      />
                      <span className="slider"></span>
                    </label>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(item)}
                    >
                      <img src={editicon} alt="edit" />
                    </button>
                  </div>
                </div>
              ))}

            {/* Empty state */}
            {!loading &&
              activeTab === "agency" &&
              agencyData.length === 0 && (
                <div
                  className="table-row"
                  style={{ justifyContent: "center", color: "#aaa" }}
                >
                  No agencies found.
                </div>
              )}

            {/* Linking rows */}
            {!loading &&
              activeTab === "linking" &&
              linkingDataPaginated.map((item) => (
                <div className="table-row" key={item.id}>
                  <span>{item.clinic}</span>
                  <span>{item.agencyCount}</span>
                  <div className="status-cell">
                    <button className="edit-btn">
                      <img src={editicon} alt="edit" />
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* Footer */}
          <div className="footer">
            <div className="page-info">
              {(() => {
                const currentPage =
                  activeTab === "agency" ? agencyPage : linkingPage;
                const totalItems =
                  activeTab === "agency" ? agencyTotal : linkingData.length;
                const start = (currentPage - 1) * itemsPerPage + 1;
                const end = Math.min(currentPage * itemsPerPage, totalItems);
                if (totalItems === 0) return "No entries";
                return `Showing ${start} to ${end} of ${totalItems} entries`;
              })()}
            </div>

            <div className="pagination">
              <button
                className="nav-btn"
                disabled={
                  activeTab === "agency"
                    ? agencyPage === 1
                    : linkingPage === 1
                }
                onClick={() =>
                  activeTab === "agency"
                    ? setAgencyPage((p) => p - 1)
                    : setLinkingPage((p) => p - 1)
                }
              >
                ‹
              </button>

              {Array.from({
                length:
                  activeTab === "agency"
                    ? agencyTotalPages
                    : linkingTotalPages,
              }).map((_, index) => {
                const pageNumber = index + 1;
                const currentPage =
                  activeTab === "agency" ? agencyPage : linkingPage;
                return (
                  <button
                    key={pageNumber}
                    className={`page-btn ${
                      currentPage === pageNumber ? "active" : ""
                    }`}
                    onClick={() =>
                      activeTab === "agency"
                        ? setAgencyPage(pageNumber)
                        : setLinkingPage(pageNumber)
                    }
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                className="nav-btn"
                disabled={
                  activeTab === "agency"
                    ? agencyPage === agencyTotalPages
                    : linkingPage === linkingTotalPages
                }
                onClick={() =>
                  activeTab === "agency"
                    ? setAgencyPage((p) => p + 1)
                    : setLinkingPage((p) => p + 1)
                }
              >
                ›
              </button>
            </div>
          </div>
        </>
      ) : (
        <AddNewAgency
          onBack={handleFormBack}
          onSaved={handleFormSaved}
          editingAgency={editingAgency}
        />
      )}
    </div>
  );
};

export default AgencyPage;