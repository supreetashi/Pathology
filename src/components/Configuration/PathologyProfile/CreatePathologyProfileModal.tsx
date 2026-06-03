import { useState } from "react";
import styles from "../../../styles/Configuration/SampleTube/CreateSampleTubeModal.module.css";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (tests: string, name: string) => void;
}

function CreatePathologyProfileModal({ isOpen, onClose, onSave }: Props) {
    const [tests, setTests] = useState("");
    const [name, setName] = useState("");

    if (!isOpen) return null;

    const handleSave = () => {
        if (!tests.trim() || !name.trim()) return;

        onSave(name.trim(), tests.trim());

        setTests("");
        setName("");

        onClose();
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <span className={styles.title}>New Profile</span>

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
                        <span className={styles.label}>Service</span>

                        <input
                            className={styles.input}
                            type="text"
                            value={name}
                            placeholder={`Enter Service`}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className={styles.fieldWrapper}>
                        <span className={styles.label}>Tests</span>

                        <input
                            className={styles.input}
                            type="text"
                            value={tests}
                            placeholder={`Enter Test`}
                            onChange={(e) => setTests(e.target.value)}
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

export default CreatePathologyProfileModal;
