import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useDispatch } from "react-redux";
import CloseCircleIcon from "../../../assets/icons/close-circle.svg";
import type { AppDispatch } from "../../../store";
import type { MachineItem, MachineParameterItem } from "../../../types/Machine.types";
import {
  createMachineParameter,
  updateMachine,
  updateMachineParameter,
} from "../../../store/MachineSlice";

// =====================================================
// Types
// =====================================================
type Option = {
  id: string;   // string — matches MachineItem.id
  name: string;
};

type ParameterCreateProps = {
  isOpen: boolean;
  mode: "create" | "edit";
  initialValue: MachineParameterItem | null;
  // Full machine list so we can derive which machines were previously linked
  machines: MachineItem[];
  machineOptions: Option[];
  onClose: () => void;
  onSave?: () => void;
};

// =====================================================
// Styles
// =====================================================
const styles: Record<string, CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(23, 26, 31, 0.36)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px",
    zIndex: 1400,
  },
  modal: {
    width: "100%",
    maxWidth: "380px",
    borderRadius: "16px",
    backgroundColor: "#ffffff",
    boxShadow: "0 16px 40px rgba(20, 24, 32, 0.18)",
    overflow: "hidden",
  },
  head: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 16px",
    borderBottom: "1px solid #e6e9ef",
  },
  title: {
    margin: 0,
    fontSize: "20px",
    lineHeight: 1.15,
    fontWeight: 700,
    color: "#262a31",
  },
  closeButton: {
    width: "28px",
    height: "28px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
    padding: 0,
  },
  body: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  fieldWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "15px",
    color: "#6f747d",
    fontWeight: 500,
  },
  input: {
    width: "100%",
    height: "56px",
    borderRadius: "10px",
    border: "1px solid #d7dbe3",
    padding: "0 14px",
    fontSize: "14px",
    color: "#2b3038",
    outline: "none",
    boxSizing: "border-box",
  },
  inputError: {
    border: "1px solid #e34a4a",
  },
  errorText: {
    fontSize: "12px",
    color: "#e34a4a",
    marginTop: "2px",
  },
  selectButton: {
    width: "100%",
    minHeight: "56px",
    borderRadius: "10px",
    border: "1px solid #d7dbe3",
    backgroundColor: "#ffffff",
    padding: "0 14px",
    fontSize: "14px",
    color: "#8a909a",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    textAlign: "left",
  },
  caret: {
    width: "10px",
    height: "10px",
    borderBottom: "2px solid #2e333a",
    borderRight: "2px solid #2e333a",
    transform: "rotate(45deg)",
    marginTop: "-6px",
    flexShrink: 0,
  },
  optionsBox: {
    border: "1px solid #d7dbe3",
    borderRadius: "10px",
    overflow: "hidden",
  },
  optionsList: {
    maxHeight: "170px",
    overflowY: "auto",
  },
  option: {
    width: "100%",
    border: "none",
    borderBottom: "1px solid #f0f2f5",
    backgroundColor: "#ffffff",
    textAlign: "left",
    padding: "11px 12px",
    fontSize: "14px",
    color: "#2f343c",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
  },
  optionIndicator: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    border: "2px solid #d0d5dd",
    display: "grid",
    placeItems: "center",
    color: "#ffffff",
    fontSize: "12px",
    flexShrink: 0,
  },
  chips: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  chip: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    height: "32px",
    padding: "0 10px",
    borderRadius: "9px",
    backgroundColor: "#f7efef",
    color: "#444a53",
    fontSize: "14px",
    fontWeight: 500,
  },
  chipRemove: {
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    border: "1px solid #e34a4a",
    color: "#e34a4a",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontSize: "11px",
    lineHeight: 1,
    display: "grid",
    placeItems: "center",
    padding: 0,
  },
  footer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginTop: "4px",
  },
  cancelButton: {
    border: "none",
    borderRadius: "10px",
    height: "36px",
    backgroundColor: "#efeff0",
    color: "#484d55",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  },
  saveButton: {
    border: "none",
    borderRadius: "10px",
    height: "36px",
    backgroundColor: "#59595b",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  },
  saveButtonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
};

