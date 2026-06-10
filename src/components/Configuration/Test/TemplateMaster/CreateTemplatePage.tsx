import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "./CreateTemplatePage.module.css";
import BackIcon from "../../../../assets/icons/back_icon.svg";
import undo from "../../../../assets/icons/undo.svg";
import redo from "../../../../assets/icons/redo.svg";
import { createTemplate, updateTemplate } from "../../../../store/templateSlice";
import { selectClinic } from "../../../../store/clinicSlice";
import type { AppDispatch } from "../../../../store";
import type { TemplateItem } from "../../../../types/template.types";
import { selectLaboratoryTests, fetchLaboratoryTests } from "../../../../store/laboratoryTestSlice";
import FormTemplate from "./FormTemplate";

// ─── Types ────────────────────────────────────────────────────────────────────

type FormState = {
  templateCode: string;
  templateName: string;
  templateFor: string;
  gender: string;
  userType: string;
  serviceName: string;
  templateFormat: "TEXT" | "FORM";
};

// ─── Constants ────────────────────────────────────────────────────────────────

const TEMPLATE_FOR_OPTIONS = ["LEAD", "PATHOLOGY", "RADIOLOGY", "EXAMINATION", "INVESTIGATION", "SURGERY", "OUTCOME"];
const TEMPLATE_FOR_LABELS: Record<string, string> = {
  LEAD: "Lead", PATHOLOGY: "Pathology", RADIOLOGY: "Radiology",
  EXAMINATION: "Examination", INVESTIGATION: "Investigation", SURGERY: "Surgery", OUTCOME: "Outcome",
};
const GENDER_OPTIONS = ["MALE", "FEMALE", "BOTH"];
const GENDER_LABELS: Record<string, string> = { MALE: "Male", FEMALE: "Female", BOTH: "Both" };
const USER_TYPE_OPTIONS = ["PATHOLOGIST", "RADIOLOGIST"];
const USER_TYPE_LABELS: Record<string, string> = { PATHOLOGIST: "Pathologist", RADIOLOGIST: "Radiologist" };
const FONT_FAMILIES = ["Nunito", "Montserrat", "Georgia", "Courier New", "Arial"];

const DEFAULT_CONTENT = `<p><strong>RESULTS:</strong></p>
<p><strong>AZFa Region:</strong><br/>STS markers (SRY, SY84, SY86) were analyzed. No deletion detected.</p>
<p><strong>AZFb Region:</strong><br/>STS markers (SY127, SY134) were analyzed. No deletion detected.</p>
<p><strong>AZFc Region:</strong><br/>STS markers (SY254, SY255) were analyzed. Partial deletion observed.</p>
<p><strong>AZFd Region:</strong><br/>STS marker (SY157) analyzed. No deletion detected.</p>
<p><strong>INTERPRETATION:</strong></p>
<p>A partial deletion in the AZFc region is identified, which may be associated with impaired sperm production and infertility.</p>`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function FloatSelect({ label, value, options, optionLabels, onChange }: {
  label: string; value: string; options: string[];
  optionLabels?: Record<string, string>; onChange: (v: string) => void;
}) {
  return (
    <div className={styles.formGroup}>
      <div className={styles.fieldBorder}>
        <span className={styles.floatLabel}>{label}</span>
        <select className={styles.floatSelect} value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((o) => <option key={o} value={o}>{optionLabels?.[o] ?? o}</option>)}
        </select>
      </div>
    </div>
  );
}

function FloatInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className={styles.formGroup}>
      <div className={styles.fieldBorder}>
        <span className={styles.floatLabel}>{label}</span>
        <input className={styles.floatInput} value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  );
}

