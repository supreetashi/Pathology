import { useEffect, useState } from "react";
import styles from "../../../styles/Configuration/SampleTube/CreateSampleTubeModal.module.css";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
interface Props {
  isOpen: boolean;
  type: "Sample" | "Tube";
  mode?: "create" | "edit";

  initialCode?: string;
  initialName?: string;

  onClose: () => void;

  onSave: (code: string, name: string) => void;
}

function CreateSampleTubeModal({
  isOpen,
  type,
  mode,
  initialCode,
  initialName,
  onClose,
  onSave,
}: Props) {
  const [code, setCode] = useState(initialCode || "");
  const [name, setName] = useState(initialName || "");

  const handleSave = () => {
    if (!code.trim() || !name.trim()) return;

    onSave(code.trim(), name.trim());

    setCode("");
    setName("");

    onClose();
  };

  useEffect(() => {
    setCode(initialCode || "");
    setName(initialName || "");
  }, [initialCode, initialName, isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.title}>
            {mode === "edit" ? `Edit ${type}` : `Create New ${type}`}
          </span>

          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>

        <div className={styles.body}>
          <div className={styles.fieldWrapper}>
            <span className={styles.label}>{type} Code</span>

            <input
              className={styles.input}
              type="text"
              value={code}
              placeholder={`Enter ${type} Code`}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <div className={styles.fieldWrapper}>
            <span className={styles.label}>{type} Name</span>

            <input
              className={styles.input}
              type="text"
              value={name}
              placeholder={`Enter ${type} Name`}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="button"
              className={styles.saveButton}
              disabled={!code.trim() || !name.trim()}
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateSampleTubeModal;