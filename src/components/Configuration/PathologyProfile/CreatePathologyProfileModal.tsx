import { useState, useRef, useEffect } from "react";
import styles from "../../../styles/Configuration/SampleTube/CreateSampleTubeModal.module.css";
import stylesTest from "../Test/TestMaster/CreateTestPage.module.css";
import CloseCircleIcon from "../../../assets/icons/close-circle.svg";
import { selectServiceNames } from "../../../store/pathologyProfileSlice";
import { useSelector } from "react-redux";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (tests: string, name: string) => void;
}

type SelectableItem = {
    id: string;
    code: string;
    name: string;
};

const ALL_PARAMETERS: SelectableItem[] = [
    { id: "p1", code: "154214", name: "Sodium (Serum)" },
    { id: "p2", code: "154215", name: "Sodium (Serum)" },
    { id: "p3", code: "154216", name: "Sodium (Serum)" },
    { id: "p4", code: "154217", name: "Sodium (Serum)" },
    { id: "p5", code: "BM501", name: "Potassium (Serum)" },
    { id: "p6", code: "CM302", name: "Chloride (Serum)" },
];

function FloatSelect({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: string;
    options: any[];
    onChange: (v: string) => void;
}) {
    return (
        <div className={stylesTest.formGroup}>
            <div className={stylesTest.fieldBorder}>
                <span className={stylesTest.floatLabel}>{label}</span>
                <select
                    className={stylesTest.floatSelect}
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
                alignRight ? stylesTest.sampleDropdownWrapper : stylesTest.searchDropdownWrapper
            }
            ref={ref}
        >
            <div
                className={stylesTest.dropdownTrigger}
                onClick={() => setOpen((o) => !o)}
            >
                <span className={stylesTest.dropdownPlaceholder}>{placeholder}</span>
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
                    className={stylesTest.dropdownPanel}
                    style={alignRight ? { right: 0, left: "auto" } : { left: 0 }}
                    ref={listRef}
                >
                    {items.map((item, idx) => (
                        <div key={item.id}>
                            <div
                                className={stylesTest.dropdownRow}
                                onClick={() => onToggle(item.id)}
                            >
                                <span
                                    className={
                                        selectedIds.includes(item.id)
                                            ? stylesTest.roundCheckOn
                                            : stylesTest.roundCheckOff
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
                            {idx < items.length - 1 && (
                                <div className={stylesTest.dropdownDivider} />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

type FormState = {
    serviceName: string;
    tests: any[];
};


function CreatePathologyProfileModal({ isOpen, onClose, onSave }: Props) {
    const [tests, setTests] = useState("");
    const [name, setName] = useState("");
    // const SERVICE_OPTIONS = ["", "Natural Killer Self Panel", "Panel A", "Panel B"];
    const SERVICE_OPTIONS = useSelector(selectServiceNames);
    const [selectedParamIds, setSelectedParamIds] = useState<string[]>([
        "p1",
        "p2",
        "p3",
        "p4",
    ]);
    const [form, setForm] = useState<FormState>({
        serviceName: "",
        tests: [],
    });
    const selectedParams = ALL_PARAMETERS.filter((p) =>
        selectedParamIds.includes(p.id),
    );
    const set = (field: keyof FormState, value: string | boolean) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const toggleParam = (id: string) =>
        setSelectedParamIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );

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

                    <FloatSelect
                        label="Service Name"
                        value={form.serviceName}
                        options={SERVICE_OPTIONS}
                        onChange={(v) => set("serviceName", v)}
                    />


                    <div className={styles.section}>
                        <p className={styles.sectionTitle}>Test</p>

                        <FigmaDropdown
                            placeholder={"Search & Select Test"}
                            items={ALL_PARAMETERS}
                            selectedIds={selectedParamIds}
                            onToggle={toggleParam}
                        />

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
                                        <img
                                            src={CloseCircleIcon}
                                            alt="remove"
                                            width={16}
                                            height={16}
                                        />
                                    </button>
                                </span>
                            ))}
                        </div>

                    </div>
                    {/* <div className={styles.fieldWrapper}>
                        <span className={styles.label}>Service</span>

                        <input
                            className={styles.input}
                            type="text"
                            value={name}
                            placeholder={`Enter Service`}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div> */}

                    {/* <div className={styles.fieldWrapper}>
                        <span className={styles.label}>Tests</span>

                        <input
                            className={styles.input}
                            type="text"
                            value={tests}
                            placeholder={`Enter Test`}
                            onChange={(e) => setTests(e.target.value)}
                        />
                    </div> */}

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
