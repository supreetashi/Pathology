import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./CreateTestPage.module.css";
import BackIcon from "../../../../assets/icons/back_icon.svg";
import CloseCircleIcon from "../../../../assets/icons/close-circle.svg";
import { useDispatch } from "react-redux";
import { createTest, updateTest } from "../../../../store/testSlice";
import type { AppDispatch } from "../../../../store";
import { useSelector } from "react-redux";
import { selectClinic, fetchFirstClinic } from "../../../../store/clinicSlice";
import { selectTubes, fetchTubes } from "../../../../store/sampleTubeSlice";
import {
  fetchLaboratoryTests,
  selectLaboratoryTests,
} from "../../../../store/laboratoryTestSlice";
import { http } from "../../../../services/http";

// ─── Types ────────────────────────────────────────────────────────────────────

type ReportMode = "ByParameter" | "ByTemplate";

type SampleRow = {
  id: number;
  sampleId: string;
  sampleType: string;
  frequency: string;
};

type SelectableItem = {
  id: string;
  code: string;
  name: string;
};

type FormState = {
  testCode: string;
  testName: string;
  printName: string;
  category: string;
  serviceName: string;
  tubeName: string;
  testCompletionTime: string;
  isSensitive: boolean;
  suggestionNote: string;
  disclaimer: string;
};

type TestEditData = {
  id: number;
  code: string;
  name: string;
  printName: string;
  serviceName: string;
  tubeName: string;
  testCompletionTime: string;
  isSensitive: boolean;
  suggestionNote: string;
  disclaimer: string;
  reportType: string;
  isActive: boolean;
};

const CATEGORY_OPTIONS = [
  "Biochemistry",
  "Haematology",
  "Microbiology",
  "Immunology",
];

// ─── Floating-label helpers ───────────────────────────────────────────────────

function FloatInput({
  label,
  value,
  onChange,
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
}) {
  return (
    <div className={styles.formGroup}>
      <div className={styles.fieldBorder}>
        <span className={styles.floatLabel}>{label}</span>
        <input
          className={styles.floatInput}
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </div>
    </div>
  );
}

function FloatSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className={styles.formGroup}>
      <div className={styles.fieldBorder}>
        <span className={styles.floatLabel}>{label}</span>
        <select
          className={styles.floatSelect}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o || "Select..."}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function FloatTextarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className={styles.formGroup}>
      <div className={styles.fieldBorder}>
        <span className={styles.floatLabel}>{label}</span>
        <textarea
          className={styles.floatTextarea}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

function FigmaDropdown({
  placeholder,
  items,
  selectedIds,
  onToggle,
  alignRight = false,
}: {
  placeholder: string;
  items: SelectableItem[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  alignRight?: boolean;
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
    <div
      className={
        alignRight ? styles.sampleDropdownWrapper : styles.searchDropdownWrapper
      }
      ref={ref}
    >
      <div
        className={styles.dropdownTrigger}
        onClick={() => setOpen((o) => !o)}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#9e9e9e"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <span className={styles.dropdownPlaceholder}>{placeholder}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 12 12"
          style={{ marginLeft: "auto", flexShrink: 0 }}
        >
          <path fill="#9e9e9e" d="M6 8L1 3h10z" />
        </svg>
      </div>

      {open && (
        <div
          className={styles.dropdownPanel}
          style={alignRight ? { right: 0, left: "auto" } : { left: 0 }}
          ref={listRef}
        >
          {items.length === 0 ? (
            <div style={{ padding: "0.75em 1em", color: "#9e9e9e", fontSize: "0.88em" }}>
              Loading...
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
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <polyline
                          points="2,6 5,9 10,3"
                          stroke="#4CAF50"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span className={styles.dropdownRowLabel}>
                    {item.code ? (
                      <>
                        {item.code}
                        <span className={styles.dropdownPipe}> | </span>
                        {item.name}
                      </>
                    ) : (
                      item.name
                    )}
                  </span>
                </div>
                {idx < items.length - 1 && (
                  <div className={styles.dropdownDivider} />
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CreateTestPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const clinic = useSelector(selectClinic);
  const tubes = useSelector(selectTubes);
  const laboratoryTests = useSelector(selectLaboratoryTests);

  // ── Real API data ──────────────────────────────────
  const [allParameters, setAllParameters] = useState<SelectableItem[]>([]);
  const [allTemplates, setAllTemplates] = useState<SelectableItem[]>([]);
  const [allSamples, setAllSamples] = useState<SelectableItem[]>([]);

  useEffect(() => {
    dispatch(fetchTubes());
    dispatch(fetchLaboratoryTests());
    if (!clinic) dispatch(fetchFirstClinic());
  }, [dispatch, clinic]);

  // Fetch parameters, templates, samples
  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Parameters
        const paramItems: SelectableItem[] = [];
        let paramPage = 1;
        while (true) {
          const res = await http.get(`/parameters/?page=${paramPage}`);
          res.data.results.forEach((p: any) =>
            paramItems.push({ id: p.id, code: p.parameter_code, name: p.parameter_name })
          );
          if (!res.data.next) break;
          paramPage += 1;
        }
        setAllParameters(paramItems);

        // Templates
        const templateItems: SelectableItem[] = [];
        let templatePage = 1;
        while (true) {
          const res = await http.get(`/templates/?page=${templatePage}`);
          res.data.results.forEach((t: any) =>
            templateItems.push({ id: t.id, code: t.template_code, name: t.template_name })
          );
          if (!res.data.next) break;
          templatePage += 1;
        }
        setAllTemplates(templateItems);

        // Samples
        const sampleItems: SelectableItem[] = [];
        let samplePage = 1;
        while (true) {
          const res = await http.get(`/samples/?page=${samplePage}`);
          res.data.results.forEach((s: any) =>
            sampleItems.push({ id: s.id, code: s.sample_code, name: s.sample_name })
          );
          if (!res.data.next) break;
          samplePage += 1;
        }
        setAllSamples(sampleItems);
      } catch (err) {
        console.error("Failed to fetch dropdown data", err);
      }
    };
    fetchAll();
  }, []);

  const editData = location.state?.testData as TestEditData | undefined;
  const isEditMode = location.state?.mode === "edit";

  const [form, setForm] = useState<FormState>({
    testCode: editData?.code ?? "",
    testName: editData?.name ?? "",
    printName: editData?.printName ?? "",
    category: "Biochemistry",
    serviceName: editData?.serviceName ?? "",
    tubeName: editData?.tubeName ?? "",
    testCompletionTime: editData?.testCompletionTime ?? "",
    isSensitive: editData?.isSensitive ?? false,
    suggestionNote: editData?.suggestionNote ?? "",
    disclaimer: editData?.disclaimer ?? "",
  });

  const [reportMode, setReportMode] = useState<ReportMode>(
    editData?.reportType === "TEMPLATE" ? "ByTemplate" : "ByParameter",
  );

  const [selectedParamIds, setSelectedParamIds] = useState<string[]>([]);
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>([]);
  const [sampleRows, setSampleRows] = useState<SampleRow[]>([]);
  const [nextSampleId, setNextSampleId] = useState(1);

  const set = (field: keyof FormState, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleParam = (id: string) =>
    setSelectedParamIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const toggleTemplate = (id: string) =>
    setSelectedTemplateIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const toggleSampleById = (id: string) => {
    const item = allSamples.find((s) => s.id === id);
    if (!item) return;
    const exists = sampleRows.find((r) => r.sampleId === id);
    if (exists) {
      setSampleRows((prev) => prev.filter((r) => r.sampleId !== id));
    } else {
      setSampleRows((prev) => [
        ...prev,
        { id: nextSampleId, sampleId: id, sampleType: item.name, frequency: "1" },
      ]);
      setNextSampleId((n) => n + 1);
    }
  };

  const deleteSample = (id: number) =>
    setSampleRows((prev) => prev.filter((r) => r.id !== id));

  const updateSampleFrequency = (id: number, value: string) =>
    setSampleRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, frequency: value } : r)),
    );

  const selectedParams = allParameters.filter((p) => selectedParamIds.includes(p.id));
  const selectedTemplates = allTemplates.filter((t) => selectedTemplateIds.includes(t.id));
  const sampleSelectableIds = sampleRows.map((r) => r.sampleId);

  const samplePairs: SampleRow[][] = [];
  for (let i = 0; i < sampleRows.length; i += 2) {
    samplePairs.push(sampleRows.slice(i, i + 2));
  }

  const handleSave = async () => {
    const clinicId = clinic?.id;
    if (!clinicId) return;

    const payload = {
      clinic: clinicId,
      test_code: form.testCode,
      test_name: form.testName,
      print_name: form.printName,
      service_name: form.serviceName,
      tube_name: form.tubeName || null,
      test_completion_time: Number(form.testCompletionTime),
      is_sensitive: form.isSensitive,
      suggestion_note: form.suggestionNote,
      disclaimer: form.disclaimer,
      report_type: reportMode === "ByParameter" ? "PARAMETER" : "TEMPLATE",
      test_parameters:
        reportMode === "ByParameter"
          ? selectedParamIds.map((id) => ({ parameter: id }))
          : [],
      test_templates:
        reportMode === "ByTemplate"
          ? selectedTemplateIds.map((id) => ({ template: id }))
          : [],
      test_samples: sampleRows.map((row) => ({
        sample: row.sampleId,
        frequency: Number(row.frequency) || 1,
      })),
    };

    if (isEditMode && editData) {
      await dispatch(updateTest({ id: editData.id, ...payload }));
    } else {
      await dispatch(createTest(payload));
    }
    navigate("/pathology/configuration/test");
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => navigate(-1)}
          >
            <img src={BackIcon} alt="back" className={styles.backIcon} />
          </button>
          <h2 className={styles.pageTitle}>
            {isEditMode ? "Edit Test" : "Create New Test"}
          </h2>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <p className={styles.sectionTitle}>Basic Details</p>

            {/* Row 1 */}
            <div className={styles.formGrid}>
              <FloatInput
                label="Test Code"
                value={form.testCode}
                onChange={(v) => set("testCode", v)}
              />
              <FloatInput
                label="Test Name"
                value={form.testName}
                onChange={(v) => set("testName", v)}
              />
              <FloatInput
                label="Print Name"
                value={form.printName}
                onChange={(v) => set("printName", v)}
              />
              <FloatSelect
                label="Category"
                value={form.category}
                options={CATEGORY_OPTIONS}
                onChange={(v) => set("category", v)}
              />
            </div>

            {/* Row 2 */}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <div className={styles.fieldBorder}>
                  <span className={styles.floatLabel}>Service Name</span>
                  <select
                    className={styles.floatSelect}
                    value={form.serviceName}
                    onChange={(e) => set("serviceName", e.target.value)}
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

              <div className={styles.formGroup}>
                <div className={styles.fieldBorder}>
                  <span className={styles.floatLabel}>Tube Name</span>
                  <select
                    className={styles.floatSelect}
                    value={form.tubeName}
                    onChange={(e) => set("tubeName", e.target.value)}
                  >
                    <option value="">Select...</option>
                    {tubes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <div className={styles.fieldBorder}>
                  <span className={styles.floatLabel}>
                    Test Completion Time (In Min.)
                  </span>
                  <div className={styles.iconInputRow}>
                    <input
                      className={styles.floatInputFlex}
                      value={form.testCompletionTime}
                      onChange={(e) => set("testCompletionTime", e.target.value)}
                    />
                    <span className={styles.inputIconRight}>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#9e9e9e"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={styles.formGroup}
                style={{ justifyContent: "center" }}
              >
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={form.isSensitive}
                    onChange={(e) => set("isSensitive", e.target.checked)}
                  />
                  Is Sensitive
                </label>
              </div>
            </div>

            {/* Row 3 */}
            <div className={styles.formGrid2}>
              <FloatTextarea
                label="Suggestion Note"
                value={form.suggestionNote}
                onChange={(v) => set("suggestionNote", v)}
              />
              <FloatTextarea
                label="Disclaimer"
                value={form.disclaimer}
                onChange={(v) => set("disclaimer", v)}
              />
            </div>
          </div>

          {/* Reports Details */}
          <div className={styles.section}>
            <hr className={styles.sectionDivider} />
            <p className={styles.sectionTitle}>Reports Details</p>

            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <span
                  className={
                    reportMode === "ByParameter" ? styles.radioOn : styles.radioOff
                  }
                >
                  {reportMode === "ByParameter" && (
                    <span className={styles.radioDot} />
                  )}
                </span>
                <input
                  type="radio"
                  name="reportMode"
                  value="ByParameter"
                  checked={reportMode === "ByParameter"}
                  onChange={() => setReportMode("ByParameter")}
                  style={{ display: "none" }}
                />
                By Parameter
              </label>
              <label className={styles.radioLabel}>
                <span
                  className={
                    reportMode === "ByTemplate" ? styles.radioOn : styles.radioOff
                  }
                >
                  {reportMode === "ByTemplate" && (
                    <span className={styles.radioDot} />
                  )}
                </span>
                <input
                  type="radio"
                  name="reportMode"
                  value="ByTemplate"
                  checked={reportMode === "ByTemplate"}
                  onChange={() => setReportMode("ByTemplate")}
                  style={{ display: "none" }}
                />
                By Template
              </label>
            </div>

            <FigmaDropdown
              placeholder={
                reportMode === "ByParameter"
                  ? "Search & Add Parameter"
                  : "Search & Add Template"
              }
              items={reportMode === "ByParameter" ? allParameters : allTemplates}
              selectedIds={
                reportMode === "ByParameter" ? selectedParamIds : selectedTemplateIds
              }
              onToggle={reportMode === "ByParameter" ? toggleParam : toggleTemplate}
            />

            {reportMode === "ByParameter" && selectedParams.length > 0 && (
              <div className={styles.chipsArea}>
                {selectedParams.map((p) => (
                  <span key={p.id} className={styles.chip}>
                    <span className={styles.chipInner}>
                      <span className={styles.chipCode}>{p.code}</span>
                      <span className={styles.chipName}>{p.name}</span>
                    </span>
                    <button
                      type="button"
                      className={styles.chipRemove}
                      onClick={() => toggleParam(p.id)}
                    >
                      <img src={CloseCircleIcon} alt="remove" width={16} height={16} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {reportMode === "ByTemplate" && selectedTemplates.length > 0 && (
              <div className={styles.chipsArea}>
                {selectedTemplates.map((t) => (
                  <span key={t.id} className={styles.chip}>
                    <span className={styles.chipInner}>
                      <span className={styles.chipCode}>{t.code}</span>
                      <span className={styles.chipName}>{t.name}</span>
                    </span>
                    <button
                      type="button"
                      className={styles.chipRemove}
                      onClick={() => toggleTemplate(t.id)}
                    >
                      <img src={CloseCircleIcon} alt="remove" width={16} height={16} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sample Details */}
          <div className={styles.section}>
            <hr className={styles.sectionDivider} />

            <div className={styles.sampleHeader}>
              <p className={styles.sectionTitle}>Sample Details</p>
              <FigmaDropdown
                placeholder="Search & Add Sample"
                items={allSamples}
                selectedIds={sampleSelectableIds}
                onToggle={toggleSampleById}
                alignRight
              />
            </div>

            <div className={styles.sampleGrid}>
              {samplePairs.map((pair, pairIdx) => (
                <div key={pairIdx} className={styles.sampleGridRow}>
                  {pair.map((row) => (
                    <div key={row.id} className={styles.sampleCell}>
                      <button
                        type="button"
                        className={styles.sampleDeleteCircle}
                        onClick={() => deleteSample(row.id)}
                      >
                        <img src={CloseCircleIcon} alt="remove" width={16} height={16} />
                      </button>

                      <div className={styles.samplePill}>
                        <div className={styles.samplePillField}>
                          <div className={styles.fieldBorder}>
                            <span className={styles.floatLabel}>Sample</span>
                            <input
                              className={styles.floatInput}
                              value={row.sampleType}
                              readOnly
                            />
                          </div>
                        </div>

                        <div className={styles.samplePillField}>
                          <div className={styles.fieldBorder}>
                            <span className={styles.floatLabel}>Frequency</span>
                            <input
                              className={styles.floatInput}
                              value={row.frequency}
                              onChange={(e) =>
                                updateSampleFrequency(row.id, e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.footerActions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => navigate(-1)}
          >
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