// =====================================================
// Component
// =====================================================
function ParameterCreate({
  isOpen,
  mode,
  initialValue,
  machines,
  machineOptions,
  onClose,
  onSave,
}: ParameterCreateProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [selectedMachineIds, setSelectedMachineIds] = useState<string[]>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ code?: string; name?: string }>({});

  useEffect(() => {
    if (!isOpen) return;

    if (initialValue) {
      setCode(initialValue.machineParameterCode);
      setName(initialValue.machineParameterName);
      // Derive which machines currently link to this parameter
      // by checking each machine's machineParameterIds array
      setSelectedMachineIds(
        machines
          .filter((m) => m.machineParameterIds.includes(initialValue.id))
          .map((m) => m.id),
      );
    } else {
      setCode("");
      setName("");
      setSelectedMachineIds([]);
    }

    setIsPickerOpen(false);
    setErrors({});
  }, [isOpen, initialValue, machines]);

  const selectedOptions = useMemo(() => {
    const map = new Map(machineOptions.map((o) => [o.id, o.name]));
    return selectedMachineIds
      .map((id) => ({ id, name: map.get(id) ?? "Unknown" }))
      .filter((item) => item.name !== "Unknown");
  }, [machineOptions, selectedMachineIds]);

  if (!isOpen) return null;

  const validate = () => {
    const next: { code?: string; name?: string } = {};
    if (!code.trim()) next.code = "Parameter code is required";
    if (!name.trim()) next.name = "Parameter name is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    if (!validate() || isSaving) return;
    setIsSaving(true);

    try {
      if (mode === "edit" && initialValue) {
        // 1. Update the parameter's own code/name
        await dispatch(
          updateMachineParameter({
            id: initialValue.id,
            payload: {
              machine_parameter_code: code.trim(),
              machine_parameter_name: name.trim(),
            },
          }),
        );

        // 2. Diff machine links: add parameter to newly selected machines,
        //    remove it from deselected machines
        const previousIds = new Set(
          machines
            .filter((m) => m.machineParameterIds.includes(initialValue.id))
            .map((m) => m.id),
        );
        const nextIds = new Set(selectedMachineIds);

        const toAdd = selectedMachineIds.filter((id) => !previousIds.has(id));
        const toRemove = [...previousIds].filter((id) => !nextIds.has(id));

        await Promise.all([
          ...toAdd.map((machineId) => {
            const machine = machines.find((m) => m.id === machineId);
            if (!machine) return Promise.resolve();
            return dispatch(
              updateMachine({
                id: machineId,
                payload: {
                  machine_parameter_ids: [
                    ...machine.machineParameterIds,
                    initialValue.id,
                  ],
                },
              }),
            );
          }),
          ...toRemove.map((machineId) => {
            const machine = machines.find((m) => m.id === machineId);
            if (!machine) return Promise.resolve();
            return dispatch(
              updateMachine({
                id: machineId,
                payload: {
                  machine_parameter_ids: machine.machineParameterIds.filter(
                    (pid) => pid !== initialValue.id,
                  ),
                },
              }),
            );
          }),
        ]);
      } else {
        // 1. Create the standalone parameter
        const resultAction = await dispatch(
          createMachineParameter({
            machine_parameter_code: code.trim(),
            machine_parameter_name: name.trim(),
          }),
        );

        // 2. Link it to each selected machine
        if (
          createMachineParameter.fulfilled.match(resultAction) &&
          selectedMachineIds.length > 0
        ) {
          const newParameterId = resultAction.payload?.id as string;
          await Promise.all(
            selectedMachineIds.map((machineId) => {
              const machine = machines.find((m) => m.id === machineId);
              if (!machine) return Promise.resolve();
              return dispatch(
                updateMachine({
                  id: machineId,
                  payload: {
                    machine_parameter_ids: [
                      ...machine.machineParameterIds,
                      newParameterId,
                    ],
                  },
                }),
              );
            }),
          );
        }
      }

      onSave?.();
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const heading =
    mode === "create" ? "Add New Machine Parameter" : "Edit Machine Parameter";

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.head}>
          <h2 style={styles.title}>{heading}</h2>
          <button type="button" style={styles.closeButton} onClick={onClose}>
            <img src={CloseCircleIcon} alt="Close" width={24} height={24} />
          </button>
        </div>

        <div style={styles.body}>
          <label style={styles.fieldWrap}>
            <span style={styles.label}>Machine Parameter Code</span>
            <input
              value={code}
              style={{ ...styles.input, ...(errors.code ? styles.inputError : {}) }}
              onChange={(e) => {
                setCode(e.target.value);
                if (errors.code) setErrors((prev) => ({ ...prev, code: undefined }));
              }}
              placeholder="MPN-451241"
            />
            {errors.code && <span style={styles.errorText}>{errors.code}</span>}
          </label>

          <label style={styles.fieldWrap}>
            <span style={styles.label}>Machine Parameter Name</span>
            <input
              value={name}
              style={{ ...styles.input, ...(errors.name ? styles.inputError : {}) }}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="ALP2L"
            />
            {errors.name && <span style={styles.errorText}>{errors.name}</span>}
          </label>

          <div style={styles.fieldWrap}>
            <span style={styles.label}>Link Machine</span>
            <button
              type="button"
              style={styles.selectButton}
              onClick={() => setIsPickerOpen((prev) => !prev)}
            >
              <span>
                {selectedOptions.length === 0
                  ? "Search & select machine"
                  : "Select more machines"}
              </span>
              <span style={styles.caret} />
            </button>

            {isPickerOpen && (
              <div style={styles.optionsBox}>
                <div style={styles.optionsList}>
                  {machineOptions.length === 0 ? (
                    <button
                      type="button"
                      style={{ ...styles.option, cursor: "default", color: "#8a909a" }}
                    >
                      No machine found
                    </button>
                  ) : (
                    machineOptions.map((option) => {
                      const isSelected = selectedMachineIds.includes(option.id);
                      return (
                        <button
                          key={option.id}
                          type="button"
                          style={styles.option}
                          onClick={() => {
                            setSelectedMachineIds((prev) =>
                              isSelected
                                ? prev.filter((id) => id !== option.id)
                                : [...prev, option.id],
                            );
                          }}
                        >
                          <span>{option.name}</span>
                          <span
                            style={{
                              ...styles.optionIndicator,
                              borderColor: isSelected ? "#a8dcb7" : "#d0d5dd",
                              backgroundColor: isSelected ? "#8fd3a5" : "transparent",
                            }}
                          >
                            {isSelected ? "✓" : ""}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {selectedOptions.length > 0 && (
              <div style={styles.chips}>
                {selectedOptions.map((option) => (
                  <span key={option.id} style={styles.chip}>
                    {option.name}
                    <button
                      type="button"
                      style={styles.chipRemove}
                      onClick={() =>
                        setSelectedMachineIds((prev) =>
                          prev.filter((id) => id !== option.id),
                        )
                      }
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div style={styles.footer}>
            <button
              type="button"
              style={styles.cancelButton}
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="button"
              style={{
                ...styles.saveButton,
                ...(isSaving ? styles.saveButtonDisabled : {}),
              }}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParameterCreate;