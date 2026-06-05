import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "./CreateParameterPage.module.css";
import EditIcon from "../../../../assets/icons/edit.svg";
import BackIcon from "../../../../assets/icons/back_icon.svg";
import {
  createParameter,
  updateParameter,
  fetchReferenceRanges,
  createReferenceRange,
  updateReferenceRange,
  deleteReferenceRange,
  selectReferenceRanges,
} from "../../../../store/parameterSlice";
import type { AppDispatch } from "../../../../store";
import type { ParameterItem } from "../../../../types/parameter.types";

// ─── Types ────────────────────────────────────────────────────────────────────

type ReferenceRange = {
  id: number;
  category: string;
  machine: string;
  minRef: string;
  maxRef: string;
  minAuthZ: string;
  maxAuthZ: string;
  isAgeApplicable: boolean;
  ageLowerLimit: string;
  ageUpperLimit: string;
  improbableValue1: string;
  improbableValue2: string;
  isReflex: boolean;
  reflexValue1: string;
  reflexValue2: string;
  panicValue1: string;
  panicValue2: string;
  varyingRefRanges: string;
  notes: string;
  isNew?: boolean; // track if not yet saved to backend
};

type FormState = {
  parameterCode: string;
  parameterName: string;
  parameterPrintName: string;
  typeOfValue: "Numeric" | "Text";
  isSkipNumeric: boolean;
  parameterUnit: string;
  deltaCheckPercentage: string;
  techniqueUsed: string;
  executionCalendarLinking: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const UNITS = [
  "mL",
  "mg/dL",
  "cells/hpf",
  "%",
  "IU/L",
  "NA",
  "IU/mL",
  "meq/L",
  "mmol/L",
  "ng/mL",
  "g/dL",
  "pg",
  "ug/mL",
  "mm in 1st hour",
  "pg/mL",
  "pmol/dL",
  "pmol/L",
  "nmol/L",
  "umol/mL",
  "x10^6 cells/cumm",
  "U/L",
  "x10^3 cells/cumm",
  "uIU/mL",
  "umol/L",
  "x10^12/L",
  "x10^9/L",
  "fL",
  "sec",
  "mg/L",
  "mIU/mL",
  "ng/dL",
  "mIU/L",
  "ug/dL",
  "Mil/mL",
  "mic/sec",
  "Mil/ejac",
  "min",
  "Units",
  "Quality Score",
  "Days",
  "Qualitative",
  "cells/cumm.",
  "µg/mL",
];

const CATEGORIES = ["MALE", "FEMALE", "BOTH"];
const CATEGORY_LABELS: Record<string, string> = {
  MALE: "Male",
  FEMALE: "Female",
  BOTH: "Both",
};
const MACHINES = [
  "COBAS C311 - Clinical Chemistry",
  "Sysmex XN-1000",
  "Beckman Coulter",
];
const CALENDAR_OPTIONS = ["Lorem Ipsum", "Option 2", "Option 3"];
const FORMULA_PARAMS = ["Sample Value 1", "Sample Value 2", "Sample Value 3"];

const emptyRange = (): ReferenceRange => ({
  id: Date.now(),
  category: "MALE",
  machine: MACHINES[0],
  minRef: "",
  maxRef: "",
  minAuthZ: "",
  maxAuthZ: "",
  isAgeApplicable: false,
  ageLowerLimit: "",
  ageUpperLimit: "",
  improbableValue1: "",
  improbableValue2: "",
  isReflex: false,
  reflexValue1: "",
  reflexValue2: "",
  panicValue1: "",
  panicValue2: "",
  varyingRefRanges: "",
  notes: "",
  isNew: true,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function FloatInput({
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
        <input
          className={styles.floatInput}
          value={value}
          onChange={(e) => onChange(e.target.value)}
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
              {o}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CreateParameterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const editData = location.state?.parameterData as ParameterItem | undefined;
  const isEditMode = location.state?.mode === "edit";

  const reduxRanges = useSelector(selectReferenceRanges);

  const [form, setForm] = useState<FormState>({
    parameterCode: editData?.code ?? "",
    parameterName: editData?.name ?? "",
    parameterPrintName: editData?.printName ?? "",
    typeOfValue: editData?.typeOfValue === "TEXT" ? "Text" : "Numeric",
    isSkipNumeric: editData?.skipNumericResultEntry ?? false,
    parameterUnit: editData?.unit ?? "mL",
    deltaCheckPercentage: editData?.deltaCheckPercentage ?? "",
    techniqueUsed: editData?.techniqueUsed ?? "",
    executionCalendarLinking:
      editData?.executionCalendarLinking ?? "Lorem Ipsum",
  });

  const [localRanges, setLocalRanges] = useState<ReferenceRange[]>([]);
  const [editingRange, setEditingRange] = useState<ReferenceRange | null>(null);
  const [formulaParam1, setFormulaParam1] = useState("Sample Value 1");
  const [formulaParam2, setFormulaParam2] = useState("Sample Value 2");

  // Fetch reference ranges when editing
  useEffect(() => {
    if (isEditMode && editData?.id) {
      dispatch(fetchReferenceRanges(editData.id));
    }
  }, [dispatch, isEditMode, editData?.id]);

  // Sync redux ranges to local state when editing
  useEffect(() => {
    if (isEditMode && reduxRanges.length > 0) {
      setLocalRanges(
        reduxRanges.map((r) => ({
          id: r.id,
          category: r.gender ?? "MALE",
          machine: r.machineName,
          minRef: r.minRef,
          maxRef: r.maxRef,
          minAuthZ: r.minAuthz,
          maxAuthZ: r.maxAuthz,
          isAgeApplicable: r.isAgeApplicable,
          ageLowerLimit: String(r.ageLowerLimit ?? ""),
          ageUpperLimit: String(r.ageUpperLimit ?? ""),
          improbableValue1: r.improbableValueLess,
          improbableValue2: r.improbableValueGreater,
          isReflex: r.isReflex,
          reflexValue1: r.reflexValueLess,
          reflexValue2: r.reflexValueGreater,
          panicValue1: r.panicValueLess,
          panicValue2: r.panicValueGreater,
          varyingRefRanges: r.varyingReferenceRange,
          notes: r.notes,
        })),
      );
    }
  }, [reduxRanges, isEditMode]);

  const handleFormChange = (
    field: keyof FormState,
    value: string | boolean,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDeleteRange = async (id: number) => {
    const range = localRanges.find((r) => r.id === id);
    if (!range?.isNew && isEditMode && editData?.id) {
      await dispatch(deleteReferenceRange({ id, parameterId: editData.id }));
    }
    setLocalRanges((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAddRange = () => {
    setEditingRange(emptyRange());
  };

  const handleEditRange = (range: ReferenceRange) => {
    setEditingRange({ ...range });
  };

  const handleSaveRange = () => {
    if (!editingRange) return;
    const alreadyExists = localRanges.some((r) => r.id === editingRange.id);
    if (alreadyExists) {
      setLocalRanges((prev) =>
        prev.map((r) => (r.id === editingRange.id ? editingRange : r)),
      );
    } else {
      setLocalRanges((prev) => [...prev, editingRange]);
    }
    setEditingRange(null);
  };

  const handleSave = async () => {
    const payload = {
      parameter_code: form.parameterCode,
      parameter_name: form.parameterName,
      parameter_print_name: form.parameterPrintName,
      type_of_value:
        form.typeOfValue === "Numeric"
          ? "NUMERIC"
          : ("TEXT" as "NUMERIC" | "TEXT"),
      unit: form.parameterUnit,
      delta_check_percentage: form.deltaCheckPercentage || null,
      technique_used: form.techniqueUsed,
      execution_calendar_linking: form.executionCalendarLinking,
      skip_numeric_result_entry: form.isSkipNumeric,
    };

    let parameterId: string | undefined;

    if (isEditMode && editData) {
      await dispatch(updateParameter({ id: editData.id, ...payload }));
      parameterId = editData.id;
    } else {
      const result = await dispatch(createParameter(payload));
      // get created parameter id from result if available
      parameterId = (result.payload as any)?.id as string;
    }

    // Save reference ranges
    if (parameterId) {
      for (const range of localRanges) {
        const rangePayload = {
          parameter: parameterId,
          gender: range.category as "MALE" | "FEMALE" | "BOTH",
          machine_name: range.machine,
          min_ref: range.minRef || null,
          max_ref: range.maxRef || null,
          min_authz: range.minAuthZ || null,
          max_authz: range.maxAuthZ || null,
          is_age_applicable: range.isAgeApplicable,
          age_lower_limit: range.ageLowerLimit
            ? Number(range.ageLowerLimit)
            : null,
          age_upper_limit: range.ageUpperLimit
            ? Number(range.ageUpperLimit)
            : null,
          improbable_value_less: range.improbableValue1 || null,
          improbable_value_greater: range.improbableValue2 || null,
          is_reflex: range.isReflex,
          reflex_value_less: range.reflexValue1 || null,
          reflex_value_greater: range.reflexValue2 || null,
          panic_value_less: range.panicValue1 || null,
          panic_value_greater: range.panicValue2 || null,
          varying_reference_range: range.varyingRefRanges,
          notes: range.notes,
        };

        if (range.isNew) {
          await dispatch(createReferenceRange(rangePayload));
        } else if (isEditMode) {
          await dispatch(
            updateReferenceRange({ id: range.id, ...rangePayload }),
          );
        }
      }
    }

    navigate("/pathology/configuration/test");
  };

  const handleCancel = () => navigate("/pathology/configuration/test");

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={handleCancel}
          >
            <img src={BackIcon} alt="back" className={styles.backIcon} />
          </button>
          <h2 className={styles.pageTitle}>
            {isEditMode ? "Edit Parameter" : "Create New Parameter"}
          </h2>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <p className={styles.sectionTitle}>Basic Details</p>
            <div className={styles.formGrid}>
              <FloatInput
                label="Parameter Code"
                value={form.parameterCode}
                onChange={(v) => handleFormChange("parameterCode", v)}
              />
              <FloatInput
                label="Parameter Name"
                value={form.parameterName}
                onChange={(v) => handleFormChange("parameterName", v)}
              />
              <FloatInput
                label="Parameter Print Name"
                value={form.parameterPrintName}
                onChange={(v) => handleFormChange("parameterPrintName", v)}
              />

              <div className={styles.formGroup}>
                <div className={styles.radioFieldBorder}>
                  <span className={styles.radioFloatLabel}>Type Of Value</span>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="typeOfValue"
                      value="Numeric"
                      checked={form.typeOfValue === "Numeric"}
                      onChange={() =>
                        handleFormChange("typeOfValue", "Numeric")
                      }
                    />
                    Numeric
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="typeOfValue"
                      value="Text"
                      checked={form.typeOfValue === "Text"}
                      onChange={() => handleFormChange("typeOfValue", "Text")}
                    />
                    Text
                  </label>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={form.isSkipNumeric}
                    onChange={(e) =>
                      handleFormChange("isSkipNumeric", e.target.checked)
                    }
                  />
                  Is Skip Numeric Result Entry
                </label>
              </div>

              <FloatSelect
                label="Parameter Unit"
                value={form.parameterUnit}
                options={UNITS}
                onChange={(v) => handleFormChange("parameterUnit", v)}
              />

              <div className={styles.formGroup}>
                <div className={styles.numberFieldBorder}>
                  <span className={styles.numberFloatLabel}>
                    Delta Check Percentage (%)
                  </span>
                  <input
                    type="number"
                    className={styles.floatNumberInput}
                    value={form.deltaCheckPercentage}
                    onChange={(e) =>
                      handleFormChange("deltaCheckPercentage", e.target.value)
                    }
                  />
                  <div className={styles.numberControls}>
                    <button
                      type="button"
                      className={styles.numberBtn}
                      onClick={() =>
                        handleFormChange(
                          "deltaCheckPercentage",
                          String(
                            parseFloat(form.deltaCheckPercentage || "0") + 0.5,
                          ),
                        )
                      }
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      className={styles.numberBtn}
                      onClick={() =>
                        handleFormChange(
                          "deltaCheckPercentage",
                          String(
                            Math.max(
                              0,
                              parseFloat(form.deltaCheckPercentage || "0") -
                                0.5,
                            ),
                          ),
                        )
                      }
                    >
                      ▼
                    </button>
                  </div>
                </div>
              </div>

              <FloatInput
                label="Technique Used"
                value={form.techniqueUsed}
                onChange={(v) => handleFormChange("techniqueUsed", v)}
              />
              <FloatSelect
                label="Execution Calendar Linking"
                value={form.executionCalendarLinking}
                options={CALENDAR_OPTIONS}
                onChange={(v) =>
                  handleFormChange("executionCalendarLinking", v)
                }
              />
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.refRangesHeader}>
              <p className={styles.sectionTitle}>Reference Ranges</p>
              <button
                type="button"
                className={styles.addRangeBtn}
                onClick={handleAddRange}
              >
                + Add New Reference Ranges
              </button>
            </div>

            <div className={styles.refTableWrapper}>
              <table className={styles.refTable}>
                <thead>
                  <tr>
                    <th></th>
                    <th>Category</th>
                    <th>Machine</th>
                    <th>Min. Ref.</th>
                    <th>Max. Ref.</th>
                    <th>Min. AuthZ</th>
                    <th>Max. AuthZ</th>
                    <th>Is Age Applicable</th>
                    <th>Age - Lower Limit</th>
                    <th>Age - Upper Limit</th>
                    <th>Improbable Value 1</th>
                    <th>Improbable Value 2</th>
                    <th>Is Reflex</th>
                    <th>Reflex Value 1</th>
                    <th>Reflex Value 2</th>
                    <th>Panic Value 1</th>
                    <th>Panic Value 2</th>
                    <th>Varying Ref. Ranges</th>
                    <th>Notes</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {localRanges.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          onClick={() => handleDeleteRange(row.id)}
                        >
                          ✕
                        </button>
                      </td>
                      <td>{CATEGORY_LABELS[row.category] ?? row.category}</td>
                      <td>{row.machine}</td>
                      <td>{row.minRef}</td>
                      <td>{row.maxRef}</td>
                      <td>{row.minAuthZ}</td>
                      <td>{row.maxAuthZ}</td>
                      <td>
                        {row.isAgeApplicable && (
                          <span className={styles.checkIcon}>✓</span>
                        )}
                      </td>
                      <td>{row.ageLowerLimit}</td>
                      <td>{row.ageUpperLimit}</td>
                      <td>{row.improbableValue1}</td>
                      <td>{row.improbableValue2}</td>
                      <td>
                        {row.isReflex && (
                          <span className={styles.checkIcon}>✓</span>
                        )}
                      </td>
                      <td>{row.reflexValue1}</td>
                      <td>{row.reflexValue2}</td>
                      <td>{row.panicValue1}</td>
                      <td>{row.panicValue2}</td>
                      <td
                        style={{
                          maxWidth: "160px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {row.varyingRefRanges.split("\n")[0]}
                        {row.varyingRefRanges.includes("\n") && "…"}
                      </td>
                      <td
                        style={{
                          maxWidth: "180px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {row.notes.length > 40
                          ? row.notes.slice(0, 40) + "…"
                          : row.notes}
                      </td>
                      <td>
                        <button
                          type="button"
                          className={styles.editRowBtn}
                          onClick={() => handleEditRange(row)}
                        >
                          <img
                            src={EditIcon}
                            alt="edit"
                            width={16}
                            height={16}
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.section}>
            <p className={styles.sectionTitle}>Formula</p>
            <div className={styles.formulaBox}>
              <div className={styles.formulaInner}>
                <div className={styles.formulaExpression}>
                  <span className={styles.formulaText}>(</span>
                  <select
                    className={styles.formulaSelect}
                    value={formulaParam1}
                    onChange={(e) => setFormulaParam1(e.target.value)}
                  >
                    {FORMULA_PARAMS.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                  <span className={styles.formulaOperator}>+</span>
                  <select
                    className={styles.formulaSelect}
                    value={formulaParam2}
                    onChange={(e) => setFormulaParam2(e.target.value)}
                  >
                    {FORMULA_PARAMS.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                  <span className={styles.formulaText}>)</span>
                  <span className={styles.formulaOperator}>/</span>
                  <span className={styles.formulaText}>100</span>
                </div>
              </div>
              <div className={styles.formulaDivider} />
              <div className={styles.formulaControls}>
                <div className={styles.formulaRow}>
                  {["(", ")", "+", "-", "*"].map((op) => (
                    <button
                      key={op}
                      type="button"
                      className={styles.formulaBtn}
                    >
                      {op}
                    </button>
                  ))}
                  <button type="button" className={styles.validateBtn}>
                    Validate Formula
                  </button>
                </div>
                <div className={styles.formulaRow}>
                  {["/", "0"].map((op) => (
                    <button
                      key={op}
                      type="button"
                      className={styles.formulaBtn}
                    >
                      {op}
                    </button>
                  ))}
                  <button type="button" className={styles.addParamBtn}>
                    Add Parameter
                  </button>
                  <button type="button" className={styles.clearBtn}>
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footerActions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button type="button" className={styles.saveBtn} onClick={handleSave}>
            Save
          </button>
        </div>
      </div>

      {editingRange && (
        <div className={styles.overlay} onClick={() => setEditingRange(null)}>
          <div
            className={styles.sidePanel}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.sidePanelHeader}>
              <h3 className={styles.sidePanelTitle}>
                {localRanges.some((r) => r.id === editingRange.id)
                  ? "Edit Reference Ranges & Rules"
                  : "Add New Reference Ranges & Rules"}
              </h3>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setEditingRange(null)}
              >
                ✕
              </button>
            </div>

            <div className={styles.sidePanelContent}>
              <div className={styles.sidePanelGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Category</label>
                  <select
                    className={styles.select}
                    value={editingRange.category}
                    onChange={(e) =>
                      setEditingRange({
                        ...editingRange,
                        category: e.target.value,
                      })
                    }
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {CATEGORY_LABELS[c]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Machine</label>
                  <select
                    className={styles.select}
                    value={editingRange.machine}
                    onChange={(e) =>
                      setEditingRange({
                        ...editingRange,
                        machine: e.target.value,
                      })
                    }
                  >
                    {MACHINES.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.sidePanelGrid}>
                {[
                  ["minRef", "Min. Ref."],
                  ["maxRef", "Max. Ref."],
                  ["minAuthZ", "Min. AuthZ"],
                  ["maxAuthZ", "Max. AuthZ"],
                ].map(([field, label]) => (
                  <div key={field} className={styles.formGroup}>
                    <label className={styles.label}>{label}</label>
                    <input
                      className={styles.input}
                      value={(editingRange as any)[field]}
                      onChange={(e) =>
                        setEditingRange({
                          ...editingRange,
                          [field]: e.target.value,
                        })
                      }
                    />
                  </div>
                ))}
              </div>

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={editingRange.isAgeApplicable}
                  onChange={(e) =>
                    setEditingRange({
                      ...editingRange,
                      isAgeApplicable: e.target.checked,
                    })
                  }
                />
                Is Age Applicable
              </label>

              <div className={styles.sidePanelGrid}>
                {[
                  ["ageLowerLimit", "Age - Lower Limit"],
                  ["ageUpperLimit", "Age - Upper Limit"],
                ].map(([field, label]) => (
                  <div key={field} className={styles.formGroup}>
                    <label className={styles.label}>{label}</label>
                    <input
                      className={styles.input}
                      value={(editingRange as any)[field]}
                      onChange={(e) =>
                        setEditingRange({
                          ...editingRange,
                          [field]: e.target.value,
                        })
                      }
                    />
                  </div>
                ))}
              </div>

              <div className={styles.sidePanelGrid}>
                {[
                  ["improbableValue1", "Improbable Value 1"],
                  ["improbableValue2", "Improbable Value 2"],
                ].map(([field, label]) => (
                  <div key={field} className={styles.formGroup}>
                    <label className={styles.label}>{label}</label>
                    <input
                      className={styles.input}
                      value={(editingRange as any)[field]}
                      onChange={(e) =>
                        setEditingRange({
                          ...editingRange,
                          [field]: e.target.value,
                        })
                      }
                    />
                  </div>
                ))}
              </div>

              <div className={styles.divider} />

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={editingRange.isReflex}
                  onChange={(e) =>
                    setEditingRange({
                      ...editingRange,
                      isReflex: e.target.checked,
                    })
                  }
                />
                Is Reflex
              </label>

              <div className={styles.sidePanelGrid}>
                {[
                  ["reflexValue1", "Reflex Value 1"],
                  ["reflexValue2", "Reflex Value 2"],
                  ["panicValue1", "Panic Value 1"],
                  ["panicValue2", "Panic Value 2"],
                ].map(([field, label]) => (
                  <div key={field} className={styles.formGroup}>
                    <label className={styles.label}>{label}</label>
                    <input
                      className={styles.input}
                      value={(editingRange as any)[field]}
                      onChange={(e) =>
                        setEditingRange({
                          ...editingRange,
                          [field]: e.target.value,
                        })
                      }
                    />
                  </div>
                ))}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Varying Ref. Ranges</label>
                <textarea
                  className={styles.textarea}
                  value={editingRange.varyingRefRanges}
                  onChange={(e) =>
                    setEditingRange({
                      ...editingRange,
                      varyingRefRanges: e.target.value,
                    })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Notes</label>
                <textarea
                  className={styles.textarea}
                  value={editingRange.notes}
                  onChange={(e) =>
                    setEditingRange({ ...editingRange, notes: e.target.value })
                  }
                />
              </div>
            </div>

            <div className={styles.sidePanelFooter}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setEditingRange(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.saveBtn}
                onClick={handleSaveRange}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
