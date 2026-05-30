import { useState } from "react";
import styles from "../../../styles/Configuration/SampleTube/CreateSampleTubeModal.module.css";

interface Props {
  isOpen: boolean;
  type: "Sample" | "Tube";
  onClose: () => void;
  onSave: (code: string, name: string) => void;
}

function CreateSampleTubeModal({ isOpen, type, onClose, onSave }: Props) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    if (!code.trim() || !name.trim()) return;

    onSave(code.trim(), name.trim());

    setCode("");
    setName("");

    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.title}>Create New {type}</span>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            ×
          </button>
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
