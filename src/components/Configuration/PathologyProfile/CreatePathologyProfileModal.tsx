// import { useState, useRef, useEffect } from "react";
// import styles from "../../../styles/Configuration/SampleTube/CreateSampleTubeModal.module.css";
// import stylesTest from "../Test/TestMaster/CreateTestPage.module.css";
// import CloseCircleIcon from "../../../assets/icons/close-circle.svg";
// import { selectLaboratoryTests, fetchLaboratoryTests } from "../../../store/laboratoryTestSlice";
// import { useDispatch } from "react-redux";
// import type { AppDispatch } from "../../../store";
// import { useSelector } from "react-redux";
// import { http } from "../../../services/http";
// import { PathologyProfileItem } from "../../../types/pathologyProfile.types";
// import { selectClinic, fetchFirstClinic } from "../../../store/clinicSlice";

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;

//   onSave: (data: {
//     service_name: string;
//     tests: string[];
//     clinic: string;
//   }) => void;

//   editingProfile?: PathologyProfileItem | null;
// }

// type SelectableItem = {
//   id: string;
//   code: string;
//   name: string;
// };

// function FigmaDropdown({
//   placeholder,
//   items,
//   selectedIds,
//   onToggle,
// }: {
//   placeholder: string;
//   items: SelectableItem[];
//   selectedIds: string[];
//   onToggle: (id: string) => void;
// }) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef<HTMLDivElement>(null);
//   const listRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     function onOutside(e: MouseEvent) {
//       if (ref.current && !ref.current.contains(e.target as Node))
//         setOpen(false);
//     }
//     document.addEventListener("mousedown", onOutside);
//     return () => document.removeEventListener("mousedown", onOutside);
//   }, []);

//   useEffect(() => {
//     const el = listRef.current;
//     if (!el) return;
//     const stop = (e: WheelEvent) => e.stopPropagation();
//     el.addEventListener("wheel", stop, { passive: false });
//     return () => el.removeEventListener("wheel", stop);
//   }, [open]);

//   return (
//     <div className={stylesTest.searchDropdownWrapper} ref={ref}>
//       <div
//         className={stylesTest.dropdownTrigger}
//         onClick={() => setOpen((o) => !o)}
//       >
//         <span className={stylesTest.dropdownPlaceholder}>{placeholder}</span>
//         <svg width="10" height="10" viewBox="0 0 12 12" style={{ marginLeft: "auto", flexShrink: 0 }}>
//           <path fill="#9e9e9e" d="M6 8L1 3h10z" />
//         </svg>
//       </div>

//       {open && (
//         <div className={stylesTest.dropdownPanel} style={{ left: 0 }} ref={listRef}>
//           {items.length === 0 ? (
//             <div style={{ padding: "0.75em 1em", color: "#9e9e9e", fontSize: "0.88em" }}>
//               Loading...
//             </div>
//           ) : (
//             items.map((item, idx) => (
//               <div key={item.id}>
//                 <div className={stylesTest.dropdownRow} onClick={() => onToggle(item.id)}>
//                   <span className={selectedIds.includes(item.id) ? stylesTest.roundCheckOn : stylesTest.roundCheckOff}>
//                     {selectedIds.includes(item.id) && (
//                       <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
//                         <polyline points="2,6 5,9 10,3" stroke="#4CAF50" strokeWidth="2"
//                           strokeLinecap="round" strokeLinejoin="round" />
//                       </svg>
//                     )}
//                   </span>
//                   <span className={stylesTest.dropdownRowLabel}>
//                     {item.code ? (
//                       <>
//                         {item.code}
//                         <span className={stylesTest.dropdownPipe}> | </span>
//                         {item.name}
//                       </>
//                     ) : (
//                       item.name
//                     )}
//                   </span>
//                 </div>
//                 {idx < items.length - 1 && <div className={stylesTest.dropdownDivider} />}
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// function CreatePathologyProfileModal({ isOpen, onClose, onSave, editingProfile }: Props) {
//   const dispatch = useDispatch<AppDispatch>();
//   const laboratoryTests = useSelector(selectLaboratoryTests);
//   const clinic = useSelector(selectClinic);

//   const [allTests, setAllTests] = useState<SelectableItem[]>([]);
//   const [selectedTestIds, setSelectedTestIds] = useState<string[]>([]);
//   const [serviceName, setServiceName] = useState("");

//   useEffect(() => {
//     dispatch(fetchLaboratoryTests());
//     dispatch(fetchFirstClinic());
//   }, [dispatch]);

//   // Fetch all tests from API
//   useEffect(() => {
//     if (!isOpen) return;
//     const fetchTests = async () => {
//       try {
//         const items: SelectableItem[] = [];
//         let page = 1;
//         while (true) {
//           const res = await http.get(`/tests/?page=${page}`);
//           res.data.results.forEach((t: any) =>
//             items.push({ id: t.id, code: t.test_code, name: t.test_name })
//           );
//           if (!res.data.next) break;
//           page += 1;
//         }
//         setAllTests(items);
//       } catch (err) {
//         console.error("Failed to fetch tests", err);
//       }
//     };
//     fetchTests();
//   }, [isOpen]);

// // In the component, pre-populate on edit:
// useEffect(() => {
//   if (!isOpen) {
//     setSelectedTestIds([]);
//     setServiceName("");
//     return;
//   }
//   if (editingProfile) {
//     setServiceName(editingProfile.service_name);
//     setSelectedTestIds(editingProfile.tests);  // pre-select test IDs
//   }
// }, [isOpen, editingProfile]);

//   if (!isOpen) return null;

//   const toggleTest = (id: string) =>
//     setSelectedTestIds((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );

//   const selectedTests = allTests.filter((t) => selectedTestIds.includes(t.id));

//   const handleSave = () => {
//   if (!serviceName.trim()) return;

//   if (!clinic) {
//     console.error("Clinic is required");
//     return;
//   }

//   onSave({
//     service_name: serviceName.trim(),
//     tests: selectedTestIds,
//     clinic: clinic.id,
//   });

//   onClose();
// };

//   return (
//     <div className={styles.overlay} onClick={onClose}>
//       <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
//         <div className={styles.header}>
//           <span className={styles.title}>
//             {editingProfile ? "Edit Profile" : "New Profile"}
//           </span>
//           <button type="button" className={styles.closeButton} onClick={onClose}>×</button>
//         </div>

//         <div className={styles.body}>
//           {/* Service Name dropdown from Redux */}
//           <div className={stylesTest.formGroup}>
//             <div className={stylesTest.fieldBorder}>
//               <span className={stylesTest.floatLabel}>Service Name</span>
//               <select
//   className={stylesTest.floatSelect}
//   value={serviceName}
//   onChange={(e) => setServiceName(e.target.value)}
// >
//   <option value="">Select...</option>
//   {laboratoryTests.length === 0 ? (
//     <option disabled>Loading...</option>
//   ) : (
//     laboratoryTests.map((item) => (
//       <option key={item.id} value={item.name}>
//         {item.name}
//       </option>
//     ))
//   )}
// </select>
//             </div>
//           </div>

//           {/* Test dropdown from API */}
//           <div className={styles.section}>
//             <p className={styles.sectionTitle}>Test</p>

//             <FigmaDropdown
//               placeholder="Search & Select Test"
//               items={allTests}
//               selectedIds={selectedTestIds}
//               onToggle={toggleTest}
//             />

//             {selectedTests.length > 0 && (
//               <div className={styles.chipsArea}>
//                 {selectedTests.map((t) => (
//                   <span key={t.id} className={styles.chip}>
//                     <span className={styles.chipInner}>
//                       <span className={styles.chipCode}>{t.code}</span>
//                       <span className={styles.chipName}>{t.name}</span>
//                     </span>
//                     <button
//                       type="button"
//                       className={styles.chipRemove}
//                       onClick={() => toggleTest(t.id)}
//                     >
//                       <img src={CloseCircleIcon} alt="remove" width={16} height={16} />
//                     </button>
//                   </span>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className={styles.actions}>
//             <button type="button" className={styles.cancelButton} onClick={onClose}>
//               Cancel
//             </button>
//             <button type="button" className={styles.saveButton} onClick={handleSave}>
//               Save
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CreatePathologyProfileModal;
import { useState, useRef, useEffect } from "react";
import CloseCircleIcon from "../../../assets/icons/close-circle.svg";
import { selectLaboratoryTests, fetchLaboratoryTests } from "../../../store/laboratoryTestSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../../store";
import { http } from "../../../services/http";
import { PathologyProfileItem } from "../../../types/pathologyProfile.types";
import { selectClinic, fetchFirstClinic } from "../../../store/clinicSlice";
import styles from "./CreatePathologyProfileModal.module.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { service_name: string; tests: string[]; clinic: string }) => void;
  editingProfile?: PathologyProfileItem | null;
}

type SelectableItem = {
  id: string;
  code: string;
  name: string;
};

// ─── Tests Dropdown ───────────────────────────────────────────────────────────

function TestsDropdown({
  items,
  selectedIds,
  onToggle,
}: {
  items: SelectableItem[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
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
                Loading...
              </div>
            ) : (
              items.map((item, idx) => (
                <div key={item.id}>
                  <div className={styles.dropdownRow} onClick={() => onToggle(item.id)}>
                    <span className={selectedIds.includes(item.id) ? styles.roundCheckOn : styles.roundCheckOff}>
                      {selectedIds.includes(item.id) && (
                        <svg width="11" height="11" viewBox="0 0 12 12">
                          <polyline points="2,6 5,9 10,3" stroke="#2E7D32" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                      )}
                    </span>
                    <span className={styles.dropdownRowLabel}>
                      {item.code ? `${item.code} | ${item.name}` : item.name}
                    </span>
                  </div>
                  {idx < items.length - 1 && <div className={styles.dropdownDivider} />}
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

export default function CreatePathologyProfileModal({ isOpen, onClose, onSave, editingProfile }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const laboratoryTests = useSelector(selectLaboratoryTests);
  const clinic = useSelector(selectClinic);

  const [allTests, setAllTests] = useState<SelectableItem[]>([]);
  const [selectedTestIds, setSelectedTestIds] = useState<string[]>([]);
  const [serviceName, setServiceName] = useState("");
  const [errors, setErrors] = useState<{ serviceName?: string; tests?: string }>({});

  useEffect(() => {
    dispatch(fetchLaboratoryTests());
    dispatch(fetchFirstClinic());
  }, [dispatch]);

  // Fetch tests from API when modal opens
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

  // Pre-populate on edit, reset on close
  useEffect(() => {
    if (!isOpen) {
      setSelectedTestIds([]);
      setServiceName("");
      setErrors({});
      return;
    }
    if (editingProfile) {
      setServiceName(editingProfile.service_name);
      setSelectedTestIds(editingProfile.tests.map(String));
    }
  }, [isOpen, editingProfile]);

  if (!isOpen) return null;

  const toggleTest = (id: string) => {
    setSelectedTestIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    if (errors.tests) setErrors((e) => ({ ...e, tests: "" }));
  };

  const removeTest = (id: string) => {
    setSelectedTestIds((prev) => prev.filter((x) => x !== id));
  };

  const selectedTests = allTests.filter((t) => selectedTestIds.includes(t.id));

  const handleSave = () => {
    const nextErrors: { serviceName?: string; tests?: string } = {};
    if (!serviceName.trim()) nextErrors.serviceName = "Service name is required";
    if (selectedTestIds.length === 0) nextErrors.tests = "Select at least one test";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (!clinic?.id) {
      console.error("Clinic not loaded");
      return;
    }

    onSave({
      service_name: serviceName.trim(),
      tests: selectedTestIds,
      clinic: clinic.id,
    });

    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {editingProfile ? "Edit Profile" : "New Profile"}
          </h2>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
              <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          {/* Service Name */}
          <div>
            <div className={styles.fieldBorder}>
              <span className={styles.floatLabel}>Service Name</span>
              <select
                className={styles.floatSelect}
                value={serviceName}
                onChange={(e) => {
                  setServiceName(e.target.value);
                  if (errors.serviceName) setErrors((prev) => ({ ...prev, serviceName: "" }));
                }}
              >
                <option value="">Select...</option>
                {laboratoryTests.length === 0 ? (
                  <option disabled>Loading...</option>
                ) : (
                  laboratoryTests.map((item) => (
                    <option key={item.id} value={item.name}>{item.name}</option>
                  ))
                )}
              </select>
            </div>
            {errors.serviceName && (
              <p style={{ marginTop: "6px", fontSize: "12px", color: "#d32f2f" }}>
                {errors.serviceName}
              </p>
            )}
          </div>

          {/* Tests */}
          <div>
            <TestsDropdown
              items={allTests}
              selectedIds={selectedTestIds}
              onToggle={toggleTest}
            />
            {errors.tests && (
              <p style={{ marginTop: "6px", fontSize: "12px", color: "#d32f2f" }}>
                {errors.tests}
              </p>
            )}
          </div>

          {/* Chips */}
          {selectedTests.length > 0 && (
            <div className={styles.chipsArea}>
              {selectedTests.map((t) => (
                <span key={t.id} className={styles.chip}>
                  {t.name}
                  <button type="button" className={styles.chipRemove} onClick={() => removeTest(t.id)}>
                    <img src={CloseCircleIcon} alt="remove" width={16} height={16} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button type="button" className={styles.saveBtn} onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}