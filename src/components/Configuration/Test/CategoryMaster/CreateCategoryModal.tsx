import { useState, useRef, useEffect } from "react";
import styles from "./CreateCategoryModal.module.css";
import CloseCircleIcon from "../../../../assets/icons/close-circle.svg";

// ─── Types ────────────────────────────────────────────────────────────────────

type TestItem = {
  id: string;
  name: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    categoryCode: string;
    categoryName: string;
    testIds: string[];
  }) => void;
  existingCodes?: string[];
  initialData?: {
    code: string;
    name: string;
    testIds?: string[];
  };
  availableTests?: TestItem[];
};

// ─── Tests Dropdown ───────────────────────────────────────────────────────────

function TestsDropdown({
  items,
  selectedIds,
  onToggle,
}: {
  items: TestItem[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  return (
    <div className={styles.dropdownWrapper} ref={ref}>
      <div
        className={styles.fieldBorder}
        onClick={() => setOpen((o) => !o)}
        style={{ cursor: "pointer" }}
      >
        <span className={styles.floatLabel}>Tests</span>
        <div className={styles.dropdownTriggerInner}>
          <span className={styles.dropdownPlaceholder}>Select Test</span>
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path fill="#9e9e9e" d="M6 8L1 3h10z" />
          </svg>
        </div>
      </div>

      {open && (
        <div className={styles.dropdownPanel}>
          <div className={styles.dropdownList} ref={listRef}>
            {items.length === 0 ? (
              <div style={{ padding: "0.75em 1em", color: "#9e9e9e", fontSize: "0.88em" }}>
                No tests available
              </div>
            ) : (
              items.map((item, idx) => (
                <div key={item.id}>
                  <div
                    className={styles.dropdownRow}
                    onClick={() => onToggle(item.id)}
                  >
                    <span
                      className={
                        selectedIds.includes(item.id)
                          ? styles.roundCheckOn
                          : styles.roundCheckOff
                      }
                    >
                      {selectedIds.includes(item.id) && (
                        <svg width="11" height="11" viewBox="0 0 12 12">
                          <polyline
                            points="2,6 5,9 10,3"
                            stroke="#2E7D32"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                          />
                        </svg>
                      )}
                    </span>
                    <span className={styles.dropdownRowLabel}>{item.name}</span>
                  </div>
                  {idx < items.length - 1 && (
                    <div className={styles.dropdownDivider} />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CreateCategoryModal({
  isOpen,
  onClose,
  onSave,
  existingCodes = [],
  initialData,
  availableTests = [],
}: Props) {
  const [categoryCode, setCategoryCode] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [selectedTestIds, setSelectedTestIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<{
    categoryCode?: string;
    categoryName?: string;
    testIds?: string;
  }>({});

  useEffect(() => {
    if (!isOpen) {
      setCategoryCode("");
      setCategoryName("");
      setSelectedTestIds([]);
      setErrors({});
      return;
    }

    if (initialData) {
      setCategoryCode(initialData.code);
      setCategoryName(initialData.name);
      setSelectedTestIds(initialData.testIds ?? []);
      setErrors({});
    } else {
      setCategoryCode("");
      setCategoryName("");
      setSelectedTestIds([]);
      setErrors({});
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const toggleTest = (id: string) => {
    setSelectedTestIds((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      if (errors.testIds) setErrors((e) => ({ ...e, testIds: "" }));
      return updated;
    });
  };

  const removeTest = (id: string) => {
    setSelectedTestIds((prev) => {
      const updated = prev.filter((x) => x !== id);
      if (errors.testIds) setErrors((e) => ({ ...e, testIds: "" }));
      return updated;
    });
  };

  const handleSave = () => {
    const trimmedCode = categoryCode.trim();
    const trimmedName = categoryName.trim();

    const nextErrors: {
      categoryCode?: string;
      categoryName?: string;
      testIds?: string;
    } = {};

    if (!trimmedCode) {
      nextErrors.categoryCode = "Category code is required";
    } else if (
      existingCodes
        .filter((code) => code !== initialData?.code)
        .some((code) => code.trim().toLowerCase() === trimmedCode.toLowerCase())
    ) {
      nextErrors.categoryCode = "Category code already exists";
    }

    if (!trimmedName) {
      nextErrors.categoryName = "Category name is required";
    }

    if (selectedTestIds.length === 0) {
      nextErrors.testIds = "Select at least one test";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSave({
      categoryCode: trimmedCode,
      categoryName: trimmedName,
      testIds: selectedTestIds,
    });

    onClose();
  };

  const selectedTests = availableTests.filter((t) =>
    selectedTestIds.includes(t.id),
  );

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {initialData ? "Edit Category" : "Create New Category"}
          </h2>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
              <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          <div>
            <div className={styles.fieldBorder}>
              <span className={styles.floatLabel}>Category Code</span>
              <input
                className={styles.floatInput}
                value={categoryCode}
                onChange={(e) => {
                  setCategoryCode(e.target.value);
                  if (errors.categoryCode) setErrors((prev) => ({ ...prev, categoryCode: "" }));
                }}
                placeholder="CN-041421"
              />
            </div>
            {errors.categoryCode && (
              <p style={{ marginTop: "6px", fontSize: "12px", color: "#d32f2f" }}>
                {errors.categoryCode}
              </p>
            )}
          </div>

          <div>
            <div className={styles.fieldBorder}>
              <span className={styles.floatLabel}>Category Name</span>
              <input
                className={styles.floatInput}
                value={categoryName}
                onChange={(e) => {
                  setCategoryName(e.target.value);
                  if (errors.categoryName) setErrors((prev) => ({ ...prev, categoryName: "" }));
                }}
                placeholder="Biochemistry"
              />
            </div>
            {errors.categoryName && (
              <p style={{ marginTop: "6px", fontSize: "12px", color: "#d32f2f" }}>
                {errors.categoryName}
              </p>
            )}
          </div>

          <div>
            <TestsDropdown
              items={availableTests}
              selectedIds={selectedTestIds}
              onToggle={toggleTest}
            />
            {errors.testIds && (
              <p style={{ marginTop: "6px", fontSize: "12px", color: "#d32f2f" }}>
                {errors.testIds}
              </p>
            )}
          </div>

          {selectedTests.length > 0 && (
            <div className={styles.chipsArea}>
              {selectedTests.map((t) => (
                <span key={t.id} className={styles.chip}>
                  {t.name}
                  <button
                    type="button"
                    className={styles.chipRemove}
                    onClick={() => removeTest(t.id)}
                  >
                    <img src={CloseCircleIcon} alt="remove" width={16} height={16} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={styles.saveBtn} onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}