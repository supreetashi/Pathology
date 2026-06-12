import { useState, useRef, useEffect } from "react";
import styles from "../../../styles/Configuration/SampleTube/CreateSampleTubeModal.module.css";
import stylesTest from "../Test/TestMaster/CreateTestPage.module.css";
import CloseCircleIcon from "../../../assets/icons/close-circle.svg";
import { selectLaboratoryTests, fetchLaboratoryTests } from "../../../store/laboratoryTestSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store";
import { useSelector } from "react-redux";
import { http } from "../../../services/http";
import { PathologyProfileItem } from "../../../types/pathologyProfile.types";

interface Props {
  isOpen: boolean;
  onClose: () => void;

  onSave: (data: {
    service_name: string;
    tests: string[];
    clinic: string;
  }) => void;

  editingProfile?: PathologyProfileItem | null;
}

type SelectableItem = {
  id: string;
  code: string;
  name: string;
};

function FigmaDropdown({
  placeholder,
  items,
  selectedIds,
  onToggle,
}: {
  placeholder: string;
  items: SelectableItem[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const stop = (e: WheelEvent) => e.stopPropagation();
    el.addEventListener("wheel", stop, { passive: false });
    return () => el.removeEventListener("wheel", stop);
  }, [open]);

  return (
    <div className={stylesTest.searchDropdownWrapper} ref={ref}>
      <div
        className={stylesTest.dropdownTrigger}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={stylesTest.dropdownPlaceholder}>{placeholder}</span>
        <svg width="10" height="10" viewBox="0 0 12 12" style={{ marginLeft: "auto", flexShrink: 0 }}>
          <path fill="#9e9e9e" d="M6 8L1 3h10z" />
        </svg>
      </div>

      {open && (
        <div className={stylesTest.dropdownPanel} style={{ left: 0 }} ref={listRef}>
          {items.length === 0 ? (
            <div style={{ padding: "0.75em 1em", color: "#9e9e9e", fontSize: "0.88em" }}>
              Loading...
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={item.id}>
                <div className={stylesTest.dropdownRow} onClick={() => onToggle(item.id)}>
                  <span className={selectedIds.includes(item.id) ? stylesTest.roundCheckOn : stylesTest.roundCheckOff}>
                    {selectedIds.includes(item.id) && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <polyline points="2,6 5,9 10,3" stroke="#4CAF50" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span className={stylesTest.dropdownRowLabel}>
                    {item.code ? (
                      <>
                        {item.code}
                        <span className={stylesTest.dropdownPipe}> | </span>
                        {item.name}
                      </>
                    ) : (
                      item.name
                    )}
                  </span>
                </div>
                {idx < items.length - 1 && <div className={stylesTest.dropdownDivider} />}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function CreatePathologyProfileModal({ isOpen, onClose, onSave, editingProfile }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const laboratoryTests = useSelector(selectLaboratoryTests);

  const [allTests, setAllTests] = useState<SelectableItem[]>([]);
  const [selectedTestIds, setSelectedTestIds] = useState<string[]>([]);
  const [serviceName, setServiceName] = useState("");
  const [clinic, setClinic] = useState<string>("");

  useEffect(() => {
    dispatch(fetchLaboratoryTests());
  }, [dispatch]);

  // Fetch all tests from API
  useEffect(() => {
    if (!isOpen) return;
    const fetchTests = async () => {
      try {
        const items: SelectableItem[] = [];
        let page = 1;
        while (true) {
          const res = await http.get(`/tests/?page=${page}`);
          res.data.results.forEach((t: any) =>
            items.push({ id: t.id, code: t.test_code, name: t.test_name })
          );
          if (!res.data.next) break;
          page += 1;
        }
        setAllTests(items);
      } catch (err) {
        console.error("Failed to fetch tests", err);
      }
    };
    fetchTests();
  }, [isOpen]);

// In the component, pre-populate on edit:
useEffect(() => {
  if (!isOpen) {
    setSelectedTestIds([]);
    setServiceName("");
    return;
  }
  if (editingProfile) {
    setServiceName(editingProfile.service_name);
    setSelectedTestIds(editingProfile.tests);  // pre-select test IDs
    setClinic(editingProfile.clinic);  // pre-populate clinic
  }
}, [isOpen, editingProfile]);

  if (!isOpen) return null;

  const toggleTest = (id: string) =>
    setSelectedTestIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const selectedTests = allTests.filter((t) => selectedTestIds.includes(t.id));

  const handleSave = () => {
  if (!serviceName.trim()) return;

  if (!clinic) {
    console.error("Clinic is required");
    return;
  }

  onSave({
    service_name: serviceName.trim(),
    tests: selectedTestIds,
    clinic,
  });

  onClose();
};

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.title}>
            {editingProfile ? "Edit Profile" : "New Profile"}
          </span>
          <button type="button" className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.body}>
          {/* Service Name dropdown from Redux */}
          <div className={stylesTest.formGroup}>
            <div className={stylesTest.fieldBorder}>
              <span className={stylesTest.floatLabel}>Service Name</span>
              <select
  className={stylesTest.floatSelect}
  value={serviceName}
  onChange={(e) => setServiceName(e.target.value)}
>
  <option value="">Select...</option>
  {laboratoryTests.length === 0 ? (
    <option disabled>Loading...</option>
  ) : (
    laboratoryTests.map((item) => (
      <option key={item.id} value={item.name}>
        {item.name}
      </option>
    ))
  )}
</select>
            </div>
          </div>

          {/* Test dropdown from API */}
          <div className={styles.section}>
            <p className={styles.sectionTitle}>Test</p>

            <FigmaDropdown
              placeholder="Search & Select Test"
              items={allTests}
              selectedIds={selectedTestIds}
              onToggle={toggleTest}
            />

            {selectedTests.length > 0 && (
              <div className={styles.chipsArea}>
                {selectedTests.map((t) => (
                  <span key={t.id} className={styles.chip}>
                    <span className={styles.chipInner}>
                      <span className={styles.chipCode}>{t.code}</span>
                      <span className={styles.chipName}>{t.name}</span>
                    </span>
                    <button
                      type="button"
                      className={styles.chipRemove}
                      onClick={() => toggleTest(t.id)}
                    >
                      <img src={CloseCircleIcon} alt="remove" width={16} height={16} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="button" className={styles.saveButton} onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePathologyProfileModal;