import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import type { FilterModalProps } from "../../types/shipment.types";

// ─── Internal shared components ───────────────────────────────────────────────
function FField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="fmodal-field">
      <span className="fmodal-label">{label}</span>
      <div className="fmodal-input-wrap">{children}</div>
    </div>
  );
}

function FSelect({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <>
      <select className="fmodal-select" value={value} onChange={(e) => onChange(e.target.value)}>
        {children}
      </select>
      <KeyboardArrowDownIcon className="fmodal-icon" />
    </>
  );
}

function FDateField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="fmodal-field" onClick={() => (document.getElementById(id) as HTMLInputElement)?.showPicker?.()}>
      <span className="fmodal-label">{label}</span>
      <div className="fmodal-input-wrap">
        <input
          id={id}
          className="fmodal-input fmodal-date-input"
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <CalendarMonthIcon
          className="fmodal-icon"
          style={{ cursor: "pointer", pointerEvents: "auto" }}
          onClick={(e) => { e.stopPropagation(); (document.getElementById(id) as HTMLInputElement)?.showPicker?.(); }}
        />
      </div>
    </div>
  );
}

const radioStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: "6px",
  fontSize: "12px", color: "#374151", cursor: "pointer",
  fontFamily: "'Plus Jakarta Sans', sans-serif",
};

