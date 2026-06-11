import React, { useState, useEffect, useRef } from "react";
import "./ClinicAgencyLinkingModal.css";
import { agencyApi, type Agency } from "../../../services/agency.api";
import { agencyClinicApi } from "../../../services/agency-clinic.api";

interface LinkedAgency {
  linkId?: string;  // agency-clinic record id (present for already-saved links)
  agencyId: string; // the agency's own id
  name: string;
}

interface ClinicRow {
  id: string;
  clinic_name: string;
  // Each entry is one agency-clinic link record
  linked_agencies?: { id: string; agency: string; agency_name: string }[];
}

interface Props {
  row: ClinicRow;
  onClose: () => void;
  onSaved: () => void;
}

const ClinicAgencyLinkingModal: React.FC<Props> = ({ row, onClose, onSaved }) => {
  const [allAgencies, setAllAgencies] = useState<Agency[]>([]);
  const [selected, setSelected] = useState<LinkedAgency[]>([]);
  const [originalLinkIds, setOriginalLinkIds] = useState<
    { linkId: string; agencyId: string }[]
  >([]);
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingAgencies, setLoadingAgencies] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Pre-fill already-linked agencies
  useEffect(() => {
    if (Array.isArray(row.linked_agencies)) {
      const prefilled = row.linked_agencies.map((a) => ({
        linkId: a.id,
        agencyId: a.agency,
        name: a.agency_name,
      }));
      setSelected(prefilled);
      setOriginalLinkIds(
        prefilled.map((a) => ({ linkId: a.linkId!, agencyId: a.agencyId }))
      );
    }
  }, [row]);

  // Fetch all agencies for the dropdown
  useEffect(() => {
    const fetchAll = async () => {
      setLoadingAgencies(true);
      try {
        const res: any = await agencyApi.getAll();
        let results: Agency[] = [];
        if (Array.isArray(res)) results = res;
        else if (Array.isArray(res?.results)) results = res.results;
        else if (Array.isArray(res?.data)) results = res.data;
        else if (Array.isArray(res?.data?.results)) results = res.data.results;
        setAllAgencies(results);
      } catch (err) {
        console.error("Failed to fetch agencies:", err);
      } finally {
        setLoadingAgencies(false);
      }
    };
    fetchAll();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredAgencies = allAgencies.filter(
    (a) =>
      a.agency_name.toLowerCase().includes(search.toLowerCase()) &&
      !selected.find((s) => s.agencyId === String(a.id))
  );

  const handleSelect = (agency: Agency) => {
    setSelected((prev) => [
      ...prev,
      { agencyId: String(agency.id), name: agency.agency_name },
    ]);
    setSearch("");
    setDropdownOpen(false);
  };

  const handleRemove = (agencyId: string) =>
    setSelected((prev) => prev.filter((s) => s.agencyId !== agencyId));

  // ── Save: diff original vs current, delete removed, create new ──
  const handleSave = async () => {
    setError(null);
    setSaving(true);
    try {
      const originalAgencyIds = new Set(originalLinkIds.map((o) => o.agencyId));
      const currentAgencyIds = new Set(selected.map((s) => s.agencyId));

      // Links to delete (were linked, now removed)
      const toDelete = originalLinkIds.filter(
        (o) => !currentAgencyIds.has(o.agencyId)
      );

      // Links to create (newly added, no linkId yet)
      const toCreate = selected.filter(
        (s) => !s.linkId && !originalAgencyIds.has(s.agencyId)
      );

      await Promise.all([
        ...toDelete.map((o) => agencyClinicApi.delete(o.linkId)),
        ...toCreate.map((s) =>
          agencyClinicApi.create({ clinic: row.id, agency: s.agencyId })
        ),
      ]);

      onSaved();
      onClose();
    } catch (err: any) {
      const djangoError = err?.response?.data;
      if (djangoError && typeof djangoError === "object") {
        const messages = Object.entries(djangoError)
          .map(([field, msgs]) =>
            Array.isArray(msgs)
              ? `${field}: ${msgs.join(", ")}`
              : `${field}: ${msgs}`
          )
          .join(" | ");
        setError(messages);
      } else {
        setError("Failed to save. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="cal-overlay" onClick={onClose}>
      <div className="cal-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cal-header">
          <h3>Clinic-Agency Linking</h3>
          <button className="cal-close" onClick={onClose}>×</button>
        </div>

        {/* Clinic Name — read-only */}
        <div className="cal-field">
          <label>Clinic Name</label>
          <div className="cal-readonly">{row.clinic_name}</div>
        </div>

        {/* Agency search & select */}
        <div className="cal-field" ref={dropdownRef}>
          <label>Agency</label>
          <div className="cal-select-box">
            <input
              className="cal-select-input"
              placeholder={
                loadingAgencies ? "Loading agencies…" : "Search & select Agency"
              }
              disabled={loadingAgencies}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setDropdownOpen(true);
              }}
              onClick={() => setDropdownOpen(true)}
            />
            <span className="cal-chevron">&#8964;</span>
          </div>

          {dropdownOpen && !loadingAgencies && (
            <div className="cal-dropdown">
              {filteredAgencies.length === 0 ? (
                <div className="cal-dropdown-empty">No agencies found</div>
              ) : (
                filteredAgencies.map((a) => (
                  <div
                    key={a.id}
                    className="cal-dropdown-item"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(a);
                    }}
                  >
                    {a.agency_name}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Selected tags */}
        {selected.length > 0 && (
          <div className="cal-tags">
            {selected.map((s) => (
              <span key={s.agencyId} className="cal-tag">
                {s.name}
                <button
                  className="cal-tag-remove"
                  onClick={() => handleRemove(s.agencyId)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Error */}
        {error && <div className="cal-error">{error}</div>}

        {/* Footer */}
        <div className="cal-footer">
          <button className="cal-btn cal-cancel" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button className="cal-btn cal-save" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicAgencyLinkingModal;