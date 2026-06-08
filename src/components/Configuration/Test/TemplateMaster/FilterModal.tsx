import { useState, useEffect } from "react";
import styles from "./FilterModal.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

export type FilterValues = {
  templateFor: string;
  gender: string;
  userType: string;
  templateFormat: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterValues) => void;
  onClearAll?: () => void;
  initialValues?: FilterValues;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const TEMPLATE_FOR_OPTIONS = ["", "LEAD", "PATHOLOGY", "RADIOLOGY", "EXAMINATION", "INVESTIGATION", "SURGERY", "OUTCOME"];
const TEMPLATE_FOR_LABELS: Record<string, string> = {
  "": "Select", LEAD: "Lead", PATHOLOGY: "Pathology", RADIOLOGY: "Radiology",
  EXAMINATION: "Examination", INVESTIGATION: "Investigation", SURGERY: "Surgery", OUTCOME: "Outcome",
};
const GENDER_OPTIONS = ["", "MALE", "FEMALE", "BOTH"];
const GENDER_LABELS: Record<string, string> = { "": "Select", MALE: "Male", FEMALE: "Female", BOTH: "Both" };
const USER_TYPE_OPTIONS = ["", "PATHOLOGIST", "RADIOLOGIST"];
const USER_TYPE_LABELS: Record<string, string> = { "": "Select", PATHOLOGIST: "Pathologist", RADIOLOGIST: "Radiologist" };
const TEMPLATE_FORMAT_OPTIONS = ["", "TEXT", "FORM"];
const TEMPLATE_FORMAT_LABELS: Record<string, string> = { "": "Select", TEXT: "Text", FORM: "Form" };

const defaultFilters: FilterValues = { templateFor: "", gender: "", userType: "", templateFormat: "" };

// ─── Component ────────────────────────────────────────────────────────────────

export default function FilterModal({
  isOpen,
  onClose,
  onApply,
  onClearAll,
  initialValues = defaultFilters,
}: Props) {
  const [filters, setFilters] = useState<FilterValues>(initialValues);

  useEffect(() => {
    setFilters(initialValues);
  }, [initialValues.templateFor, initialValues.gender, initialValues.userType, initialValues.templateFormat]);

  if (!isOpen) return null;

  const set = (field: keyof FilterValues, value: string) =>
    setFilters((prev) => ({ ...prev, [field]: value }));

  const handleClearAll = () => {
    setFilters(defaultFilters);
    onClearAll?.();
    onClose();
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Filter By</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
              <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <hr className={styles.divider} />

        <div className={styles.body}>
          {/* Template For */}
          <div className={styles.fieldWrap}>
            <div className={styles.fieldBorder}>
              <span className={styles.floatLabel}>Template For</span>
              <select className={styles.floatSelect} value={filters.templateFor} onChange={(e) => set("templateFor", e.target.value)}>
                {TEMPLATE_FOR_OPTIONS.map((o) => <option key={o} value={o}>{TEMPLATE_FOR_LABELS[o]}</option>)}
              </select>
            </div>
          </div>

          {/* Gender */}
          <div className={styles.fieldWrap}>
            <div className={styles.fieldBorder}>
              <span className={styles.floatLabel}>Gender</span>
              <select className={styles.floatSelect} value={filters.gender} onChange={(e) => set("gender", e.target.value)}>
                {GENDER_OPTIONS.map((o) => <option key={o} value={o}>{GENDER_LABELS[o]}</option>)}
              </select>
            </div>
          </div>

          {/* User Type */}
          <div className={styles.fieldWrap}>
            <div className={styles.fieldBorder}>
              <span className={styles.floatLabel}>User Type</span>
              <select className={styles.floatSelect} value={filters.userType} onChange={(e) => set("userType", e.target.value)}>
                {USER_TYPE_OPTIONS.map((o) => <option key={o} value={o}>{USER_TYPE_LABELS[o]}</option>)}
              </select>
            </div>
          </div>

          {/* Template Format */}
          <div className={styles.fieldWrap}>
            <div className={styles.fieldBorder}>
              <span className={styles.floatLabel}>Template Format</span>
              <select className={styles.floatSelect} value={filters.templateFormat} onChange={(e) => set("templateFormat", e.target.value)}>
                {TEMPLATE_FORMAT_OPTIONS.map((o) => <option key={o} value={o}>{TEMPLATE_FORMAT_LABELS[o]}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.clearBtn} onClick={handleClearAll}>Clear All</button>
          <button className={styles.applyBtn} onClick={handleApply}>Apply</button>
        </div>
      </div>
    </div>
  );
}