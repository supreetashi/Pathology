import { useState } from "react";
import styles from "./FormTemplate.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

type FieldType = "text" | "date" | "boolean" | "decimal" | "time" | "dropdown" | "upload";
type LayoutType = "heading" | "divider" | "1col" | "2col" | "3col";

interface FormField {
  id: string;
  type: FieldType;
  label: string;
  mandatory: boolean;
  multiLine?: boolean;
  options?: string[];
}

interface FormSection {
  id: string;
  layout: LayoutType;
  headingText?: string;
  subText?: string;
  columns: FormField[][];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 9);

const colCount = (layout: LayoutType) => {
  if (layout === "1col") return 1;
  if (layout === "2col") return 2;
  if (layout === "3col") return 3;
  return 0;
};

const defaultField = (type: FieldType): FormField => ({
  id: uid(),
  type,
  label:
    type === "text" ? "Text" :
    type === "date" ? "Date" :
    type === "boolean" ? "Boolean" :
    type === "decimal" ? "Decimal" :
    type === "time" ? "Time" :
    type === "dropdown" ? "Dropdown" : "Upload File",
  mandatory: false,
  multiLine: false,
  options: type === "dropdown" ? ["Option 1", "Option 2"] : undefined,
});

// ─── Inline SVG Icons ─────────────────────────────────────────────────────────

const Icons = {
  Heading: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12h16M4 6h16M4 18h10"/>
    </svg>
  ),
  Divider: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="6" x2="21" y2="6" strokeOpacity="0.3"/>
      <line x1="3" y1="18" x2="21" y2="18" strokeOpacity="0.3"/>
    </svg>
  ),
  OneCol: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
    </svg>
  ),
  TwoCol: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <line x1="12" y1="3" x2="12" y2="21"/>
    </svg>
  ),
  ThreeCol: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <line x1="9" y1="3" x2="9" y2="21"/>
      <line x1="15" y1="3" x2="15" y2="21"/>
    </svg>
  ),
  Text: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 7 4 4 20 4 20 7"/>
      <line x1="9" y1="20" x2="15" y2="20"/>
      <line x1="12" y1="4" x2="12" y2="20"/>
    </svg>
  ),
  Date: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Boolean: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  ),
  Decimal: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="9" x2="20" y2="9"/>
      <line x1="4" y1="15" x2="20" y2="15"/>
      <circle cx="7" cy="19" r="1" fill="currentColor" stroke="none"/>
    </svg>
  ),
  Time: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <polyline points="12 7 12 12 15 15"/>
    </svg>
  ),
  Dropdown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="18" height="12" rx="2"/>
      <polyline points="9 11 12 14 15 11"/>
    </svg>
  ),
  Upload: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  ),
  MoveUp: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15"/>
    </svg>
  ),
  MoveDown: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  Close: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
};

// ─── Sidebar config ───────────────────────────────────────────────────────────

const LAYOUT_ELEMENTS: { label: string; type: LayoutType; Icon: () => JSX.Element }[] = [
  { label: "Heading",  type: "heading", Icon: Icons.Heading  },
  { label: "Divider",  type: "divider", Icon: Icons.Divider  },
  { label: "1 Column", type: "1col",    Icon: Icons.OneCol   },
  { label: "2 Column", type: "2col",    Icon: Icons.TwoCol   },
  { label: "3 Column", type: "3col",    Icon: Icons.ThreeCol },
];

const FORM_ELEMENTS: { label: string; type: FieldType; Icon: () => JSX.Element }[] = [
  { label: "Text",        type: "text",     Icon: Icons.Text     },
  { label: "Date",        type: "date",     Icon: Icons.Date     },
  { label: "Boolean",     type: "boolean",  Icon: Icons.Boolean  },
  { label: "Decimal",     type: "decimal",  Icon: Icons.Decimal  },
  { label: "Time",        type: "time",     Icon: Icons.Time     },
  { label: "Dropdown",    type: "dropdown", Icon: Icons.Dropdown },
  { label: "Upload File", type: "upload",   Icon: Icons.Upload   },
];

// ─── Field Preview ────────────────────────────────────────────────────────────