function ToolbarBtn({ title, onClick, children }: { title: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" title={title} className={styles.toolbarBtn}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}>
      {children}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CreateTemplatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const clinic = useSelector(selectClinic);

  const editData = location.state?.templateData as TemplateItem | undefined;
  const isEditMode = location.state?.mode === "edit";
    const [formSections, setFormSections] = useState<any[]>(
  editData?.templateJson ? JSON.parse(editData.templateJson) : []
);
  const laboratoryTests = useSelector(selectLaboratoryTests);

  useEffect(() => {
  dispatch(fetchLaboratoryTests());
}, [dispatch]);

  const [form, setForm] = useState<FormState>({
    templateCode: editData?.code ?? "",
    templateName: editData?.name ?? "",
    templateFor: editData?.templateFor ?? "LEAD",
    gender: editData?.gender ?? "BOTH",
    userType: editData?.userType ?? "PATHOLOGIST",
    serviceName: editData?.serviceName ?? "",
    templateFormat: (editData?.templateFormat as "TEXT" | "FORM") ?? "TEXT",
  });

  const [fontFamily, setFontFamily] = useState("Nunito");
  const [fontSize, setFontSize] = useState("13");
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML.trim()) {
      editorRef.current.innerHTML = editData?.templateText ?? DEFAULT_CONTENT;
    }
  }, []);

  const set = (field: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const exec = useCallback((cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
  }, []);

  const loadTemplate = (tag: string) => {
    if (!editorRef.current) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const el = document.createElement(tag === "T" ? "p" : tag.toLowerCase());
    el.innerHTML = tag === "T" ? "Text block" : `${tag} Heading`;
    range.deleteContents();
    range.insertNode(el);
    range.setStartAfter(el);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    editorRef.current.focus();
  };

  const applyStyleToSelection = useCallback((property: "fontFamily" | "fontSize", value: string) => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    const span = document.createElement("span");
    span.style[property] = value;
    try { range.surroundContents(span); } catch {
      const fragment = range.extractContents();
      span.appendChild(fragment);
      range.insertNode(span);
    }
    sel.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    sel.addRange(newRange);
    editorRef.current?.focus();
  }, []);

  const handleSave = async () => {
    if (!clinic?.id) return;

    const payload = {
      clinic: clinic.id,
      template_code: form.templateCode,
      template_name: form.templateName,
      template_for: form.templateFor,
      gender: form.gender,
      user_type: form.userType,
      service_name: form.serviceName,
      template_format: form.templateFormat,
      template_text: form.templateFormat === "TEXT" ? (editorRef.current?.innerHTML ?? "") : null,
      template_json: form.templateFormat === "FORM" ? JSON.stringify(formSections) : null,
      status: true,
    };

    if (isEditMode && editData) {
      await dispatch(updateTemplate({ id: editData.id, ...payload }));
    } else {
      await dispatch(createTemplate(payload));
    }
    navigate("/pathology/configuration/test");
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <button type="button" className={styles.backBtn} onClick={() => navigate(-1)}>
            <img src={BackIcon} alt="back" className={styles.backIcon} />
          </button>
          <h2 className={styles.pageTitle}>
            {isEditMode ? "Edit Template" : "Create New Template"}
          </h2>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <p className={styles.sectionTitle}>Basic Details</p>
            <div className={styles.formGrid}>
              <FloatSelect label="Template For" value={form.templateFor}
                options={TEMPLATE_FOR_OPTIONS} optionLabels={TEMPLATE_FOR_LABELS}
                onChange={(v) => set("templateFor", v)} />
              <FloatInput label="Template Name" value={form.templateName} onChange={(v) => set("templateName", v)} />
              <FloatSelect label="Gender" value={form.gender}
                options={GENDER_OPTIONS} optionLabels={GENDER_LABELS}
                onChange={(v) => set("gender", v)} />
              <FloatSelect label="User Type" value={form.userType}
                options={USER_TYPE_OPTIONS} optionLabels={USER_TYPE_LABELS}
                onChange={(v) => set("userType", v)} />
            </div>
            <div className={styles.formGrid}>
              <FloatInput label="Template Code" value={form.templateCode} onChange={(v) => set("templateCode", v)} />
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
            </div>
          </div>

          <div className={styles.section}>
            <hr className={styles.sectionDivider} />
            <p className={styles.sectionTitle}>Types of Template Format</p>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input type="radio" name="templateFormat" value="TEXT"
                  checked={form.templateFormat === "TEXT"}
                  onChange={() => set("templateFormat", "TEXT")} />
                Text
              </label>
              <label className={styles.radioLabel}>
                <input type="radio" name="templateFormat" value="FORM"
                  checked={form.templateFormat === "FORM"}
                  onChange={() => set("templateFormat", "FORM")} />
                Form
              </label>
            </div>
          </div>

          {form.templateFormat === "TEXT" && (
            <div className={styles.section}>
              <p className={styles.sectionTitle}>Text Format</p>
              <div className={styles.editorCard}>
                <div className={styles.toolbarWrapper}>
                  <div className={styles.toolbarGroup}>
                    <span className={styles.toolbarGroupLabel}>Load Template</span>
                    <div className={styles.toolbarGroupBtns}>
                      {["H1", "H2", "H3", "SH1", "SH2", "SH3", "T"].map((tag) => (
                        <button key={tag} type="button" className={styles.loadBtn} onClick={() => loadTemplate(tag)}>{tag}</button>
                      ))}
                    </div>
                  </div>
                  <div className={styles.toolbarSep} />
                  <div className={styles.toolbarGroup}>
                    <span className={styles.toolbarGroupLabel}>Custom Options</span>
                    <div className={styles.toolbarGroupBtns}>
                      <ToolbarBtn title="Undo" onClick={() => exec("undo")}>
                        <img src={undo} alt="undo" width={16} height={16} />
                      </ToolbarBtn>
                      <ToolbarBtn title="Redo" onClick={() => exec("redo")}>
                        <img src={redo} alt="redo" width={16} height={16} />
                      </ToolbarBtn>
                      <div className={styles.toolbarDivider} />
                      <select className={styles.toolbarSelect} value={fontFamily}
                        onChange={(e) => { setFontFamily(e.target.value); applyStyleToSelection("fontFamily", e.target.value); }}>
                        {FONT_FAMILIES.map((f) => <option key={f}>{f}</option>)}
                      </select>
                      <div className={styles.fontSizeControl}>
                        <button type="button" className={styles.fontSizeBtn}
                          onMouseDown={(e) => { e.preventDefault(); const n = String(Math.max(8, parseInt(fontSize) - 1)); setFontSize(n); applyStyleToSelection("fontSize", `${n}px`); }}>−</button>
                        <span className={styles.fontSizeValue}>{fontSize}</span>
                        <button type="button" className={styles.fontSizeBtn}
                          onMouseDown={(e) => { e.preventDefault(); const n = String(Math.min(72, parseInt(fontSize) + 1)); setFontSize(n); applyStyleToSelection("fontSize", `${n}px`); }}>+</button>
                      </div>
                      <div className={styles.toolbarDivider} />
                      <ToolbarBtn title="Bold" onClick={() => exec("bold")}><strong style={{ fontSize: "0.9em" }}>B</strong></ToolbarBtn>
                      <ToolbarBtn title="Italic" onClick={() => exec("italic")}><em style={{ fontSize: "0.9em" }}>I</em></ToolbarBtn>
                      <ToolbarBtn title="Underline" onClick={() => exec("underline")}><span style={{ textDecoration: "underline", fontSize: "0.9em" }}>U</span></ToolbarBtn>
                      <div className={styles.colorPickerWrap} title="Text Color">
                        <span style={{ fontSize: "0.85em", fontWeight: 700 }}>A</span>
                        <input type="color" className={styles.colorPicker} onChange={(e) => exec("foreColor", e.target.value)} />
                      </div>
                      <div className={styles.toolbarDivider} />
                      <ToolbarBtn title="Align Left" onClick={() => exec("justifyLeft")}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <line x1="17" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" />
                          <line x1="21" y1="14" x2="3" y2="14" /><line x1="17" y1="18" x2="3" y2="18" />
                        </svg>
                      </ToolbarBtn>
                      <ToolbarBtn title="Align Center" onClick={() => exec("justifyCenter")}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <line x1="18" y1="10" x2="6" y2="10" /><line x1="21" y1="6" x2="3" y2="6" />
                          <line x1="21" y1="14" x2="3" y2="14" /><line x1="18" y1="18" x2="6" y2="18" />
                        </svg>
                      </ToolbarBtn>
                      <ToolbarBtn title="Align Right" onClick={() => exec("justifyRight")}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <line x1="21" y1="10" x2="7" y2="10" /><line x1="21" y1="6" x2="3" y2="6" />
                          <line x1="21" y1="14" x2="3" y2="14" /><line x1="21" y1="18" x2="7" y2="18" />
                        </svg>
                      </ToolbarBtn>
                      <div className={styles.toolbarDivider} />
                      <ToolbarBtn title="Bullet List" onClick={() => exec("insertUnorderedList")}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <line x1="9" y1="6" x2="20" y2="6" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="9" y1="18" x2="20" y2="18" />
                          <circle cx="4" cy="6" r="1" fill="currentColor" /><circle cx="4" cy="12" r="1" fill="currentColor" /><circle cx="4" cy="18" r="1" fill="currentColor" />
                        </svg>
                      </ToolbarBtn>
                      <ToolbarBtn title="Numbered List" onClick={() => exec("insertOrderedList")}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" />
                          <path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
                        </svg>
                      </ToolbarBtn>
                      <ToolbarBtn title="Strikethrough" onClick={() => exec("strikeThrough")}>
                        <span style={{ textDecoration: "line-through", fontSize: "0.9em" }}>S</span>
                      </ToolbarBtn>
                    </div>
                  </div>
                </div>
                <div ref={editorRef} className={styles.editor} contentEditable suppressContentEditableWarning />
              </div>
            </div>
          )}

       {form.templateFormat === "FORM" && (
  <div className={styles.section}>
    <p className={styles.sectionTitle}>Form Format</p>
    <div style={{ height: "500px", border: "1px solid #E2E3E5", borderRadius: "10px", overflow: "hidden" }}>
      <FormTemplate
  value={formSections}
  onChange={setFormSections}
/>
    </div>
  </div>
)}
        </div>

        <div className={styles.footerActions}>
          <button type="button" className={styles.cancelBtn} onClick={() => navigate(-1)}>Cancel</button>
          <button type="button" className={styles.saveBtn} onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}