function RadioDot({ selected }: { selected: boolean }) {
  return (
    <div style={{
      width: "14px", height: "14px", borderRadius: "50%",
      border: `2px solid ${selected ? "#f97316" : "#d1d5db"}`,
      background: selected ? "#f97316" : "#ffffff",
      flexShrink: 0, display: "flex", alignItems: "center",
      justifyContent: "center", transition: "all 0.15s",
    }}>
      {selected && <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#fff" }} />}
    </div>
  );
}

function FModalShell({ title, width, onClose, children, onApply, onClear }: {
  title: string; width?: string; onClose: () => void;
  children: React.ReactNode; onApply: () => void; onClear: () => void;
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="fmodal" style={width ? { width } : undefined} onClick={(e) => e.stopPropagation()}>
        <div className="fmodal-header">
          <span className="fmodal-title">{title}</span>
          <button className="fmodal-close" onClick={onClose}>
            <CloseIcon style={{ fontSize: 16, color: "#6b7280" }} />
          </button>
        </div>
        {children}
        <div className="fmodal-footer">
          <button className="fmodal-clear" onClick={onClear}>Clear All</button>
          <button className="fmodal-apply" onClick={onApply}>Apply</button>
        </div>
      </div>
    </div>
  );
}

// ─── 1. PENDING FILTER ────────────────────────────────────────────────────────
export function PendingFilterModal({ filters, setFilters, onApply, onClear, onClose }: FilterModalProps) {
  return (
    <FModalShell title="Filters" onClose={onClose} onApply={onApply} onClear={onClear}>
      <div className="fmodal-grid">
        <FDateField id="pf-from" label="From Date" value={filters.fromDate} onChange={(v) => setFilters({ ...filters, fromDate: v })} />
        <FDateField id="pf-to"   label="To Date"   value={filters.toDate}   onChange={(v) => setFilters({ ...filters, toDate: v })} />
        <FField label="Specimen Type">
          <FSelect value={filters.specimenType} onChange={(v) => setFilters({ ...filters, specimenType: v })}>
            <option value="">All</option>
            <option value="Blood">Blood</option>
            <option value="Urine">Urine</option>
          </FSelect>
        </FField>
        <FField label="Test Name">
          <FSelect value={filters.testName} onChange={(v) => setFilters({ ...filters, testName: v })}>
            <option value="">All</option>
            <option value="CBC">CBC</option>
            <option value="Urine Culture">Urine Culture</option>
          </FSelect>
        </FField>
        <FField label="Service">
          <FSelect value={filters.service} onChange={(v) => setFilters({ ...filters, service: v })}>
            <option value="">All</option>
            <option value="Women Pathology 2026">Women Pathology 2026</option>
          </FSelect>
        </FField>
      </div>
    </FModalShell>
  );
}

// ─── 2. SHIPPED FILTER ────────────────────────────────────────────────────────
export function ShippedFilterModal({ filters, setFilters, onApply, onClear, onClose }: FilterModalProps) {
  const dateMode = filters.shippedDateMode || "ship";
  return (
    <FModalShell title="Filters" width="400px" onClose={onClose} onApply={onApply} onClear={onClear}>
      <div style={{ marginBottom: "10px" }}>
        <div style={{ fontSize: "10px", color: "#9ca3af", marginBottom: "7px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Apply Date Filter
        </div>
        <div style={{ display: "flex", gap: "18px" }}>
          <label style={radioStyle} onClick={() => setFilters({ ...filters, shippedDateMode: "ship" })}>
            <RadioDot selected={dateMode === "ship"} /> By Ship Date
          </label>
          <label style={radioStyle} onClick={() => setFilters({ ...filters, shippedDateMode: "order" })}>
            <RadioDot selected={dateMode === "order"} /> By Order Date
          </label>
        </div>
      </div>
      <div className="fmodal-grid">
        <FDateField id="sf-from" label="From Date" value={filters.fromDate} onChange={(v) => setFilters({ ...filters, fromDate: v })} />
        <FDateField id="sf-to"   label="To Date"   value={filters.toDate}   onChange={(v) => setFilters({ ...filters, toDate: v })} />
        <FField label="Ship To">
          <FSelect value={filters.shipTo} onChange={(v) => setFilters({ ...filters, shipTo: v })}>
            <option value="">All</option>
            <option value="Willowbrook">Willowbrook</option>
            <option value="Rosewood">Rosewood</option>
          </FSelect>
        </FField>
        <FField label="Specimen Type">
          <FSelect value={filters.specimenType} onChange={(v) => setFilters({ ...filters, specimenType: v })}>
            <option value="">All</option>
            <option value="Blood">Blood</option>
            <option value="Urine">Urine</option>
          </FSelect>
        </FField>
        <FField label="Test Name">
          <FSelect value={filters.testName} onChange={(v) => setFilters({ ...filters, testName: v })}>
            <option value="">All</option>
            <option value="CBC">CBC</option>
            <option value="Urine Culture">Urine Culture</option>
          </FSelect>
        </FField>
        <FField label="Service">
          <FSelect value={filters.service} onChange={(v) => setFilters({ ...filters, service: v })}>
            <option value="">All</option>
            <option value="Women Pathology 2026">Women Pathology 2026</option>
          </FSelect>
        </FField>
      </div>
    </FModalShell>
  );
}

// ─── 3. RECEIVED FILTER ───────────────────────────────────────────────────────
export function ReceivedFilterModal({ filters, setFilters, onApply, onClear, onClose }: FilterModalProps) {
  const dateMode = filters.receivedDateMode || "ship";
  return (
    <FModalShell title="Filters" width="420px" onClose={onClose} onApply={onApply} onClear={onClear}>
      <div style={{ marginBottom: "10px" }}>
        <div style={{ fontSize: "10px", color: "#9ca3af", marginBottom: "7px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Apply Date Filter
        </div>
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          <label style={radioStyle} onClick={() => setFilters({ ...filters, receivedDateMode: "ship" })}>
            <RadioDot selected={dateMode === "ship"} /> By Ship Date
          </label>
          <label style={radioStyle} onClick={() => setFilters({ ...filters, receivedDateMode: "receive" })}>
            <RadioDot selected={dateMode === "receive"} /> By Receive Date
          </label>
          <label style={radioStyle} onClick={() => setFilters({ ...filters, receivedDateMode: "order" })}>
            <RadioDot selected={dateMode === "order"} /> By Order Date
          </label>
        </div>
      </div>
      <div className="fmodal-grid">
        <FDateField id="rf-from" label="From Date" value={filters.fromDate} onChange={(v) => setFilters({ ...filters, fromDate: v })} />
        <FDateField id="rf-to"   label="To Date"   value={filters.toDate}   onChange={(v) => setFilters({ ...filters, toDate: v })} />
        <FField label="Ship To">
          <FSelect value={filters.shipTo} onChange={(v) => setFilters({ ...filters, shipTo: v })}>
            <option value="">All</option>
            <option value="Willowbrook">Willowbrook</option>
            <option value="Rosewood">Rosewood</option>
          </FSelect>
        </FField>
        <FField label="Specimen Type">
          <FSelect value={filters.specimenType} onChange={(v) => setFilters({ ...filters, specimenType: v })}>
            <option value="">All</option>
            <option value="Blood">Blood</option>
            <option value="Urine">Urine</option>
          </FSelect>
        </FField>
        <FField label="Test Name">
          <FSelect value={filters.testName} onChange={(v) => setFilters({ ...filters, testName: v })}>
            <option value="">All</option>
            <option value="CBC">CBC</option>
            <option value="Urine Culture">Urine Culture</option>
          </FSelect>
        </FField>
        <FField label="Service">
          <FSelect value={filters.service} onChange={(v) => setFilters({ ...filters, service: v })}>
            <option value="">All</option>
            <option value="Women Pathology 2026">Women Pathology 2026</option>
          </FSelect>
        </FField>
      </div>
    </FModalShell>
  );
}

// ─── 4. ACTIVITY LOGS FILTER ──────────────────────────────────────────────────
export function ActivityFilterModal({ filters, setFilters, onApply, onClear, onClose }: FilterModalProps) {
  return (
    <FModalShell title="Filters" onClose={onClose} onApply={onApply} onClear={onClear}>
      <div className="fmodal-grid">
        <FDateField id="af-from" label="From Date" value={filters.fromDate} onChange={(v) => setFilters({ ...filters, fromDate: v })} />
        <FDateField id="af-to"   label="To Date"   value={filters.toDate}   onChange={(v) => setFilters({ ...filters, toDate: v })} />
        <FField label="Ship From">
          <FSelect value={filters.shipFrom} onChange={(v) => setFilters({ ...filters, shipFrom: v })}>
            <option value="">All</option>
            <option value="Vidai, Pune">Vidai, Pune</option>
          </FSelect>
        </FField>
        <FField label="Ship To">
          <FSelect value={filters.shipTo} onChange={(v) => setFilters({ ...filters, shipTo: v })}>
            <option value="">All</option>
            <option value="Willowbrook">Willowbrook</option>
            <option value="Fertivue, Pune">Fertivue, Pune</option>
          </FSelect>
        </FField>
        <FField label="Ship By">
          <FSelect value={filters.shipBy} onChange={(v) => setFilters({ ...filters, shipBy: v })}>
            <option value="">All</option>
          </FSelect>
        </FField>
        <FField label="Shipment No.">
          <input
            className="fmodal-input"
            type="text"
            placeholder="AH-7651"
            value={filters.shipmentNo}
            onChange={(e) => setFilters({ ...filters, shipmentNo: e.target.value })}
          />
        </FField>
      </div>
    </FModalShell>
  );
}