function FieldPreview({ field }: { field: FormField }) {
  const label = (
    <label className={styles.fieldLabel}>
      {field.label}
      {field.mandatory && <span className={styles.required}> *</span>}
    </label>
  );

  if (field.type === "text") return (
    <div className={styles.fieldWrap}>
      {label}
      {field.multiLine
        ? <textarea className={styles.input} style={{ height: 56, resize: "none" }} placeholder="Enter Here" readOnly />
        : <input className={styles.input} placeholder="Enter Here" readOnly />}
    </div>
  );

  if (field.type === "date") return (
    <div className={styles.fieldWrap}>
      {label}
      <div className={styles.dateWrap}>
        <input className={styles.input} placeholder="Select Date" readOnly />
        <span className={styles.calIcon}>
          <Icons.Date />
        </span>
      </div>
    </div>
  );

  if (field.type === "boolean") return (
    <div className={styles.fieldWrap} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <input type="checkbox" readOnly />
      <label className={styles.fieldLabel}>
        {field.label}{field.mandatory && <span className={styles.required}> *</span>}
      </label>
    </div>
  );

  if (field.type === "decimal") return (
    <div className={styles.fieldWrap}>
      {label}
      <input className={styles.input} type="number" placeholder="0.00" readOnly />
    </div>
  );

  if (field.type === "time") return (
    <div className={styles.fieldWrap}>
      {label}
      <input className={styles.input} type="time" readOnly />
    </div>
  );

  if (field.type === "dropdown") return (
    <div className={styles.fieldWrap}>
      {label}
      <select className={styles.input}>
        <option>Select</option>
        {field.options?.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );

  if (field.type === "upload") return (
    <div className={styles.fieldWrap}>
      {label}
      <div className={styles.uploadBox}>
        <Icons.Upload /> Click to upload
      </div>
    </div>
  );

  return null;
}

// ─── Properties Panel ─────────────────────────────────────────────────────────

interface SelectedTarget {
  type: "field" | "heading" | "divider";
  sectionId: string;
  colIdx?: number;
  fieldIdx?: number;
}

function PropertiesPanel({
  target, sections, onUpdate, onDelete, onClose,
}: {
  target: SelectedTarget;
  sections: FormSection[];
  onUpdate: (s: FormSection[]) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const section = sections.find((s) => s.id === target.sectionId)!;

  if (target.type === "heading") return (
    <div className={styles.propPanel}>
      <div className={styles.propHeader}>
        <span className={styles.propTitle}>Heading</span>
        <button className={styles.propClose} onClick={onClose}><Icons.Close /></button>
      </div>
      <label className={styles.propLabel}>Heading</label>
      <input className={styles.propInput} value={section.headingText || ""}
        onChange={(e) => onUpdate(sections.map((s) =>
          s.id === target.sectionId ? { ...s, headingText: e.target.value } : s))} />
      <label className={styles.propLabel}>Sub Text</label>
      <input className={styles.propInput} placeholder="Type Here" value={section.subText || ""}
        onChange={(e) => onUpdate(sections.map((s) =>
          s.id === target.sectionId ? { ...s, subText: e.target.value } : s))} />
      <button className={styles.propDelete} onClick={onDelete}>Delete</button>
    </div>
  );

  if (target.type === "divider") return (
    <div className={styles.propPanel}>
      <div className={styles.propHeader}>
        <span className={styles.propTitle}>Divider</span>
        <button className={styles.propClose} onClick={onClose}><Icons.Close /></button>
      </div>
      <p style={{ fontSize: 12, color: "#888", margin: 0 }}>No properties for divider.</p>
      <button className={styles.propDelete} onClick={onDelete}>Delete</button>
    </div>
  );

  if (target.type === "field") {
    const field = section.columns[target.colIdx!][target.fieldIdx!];
    const updateField = (patch: Partial<FormField>) =>
      onUpdate(sections.map((s) => {
        if (s.id !== target.sectionId) return s;
        return {
          ...s,
          columns: s.columns.map((col, ci) =>
            ci !== target.colIdx ? col :
            col.map((f, fi) => fi !== target.fieldIdx ? f : { ...f, ...patch })),
        };
      }));

    return (
      <div className={styles.propPanel}>
        <div className={styles.propHeader}>
          <span className={styles.propTitle}>{field.label}</span>
          <button className={styles.propClose} onClick={onClose}><Icons.Close /></button>
        </div>

        <label className={styles.propLabel}>Label</label>
        <input className={styles.propInput} value={field.label}
          onChange={(e) => updateField({ label: e.target.value })} />

        <label className={styles.propLabel}>
          <input type="checkbox" checked={field.mandatory}
            onChange={(e) => updateField({ mandatory: e.target.checked })}
            style={{ marginRight: 6 }} />
          Mandatory
        </label>

        {field.type === "text" && (
          <>
            <label className={styles.propLabel}>Type</label>
            <label className={styles.radioLabel}>
              <input type="radio" checked={!field.multiLine} onChange={() => updateField({ multiLine: false })} />
              Single Line
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" checked={!!field.multiLine} onChange={() => updateField({ multiLine: true })} />
              Multi Line
            </label>
          </>
        )}

        {field.type === "dropdown" && (
          <>
            <label className={styles.propLabel}>Options</label>
            {field.options?.map((opt, oi) => (
              <div key={oi} className={styles.optionRow}>
                <input className={styles.propInput} style={{ flex: 1, marginBottom: 0 }} value={opt}
                  onChange={(e) => {
                    const opts = [...(field.options || [])];
                    opts[oi] = e.target.value;
                    updateField({ options: opts });
                  }} />
                <button className={styles.propDelete} style={{ marginTop: 0, padding: "4px 8px" }}
                  onClick={() => updateField({ options: (field.options || []).filter((_, i) => i !== oi) })}>
                  <Icons.Close />
                </button>
              </div>
            ))}
            <button className={styles.propAddBtn}
              onClick={() => updateField({ options: [...(field.options || []), "New Option"] })}>
              + Add Option
            </button>
          </>
        )}

        <button className={styles.propDelete} onClick={onDelete}>Delete</button>
      </div>
    );
  }

  return null;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function FormTemplate() {
  const [sections, setSections] = useState<FormSection[]>([]);
  const [selected, setSelected] = useState<SelectedTarget | null>(null);
  const [dragOverCanvas, setDragOverCanvas] = useState(false);
  const [dragOverCol, setDragOverCol] = useState<{ sId: string; col: number } | null>(null);

  const onSidebarDragStart = (e: React.DragEvent, itemType: string) => {
    e.dataTransfer.setData("itemType", itemType);
  };

  const onCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const itemType = e.dataTransfer.getData("itemType");
    if (!itemType) return;
    const isLayout = LAYOUT_ELEMENTS.find((l) => l.type === itemType);
    if (isLayout) {
      const cols = colCount(itemType as LayoutType);
      setSections((prev) => [...prev, {
        id: uid(),
        layout: itemType as LayoutType,
        headingText: itemType === "heading" ? "Heading" : undefined,
        subText: itemType === "heading" ? "Subheading Text" : undefined,
        columns: Array.from({ length: cols }, () => []),
      }]);
    }
    setDragOverCanvas(false);
  };

  const onColDrop = (e: React.DragEvent, sectionId: string, colIdx: number) => {
    e.preventDefault();
    e.stopPropagation();
    const itemType = e.dataTransfer.getData("itemType");
    if (!itemType) return;
    const isField = FORM_ELEMENTS.find((f) => f.type === itemType);
    if (isField) {
      setSections((prev) => prev.map((s) =>
        s.id !== sectionId ? s : {
          ...s,
          columns: s.columns.map((col, ci) =>
            ci === colIdx ? [...col, defaultField(itemType as FieldType)] : col),
        }));
    }
    setDragOverCol(null);
  };

  const deleteSection = (sectionId: string) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    setSelected(null);
  };

  const deleteField = (sectionId: string, colIdx: number, fieldIdx: number) => {
    setSections((prev) => prev.map((s) =>
      s.id !== sectionId ? s : {
        ...s,
        columns: s.columns.map((col, ci) =>
          ci === colIdx ? col.filter((_, fi) => fi !== fieldIdx) : col),
      }));
    setSelected(null);
  };

  const moveSection = (idx: number, dir: -1 | 1) => {
    setSections((prev) => {
      const arr = [...prev];
      const swap = idx + dir;
      if (swap < 0 || swap >= arr.length) return arr;
      [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
      return arr;
    });
  };

  return (
    <div className={styles.root}>

      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarTitle}>Elements</span>
        </div>

        <p className={styles.sectionLabel}>LAYOUT ELEMENTS</p>
        {LAYOUT_ELEMENTS.map((el) => (
          <div
            key={el.type}
            draggable
            onDragStart={(e) => onSidebarDragStart(e, el.type)}
            className={styles.sidebarItem}
          >
            <span className={styles.sidebarIcon}><el.Icon /></span>
            <span>{el.label}</span>
          </div>
        ))}

        <p className={`${styles.sectionLabel} ${styles.sectionLabelMt}`}>FORM ELEMENTS</p>
        {FORM_ELEMENTS.map((el) => (
          <div
            key={el.type}
            draggable
            onDragStart={(e) => onSidebarDragStart(e, el.type)}
            className={styles.sidebarItem}
          >
            <span className={styles.sidebarIcon}><el.Icon /></span>
            <span>{el.label}</span>
          </div>
        ))}
      </aside>

      {/* ── Canvas ── */}
      <div
        className={`${styles.canvas} ${dragOverCanvas ? styles.canvasDragOver : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragOverCanvas(true); }}
        onDragLeave={() => setDragOverCanvas(false)}
        onDrop={onCanvasDrop}
        onClick={(e) => { if (e.currentTarget === e.target) setSelected(null); }}
      >
        {sections.length === 0 && (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>Drag &amp; Drop Elements</p>
            <p className={styles.emptySubtitle}>
              Simply Drag &amp; Drop elements from left panel in to this area to build template
            </p>
          </div>
        )}

        {sections.map((section, si) => (
          <div key={section.id} className={styles.sectionWrap}>

            <div className={styles.sectionControls}>
              <button className={styles.ctrlBtn} onClick={() => moveSection(si, -1)}><Icons.MoveUp /></button>
              <button className={styles.ctrlBtn} onClick={() => moveSection(si, 1)}><Icons.MoveDown /></button>
            </div>

            {section.layout === "heading" && (
              <div
                className={`${styles.headingEl} ${selected?.sectionId === section.id && selected.type === "heading" ? styles.headingElSelected : ""}`}
                onClick={(e) => { e.stopPropagation(); setSelected({ type: "heading", sectionId: section.id }); }}>
                <div className={styles.headingText}>{section.headingText || "Heading"}</div>
                <div className={styles.subText}>{section.subText || "Subheading Text"}</div>
              </div>
            )}

            {section.layout === "divider" && (
              <div
                className={`${styles.dividerEl} ${selected?.sectionId === section.id && selected.type === "divider" ? styles.dividerElSelected : ""}`}
                onClick={(e) => { e.stopPropagation(); setSelected({ type: "divider", sectionId: section.id }); }}>
                <hr />
              </div>
            )}

            {["1col", "2col", "3col"].includes(section.layout) && (
              <div className={styles.colRow}
                style={{ gridTemplateColumns: `repeat(${colCount(section.layout)}, 1fr)` }}>
                {section.columns.map((col, ci) => (
                  <div key={ci}
                    className={`${styles.colSlot} ${dragOverCol?.sId === section.id && dragOverCol.col === ci ? styles.colSlotDragOver : ""}`}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOverCol({ sId: section.id, col: ci }); }}
                    onDragLeave={() => setDragOverCol(null)}
                    onDrop={(e) => onColDrop(e, section.id, ci)}>
                    {col.length === 0 && <span className={styles.colPlaceholder}>Drag &amp; drop Element here</span>}
                    {col.map((field, fi) => (
                      <div key={field.id}
                        className={`${styles.fieldEl} ${selected?.sectionId === section.id && selected.colIdx === ci && selected.fieldIdx === fi ? styles.fieldElSelected : ""}`}
                        onClick={(e) => { e.stopPropagation(); setSelected({ type: "field", sectionId: section.id, colIdx: ci, fieldIdx: fi }); }}>
                        <FieldPreview field={field} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Properties Panel ── */}
      {selected && (
        <PropertiesPanel
          target={selected}
          sections={sections}
          onUpdate={setSections}
          onDelete={() => {
            if (selected.type === "field") deleteField(selected.sectionId, selected.colIdx!, selected.fieldIdx!);
            else deleteSection(selected.sectionId);
          }}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}