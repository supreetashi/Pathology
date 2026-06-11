import React, { useEffect, useState, useCallback } from "react";
import "./Agency.css";
import { FiSearch, FiPlus } from "react-icons/fi";
import AddNewAgency from "./Add_agency";
import ClinicAgencyLinkingModal from "./ClinicAgencyLinkingModal";
import editicon from "../../../assets/icons/edit.svg";
import { agencyApi, type Agency } from "../../../services/agency.api";
import { agencyClinicApi } from "../../../services/agency-clinic.api";

interface ClinicRow {
  id: string;
  clinic_name: string;
  agency_count?: number;
  linked_agencies?: { id: string; agency: string; agency_name: string }[];
}

const AgencyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"agency" | "linking">("agency");
  const [page, setPage] = useState<"list" | "add">("list");
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);

  const [agencyData, setAgencyData] = useState<Agency[]>([]);
  const [agencyTotal, setAgencyTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [linkingData, setLinkingData] = useState<ClinicRow[]>([]);
  const [linkingLoading, setLinkingLoading] = useState(false);

  const [agencySearch, setAgencySearch] = useState("");
  const [linkingSearch, setLinkingSearch] = useState("");
  const [agencyPage, setAgencyPage] = useState(1);
  const [linkingPage, setLinkingPage] = useState(1);

  // Modal state
  const [linkingModalRow, setLinkingModalRow] = useState<ClinicRow | null>(null);

  const itemsPerPage = 10;

  // ── Fetch agencies ───────────────────────────────────
  const fetchAgencies = useCallback(async (search?: string) => {
    setLoading(true);
    try {
      const res: any = await agencyApi.getAll(search);
      let results: Agency[] = [];
      let total = 0;
      if (!res) {
        results = [];
        total = 0;
      } else if (Array.isArray(res)) {
        results = res;
        total = res.length;
      } else if (Array.isArray(res?.results)) {
        results = res.results;
        total = res.count ?? res.results.length;
      } else if (Array.isArray(res?.data)) {
        results = res.data;
        total = res.data.length;
      } else if (Array.isArray(res?.data?.results)) {
        results = res.data.results;
        total = res.data.count ?? res.data.results.length;
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

  // ── Fetch clinic-agency links (flat pairs) and group by clinic ──
  const fetchAgencyClinicLinks = useCallback(async (search?: string) => {
    setLinkingLoading(true);
    try {
      const res: any = await agencyClinicApi.getAll(search);
      const rows: any[] =
        res?.data?.results ?? res?.results ?? res?.data ?? res ?? [];

      const grouped = new Map<string, ClinicRow>();

      rows.forEach((row) => {
        const clinicId = row.clinic;
        if (!grouped.has(clinicId)) {
          grouped.set(clinicId, {
            id: clinicId,
            clinic_name: row.clinic_name,
            agency_count: 0,
            linked_agencies: [],
          });
        }
        const entry = grouped.get(clinicId)!;
        entry.linked_agencies!.push({
          id: row.id,
          agency: row.agency,
          agency_name: row.agency_name,
        });
        entry.agency_count = entry.linked_agencies!.length;
      });

      setLinkingData(Array.from(grouped.values()));
    } catch (err) {
      console.error(err);
      setLinkingData([]);
    } finally {
      setLinkingLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgencies();
  }, [fetchAgencies]);

  // Debounced agency search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAgencies(agencySearch || undefined);
      setAgencyPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [agencySearch, fetchAgencies]);

  // Fetch links when tab becomes active or search changes
  useEffect(() => {
    if (activeTab === "linking") {
      fetchAgencyClinicLinks(linkingSearch || undefined);
    }
  }, [activeTab, linkingSearch, fetchAgencyClinicLinks]);

  useEffect(() => setLinkingPage(1), [linkingSearch]);

  // ── Toggle agency status (optimistic) ───────────────
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

  // ── Linking pagination (client-side filter) ──────────
  const filteredLinking = linkingData.filter((l) =>
    l.clinic_name?.toLowerCase().includes(linkingSearch.toLowerCase())
  );
  const linkingTotalPages = Math.max(1, Math.ceil(filteredLinking.length / itemsPerPage));
  const linkingDataPaginated = filteredLinking.slice(
    (linkingPage - 1) * itemsPerPage,
    linkingPage * itemsPerPage
  );

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
                : `List of Clinics (${filteredLinking.length})`}
            </h3>

            <div className="actions">
              <div className="search-box">
                <FiSearch />
                <input
                  placeholder={
                    activeTab === "agency"
                      ? "Search by Code, Name"
                      : "Search by Clinic Name"
                  }
                  value={activeTab === "agency" ? agencySearch : linkingSearch}
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
            {(loading || linkingLoading) && (
              <div className="table-row">
                <span style={{ padding: "16px", color: "#888" }}>Loading...</span>
              </div>
            )}

            {/* Agency rows */}
            {!loading &&
              activeTab === "agency" &&
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
                    <button className="edit-btn" onClick={() => handleEdit(item)}>
                      <img src={editicon} alt="edit" />
                    </button>
                  </div>
                </div>
              ))}

            {/* Agency empty state */}
            {!loading && activeTab === "agency" && agencyData.length === 0 && (
              <div className="table-row" style={{ justifyContent: "center", color: "#aaa" }}>
                No agencies found.
              </div>
            )}

            {/* Linking rows */}
            {!linkingLoading &&
              activeTab === "linking" &&
              linkingDataPaginated.map((item) => (
                <div className="table-row" key={item.id}>
                  <span>{item.clinic_name}</span>
                  <span>{item.agency_count ?? 0}</span>
                  <div className="status-cell">
                    <button
                      className="edit-btn"
                      onClick={() => setLinkingModalRow(item)}
                    >
                      <img src={editicon} alt="edit" />
                    </button>
                  </div>
                </div>
              ))}

            {/* Linking empty state */}
            {!linkingLoading && activeTab === "linking" && filteredLinking.length === 0 && (
              <div className="table-row" style={{ justifyContent: "center", color: "#aaa" }}>
                No clinics found.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="footer">
            <div className="page-info">
              {(() => {
                const currentPage = activeTab === "agency" ? agencyPage : linkingPage;
                const totalItems = activeTab === "agency" ? agencyTotal : filteredLinking.length;
                const start = (currentPage - 1) * itemsPerPage + 1;
                const end = Math.min(currentPage * itemsPerPage, totalItems);
                if (totalItems === 0) return "No entries";
                return `Showing ${start} to ${end} of ${totalItems} entries`;
              })()}
            </div>

            <div className="pagination">
              <button
                className="nav-btn"
                disabled={activeTab === "agency" ? agencyPage === 1 : linkingPage === 1}
                onClick={() =>
                  activeTab === "agency"
                    ? setAgencyPage((p) => p - 1)
                    : setLinkingPage((p) => p - 1)
                }
              >
                ‹
              </button>

              {Array.from({
                length: activeTab === "agency" ? agencyTotalPages : linkingTotalPages,
              }).map((_, index) => {
                const pageNumber = index + 1;
                const currentPage = activeTab === "agency" ? agencyPage : linkingPage;
                return (
                  <button
                    key={pageNumber}
                    className={`page-btn ${currentPage === pageNumber ? "active" : ""}`}
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

      {/* Clinic-Agency Linking Modal */}
      {linkingModalRow && (
        <ClinicAgencyLinkingModal
          row={linkingModalRow}
          onClose={() => setLinkingModalRow(null)}
          onSaved={() => fetchAgencyClinicLinks(linkingSearch || undefined)}
        />
      )}
    </div>
  );
};

export default AgencyPage;