import { useEffect, useState } from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export type ActivityLogFilterValues = {
  dateFilterType: "ship" | "receive";
  fromDate: string;
  toDate: string;
  shipFrom: string;
  shipTo: string;
  shipBy: string;
  receiveAt: string;
  receiveBy: string;
  service: string;
};

type ActivityLogFilterModalProps = {
  isOpen: boolean;
  initialValues: ActivityLogFilterValues;
  shipFromOptions: string[];
  shipToOptions: string[];
  shipByOptions: string[];
  receiveAtOptions: string[];
  receiveByOptions: string[];
  serviceOptions: string[];
  onClose: () => void;
  onApply: (values: ActivityLogFilterValues) => void;
  onClear: () => void;
};

function ActivityLogFilterModal({
  isOpen,
  initialValues,
  shipFromOptions,
  shipToOptions,
  shipByOptions,
  receiveAtOptions,
  receiveByOptions,
  serviceOptions,
  onClose,
  onApply,
  onClear,
}: ActivityLogFilterModalProps) {
  const [values, setValues] = useState<ActivityLogFilterValues>(initialValues);

  useEffect(() => {
    if (isOpen) {
      setValues(initialValues);
    }
  }, [initialValues, isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="receive-modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="activity-filter-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Activity logs filters"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="activity-filter-header">
          <h3>Filters</h3>
          <button type="button" className="receive-modal-close" onClick={onClose} aria-label="Close filters">
            <CloseIcon fontSize="small" />
          </button>
        </div>

        <div className="activity-filter-content">
          <h4 className="activity-filter-subtitle">Apply Date Filter</h4>
          <div className="activity-filter-radio-row">
            <label>
              <input
                type="radio"
                name="activity-date-filter"
                checked={values.dateFilterType === "ship"}
                onChange={() => setValues((prev) => ({ ...prev, dateFilterType: "ship" }))}
              />
              <span>By Ship Date</span>
            </label>
            <label>
              <input
                type="radio"
                name="activity-date-filter"
                checked={values.dateFilterType === "receive"}
                onChange={() => setValues((prev) => ({ ...prev, dateFilterType: "receive" }))}
              />
              <span>By Receive Date</span>
            </label>
          </div>

          <div className="activity-filter-grid">
            <div className="activity-filter-field">
              <label>From Date</label>
              <div className="activity-filter-input-wrap">
                <input
                  type="date"
                  value={values.fromDate}
                  onChange={(event) => setValues((prev) => ({ ...prev, fromDate: event.target.value }))}
                />
                <CalendarMonthIcon className="field-icon" fontSize="small" />
              </div>
            </div>

            <div className="activity-filter-field">
              <label>To Date</label>
              <div className="activity-filter-input-wrap">
                <input
                  type="date"
                  value={values.toDate}
                  onChange={(event) => setValues((prev) => ({ ...prev, toDate: event.target.value }))}
                />
                <CalendarMonthIcon className="field-icon" fontSize="small" />
              </div>
            </div>

            <div className="activity-filter-field">
              <label>Ship From</label>
              <div className="activity-filter-input-wrap">
                <select
                  value={values.shipFrom}
                  onChange={(event) => setValues((prev) => ({ ...prev, shipFrom: event.target.value }))}
                >
                  <option value="">All</option>
                  {shipFromOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <KeyboardArrowDownIcon className="field-icon" fontSize="small" />
              </div>
            </div>

            <div className="activity-filter-field">
              <label>Ship To</label>
              <div className="activity-filter-input-wrap">
                <select
                  value={values.shipTo}
                  onChange={(event) => setValues((prev) => ({ ...prev, shipTo: event.target.value }))}
                >
                  <option value="">All</option>
                  {shipToOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <KeyboardArrowDownIcon className="field-icon" fontSize="small" />
              </div>
            </div>

            <div className="activity-filter-field">
              <label>Ship By</label>
              <div className="activity-filter-input-wrap">
                <select
                  value={values.shipBy}
                  onChange={(event) => setValues((prev) => ({ ...prev, shipBy: event.target.value }))}
                >
                  <option value="">All</option>
                  {shipByOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <KeyboardArrowDownIcon className="field-icon" fontSize="small" />
              </div>
            </div>

            <div className="activity-filter-field">
              <label>Receive At</label>
              <div className="activity-filter-input-wrap">
                <select
                  value={values.receiveAt}
                  onChange={(event) => setValues((prev) => ({ ...prev, receiveAt: event.target.value }))}
                >
                  <option value="">All</option>
                  {receiveAtOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <KeyboardArrowDownIcon className="field-icon" fontSize="small" />
              </div>
            </div>

            <div className="activity-filter-field">
              <label>Receive By</label>
              <div className="activity-filter-input-wrap">
                <select
                  value={values.receiveBy}
                  onChange={(event) => setValues((prev) => ({ ...prev, receiveBy: event.target.value }))}
                >
                  <option value="">All</option>
                  {receiveByOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <KeyboardArrowDownIcon className="field-icon" fontSize="small" />
              </div>
            </div>

            <div className="activity-filter-field">
              <label>Service</label>
              <div className="activity-filter-input-wrap">
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

        <div className="activity-filter-actions">
          <button type="button" className="activity-filter-clear" onClick={onClear}>
            Clear All
          </button>
          <button type="button" className="activity-filter-apply" onClick={() => onApply(values)}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActivityLogFilterModal;
