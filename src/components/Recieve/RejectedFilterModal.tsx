import { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export type RejectedFilterValues = {
  dateFilterType: "ship" | "receive";
  fromDate: string;
  toDate: string;
  specimenType: string;
  testName: string;
  service: string;
};

type RejectedFilterModalProps = {
  isOpen: boolean;
  initialValues: RejectedFilterValues;
  specimenOptions: string[];
  testOptions: string[];
  serviceOptions: string[];
  onClose: () => void;
  onApply: (values: RejectedFilterValues) => void;
  onClear: () => void;
};

function RejectedFilterModal({
  isOpen,
  initialValues,
  specimenOptions,
  testOptions,
  serviceOptions,
  onClose,
  onApply,
  onClear,
}: RejectedFilterModalProps) {
  const [values, setValues] = useState<RejectedFilterValues>(initialValues);

  const fromDateInputRef = useRef<HTMLInputElement>(null);
  const toDateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setValues(initialValues);
    }
  }, [initialValues, isOpen]);

  if (!isOpen) {
    return null;
  }

  const openDatePicker = (ref: React.RefObject<HTMLInputElement>) => {
    const el = ref.current;
    if (!el) return;
    if (typeof el.showPicker === "function") {
      el.showPicker();
    } else {
      el.focus();
      el.click();
    }
  };

  const formatDateDisplay = (iso: string) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="receive-modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="shipped-filter-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Rejected filters"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="shipped-filter-header">
          <h3>Filters</h3>
          <button type="button" className="receive-modal-close" onClick={onClose} aria-label="Close filters">
            <CloseIcon fontSize="small" />
          </button>
        </div>

        <div className="shipped-filter-content">
          <h4 className="activity-filter-subtitle">Apply Date Filter</h4>
          <div className="activity-filter-radio-row">
            <label className="activity-radio-option">
              <span
                className={`activity-radio-dot ${values.dateFilterType === "ship" ? "checked" : ""}`}
                onClick={() => setValues((prev) => ({ ...prev, dateFilterType: "ship" }))}
              />
              <span onClick={() => setValues((prev) => ({ ...prev, dateFilterType: "ship" }))}>
                By Ship Date
              </span>
            </label>
            <label className="activity-radio-option">
              <span
                className={`activity-radio-dot ${values.dateFilterType === "receive" ? "checked" : ""}`}
                onClick={() => setValues((prev) => ({ ...prev, dateFilterType: "receive" }))}
              />
              <span onClick={() => setValues((prev) => ({ ...prev, dateFilterType: "receive" }))}>
                By Receive Date
              </span>
            </label>
          </div>

          <div className="shipped-filter-grid">
            <div className="shipped-filter-field">
              <label>From Date</label>
              <div className="shipped-filter-input-wrap">
                <input
                  type="text"
                  value={formatDateDisplay(values.fromDate)}
                  placeholder="DD/MM/YYYY"
                  readOnly
                  style={{ cursor: "pointer" }}
                  onClick={() => openDatePicker(fromDateInputRef)}
                />
                <input
                  ref={fromDateInputRef}
                  type="date"
                  value={values.fromDate}
                  onChange={(event) => setValues((prev) => ({ ...prev, fromDate: event.target.value }))}
                  style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 0 }}
                />
                <CalendarMonthIcon
                  className="field-icon"
                  fontSize="small"
                  style={{ cursor: "pointer" }}
                  onClick={() => openDatePicker(fromDateInputRef)}
                />
              </div>
            </div>

            <div className="shipped-filter-field">
              <label>To Date</label>
              <div className="shipped-filter-input-wrap">
                <input
                  type="text"
                  value={formatDateDisplay(values.toDate)}
                  placeholder="DD/MM/YYYY"
                  readOnly
                  style={{ cursor: "pointer" }}
                  onClick={() => openDatePicker(toDateInputRef)}
                />
                <input
                  ref={toDateInputRef}
                  type="date"
                  value={values.toDate}
                  onChange={(event) => setValues((prev) => ({ ...prev, toDate: event.target.value }))}
                  style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 0 }}
                />
                <CalendarMonthIcon
                  className="field-icon"
                  fontSize="small"
                  style={{ cursor: "pointer" }}
                  onClick={() => openDatePicker(toDateInputRef)}
                />
              </div>
            </div>

            <div className="shipped-filter-field">
              <label>Specimen Type</label>
              <div className="shipped-filter-input-wrap">
                <select
                  value={values.specimenType}
                  onChange={(event) => setValues((prev) => ({ ...prev, specimenType: event.target.value }))}
                >
                  <option value="">All</option>
                  {specimenOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <KeyboardArrowDownIcon className="field-icon" fontSize="small" />
              </div>
            </div>

            <div className="shipped-filter-field">
              <label>Test Name</label>
              <div className="shipped-filter-input-wrap">
                <select
                  value={values.testName}
                  onChange={(event) => setValues((prev) => ({ ...prev, testName: event.target.value }))}
                >
                  <option value="">All</option>
                  {testOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <KeyboardArrowDownIcon className="field-icon" fontSize="small" />
              </div>
            </div>

            <div className="shipped-filter-field full-width">
              <label>Service</label>
              <div className="shipped-filter-input-wrap">
                <select
                  value={values.service}
                  onChange={(event) => setValues((prev) => ({ ...prev, service: event.target.value }))}
                >
                  <option value="">All</option>
                  {serviceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <KeyboardArrowDownIcon className="field-icon" fontSize="small" />
              </div>
            </div>
          </div>
        </div>

        <div className="shipped-filter-actions">
          <button type="button" className="shipped-filter-clear" onClick={onClear}>
            Clear All
          </button>
          <button type="button" className="shipped-filter-apply" onClick={() => onApply(values)}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export default RejectedFilterModal;