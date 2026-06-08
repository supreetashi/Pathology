import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import CloseCircleIcon from "../../../assets/icons/close-circle.svg";
import type { AppDispatch } from "../../../store";
import type { MachineItem } from "../../../types/Machine.types";
import { createMachine, updateMachine } from "../../../store/MachineSlice";
import "../../../styles/Configuration/Machine/Machinecreate.css";

type Option = {
  id: string;
  name: string;
};

type MachineCreateProps = {
  isOpen: boolean;
  mode: "create" | "edit";
  initialValue: MachineItem | null;
  clinicId: string;
  parameterOptions: Option[];
  onClose: () => void;
  onSave?: () => void;
};

function MachineCreate({
  isOpen,
  mode,
  initialValue,
  clinicId,
  parameterOptions,
  onClose,
  onSave,
}: MachineCreateProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [selectedParameterIds, setSelectedParameterIds] = useState<string[]>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ code?: string; name?: string }>({});

  useEffect(() => {
    if (!isOpen) return;

    if (initialValue) {
      setCode(initialValue.machineCode);
      setName(initialValue.machineName);
      setSelectedParameterIds(initialValue.machineParameterIds);
    } else {
      setCode("");
      setName("");
      setSelectedParameterIds([]);
    }

    setIsPickerOpen(false);
    setErrors({});
  }, [isOpen, initialValue]);

  const selectedOptions = useMemo(() => {
    const map = new Map(parameterOptions.map((o) => [o.id, o.name]));
    return selectedParameterIds
      .map((id) => ({ id, name: map.get(id) ?? "Unknown" }))
      .filter((item) => item.name !== "Unknown");
  }, [parameterOptions, selectedParameterIds]);

  if (!isOpen) return null;

  const validate = () => {
    const next: { code?: string; name?: string } = {};
    if (!code.trim()) next.code = "Machine code is required";
    if (!name.trim()) next.name = "Machine name is required";
    if (!clinicId?.trim()) {
      toast.error("No clinic selected. Please select a clinic before adding a machine.");
      return false;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    if (!validate() || isSaving) return;
    setIsSaving(true);

    try {
      let result: any;

      if (mode === "edit" && initialValue) {
        result = await dispatch(
          updateMachine({
            id: initialValue.id,
            payload: {
              clinic: initialValue.clinicId,
              machine_code: code.trim(),
              machine_name: name.trim(),
              machine_parameter_ids: selectedParameterIds,
            },
          }),
        );
      } else {
        result = await dispatch(
          createMachine({
            clinic: clinicId.trim(),
            machine_code: code.trim(),
            machine_name: name.trim(),
            machine_parameter_ids: selectedParameterIds,
          }),
        );
      }

      if (result?.error) {
        toast.error(
          typeof result.payload === "string"
            ? result.payload
            : "Failed to save machine. Please check the details and try again.",
        );
        return;
      }

      toast.success(
        mode === "edit"
          ? "Machine updated successfully."
          : "Machine created successfully.",
      );

      onSave?.();
      onClose();
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const heading = mode === "create" ? "Add New Machine" : "Edit Machine";

  return (
    <div className="machine-create-overlay" onClick={onClose}>
      <div className="machine-create-modal" onClick={(e) => e.stopPropagation()}>
        <div className="machine-create-head">
          <h2 className="machine-create-title">{heading}</h2>
          <button type="button" className="machine-create-close-button" onClick={onClose}>
            <img src={CloseCircleIcon} alt="Close" width={24} height={24} />
          </button>
        </div>

        <div className="machine-create-body">
          <label className="machine-create-field-wrap">
            <span className="machine-create-label">Machine Code</span>
            <input
              value={code}
              className={`machine-create-input${errors.code ? " machine-create-input--error" : ""}`}
              onChange={(e) => {
                setCode(e.target.value);
                if (errors.code) setErrors((prev) => ({ ...prev, code: undefined }));
              }}
              placeholder="MN-041421"
            />
            {errors.code && (
              <span className="machine-create-error-text">{errors.code}</span>
            )}
          </label>

          <label className="machine-create-field-wrap">
            <span className="machine-create-label">Machine Name</span>
            <input
              value={name}
              className={`machine-create-input${errors.name ? " machine-create-input--error" : ""}`}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="Clinical Chemistry Analyzer"
            />
            {errors.name && (
              <span className="machine-create-error-text">{errors.name}</span>
            )}
          </label>

          <div className="machine-create-field-wrap">
            <span className="machine-create-label">Link Parameter</span>
            <button
              type="button"
              className="machine-create-select-button"
              onClick={() => setIsPickerOpen((prev) => !prev)}
            >
              <span>
                {selectedOptions.length === 0
                  ? "Search & select parameter"
                  : "Select more parameters"}
              </span>
              <span className="machine-create-caret" />
            </button>

            {isPickerOpen && (
              <div className="machine-create-options-box">
                <div className="machine-create-options-list">
                  {parameterOptions.length === 0 ? (
                    <button
                      type="button"
                      className="machine-create-option machine-create-option--empty"
                    >
                      No parameter found
                    </button>
                  ) : (
                    parameterOptions.map((option) => {
                      const isSelected = selectedParameterIds.includes(option.id);
                      return (
                        <button
                          key={option.id}
                          type="button"
                          className="machine-create-option"
                          onClick={() => {
                            setSelectedParameterIds((prev) =>
                              isSelected
                                ? prev.filter((id) => id !== option.id)
                                : [...prev, option.id],
                            );
                          }}
                        >
                          <span>{option.name}</span>
                          <span
                            className={`machine-create-option-indicator${
                              isSelected ? " machine-create-option-indicator--selected" : ""
                            }`}
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
              <div className="machine-create-chips">
                {selectedOptions.map((option) => (
                  <span key={option.id} className="machine-create-chip">
                    {option.name}
                    <button
                      type="button"
                      className="machine-create-chip-remove"
                      onClick={() =>
                        setSelectedParameterIds((prev) =>
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

          <div className="machine-create-footer">
            <button
              type="button"
              className="machine-create-cancel-button"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="machine-create-save-button"
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

export default MachineCreate;