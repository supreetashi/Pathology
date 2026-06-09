import { useEffect, useMemo, useRef, useState } from "react";
import "./Chromosome.css";
import { Result } from "./types";
import { FiPlusCircle, FiSearch, FiXCircle } from "react-icons/fi";
import UndoOutlinedIcon from "@mui/icons-material/UndoOutlined";
import RedoOutlinedIcon from "@mui/icons-material/RedoOutlined";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import FormatClearIcon from "@mui/icons-material/FormatClear";
import Ellipse_12 from "../../assets/icons/Ellipse_12.svg";
import UndoIconAsset from "../../assets/icons/undo.png";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

const FontClass = Quill.import("attributors/class/font") as any;
const SizeStyle = Quill.import("attributors/style/size") as any;

FontClass.whitelist = ["nunito", "plus-jakarta-sans", "arial", "times-new-roman"];
SizeStyle.whitelist = ["10px", "11px", "12px", "13px", "14px", "16px", "18px", "20px", "24px", "28px", "32px"];

Quill.register(FontClass, true);
Quill.register(SizeStyle, true);

interface Props {
  onBack: () => void;
  data?: Result;
  initialMode?: "edit" | "view";
  startInEditor?: boolean;
}

const tabs = [
  "HIV (Rapid Card)",
  "HCV (Rapid Card)",
  "(CBC) Complete Blood Count",
  "Y Chromosome Microdeletion",
];

const INITIAL_REPORT_HTML = `
  <p><strong>RESULTS:</strong></p>
  <p><strong>AZFa Region:</strong><br />STS markers (SRY, SY84, SY86) were analyzed. No deletion detected.</p>
  <p><strong>AZFb Region:</strong><br />STS markers (SY127, SY134) were analyzed. No deletion detected.</p>
  <p><strong>AZFc Region:</strong><br />STS markers (SY254, SY255) were analyzed. Partial deletion observed.</p>
  <p><strong>AZFd Region:</strong><br />STS marker (SY157) analyzed. No deletion detected.</p>
  <p><strong>INTERPRETATION:</strong></p>
  <p>The Y chromosome contains critical regions responsible for spermatogenesis.</p>
`;

const FONT_OPTIONS = [
  { value: "nunito", label: "Nunito" },
  { value: "plus-jakarta-sans", label: "Plus Jakarta Sans" },
  { value: "arial", label: "Arial" },
  { value: "times-new-roman", label: "Times New Roman" },
] as const;

type FontOptionValue = (typeof FONT_OPTIONS)[number]["value"];
const SIZE_OPTIONS = [10, 11, 12, 13, 14, 16, 18, 20, 24, 28, 32];

type ToolbarState = {
  header: number | false;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strike: boolean;
  blockquote: boolean;
  align: "left" | "center" | "right" | "";
  list: "bullet" | "ordered" | "";
  hasColor: boolean;
};

const DEFAULT_TOOLBAR_STATE: ToolbarState = {
  header: false,
  bold: false,
  italic: false,
  underline: false,
  strike: false,
  blockquote: false,
  align: "",
  list: "",
  hasColor: false,
};

const Chromosome = ({
  onBack,
  data,
  initialMode = "view",
  startInEditor = false,
}: Props) => {
  const [activeTab, setActiveTab] = useState("Y Chromosome Microdeletion");
  const [showCreate, setShowCreate] = useState(startInEditor);
  const [isViewMode, setIsViewMode] = useState(initialMode === "view");
  const [fontFamily, setFontFamily] = useState<FontOptionValue>("nunito");
  const [selectedParamIndex, setSelectedParamIndex] = useState(0);
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
  const [fontSize, setFontSize] = useState(13);
  const [textTransformMode, setTextTransformMode] = useState("none");
  const [toolbarState, setToolbarState] = useState<ToolbarState>(DEFAULT_TOOLBAR_STATE);
  const [isQuotedSelection, setIsQuotedSelection] = useState(false);
  const [reportHtml, setReportHtml] = useState(INITIAL_REPORT_HTML);
  const [suggestionNote, setSuggestionNote] = useState(
    "Hb Within Normal Range. Continue Routine Monitoring If Clinically Required."
  );
  const [footNote, setFootNote] = useState(
    "Reference Ranges May Vary Depending On Age, Gender, And Clinical Condition."
  );
  const [referredBy, setReferredBy] = useState("Dr. Soniya S.");
  const [pathologist, setPathologist] = useState("John Wick");
  const quillRef = useRef<ReactQuill | null>(null);
  const colorInputRef = useRef<HTMLInputElement | null>(null);
  const lastRangeRef = useRef<{ index: number; length: number } | null>(null);
  const getEditor = () => quillRef.current?.getEditor();

  const getActiveRange = () => {
    const editor = getEditor();

    if (!editor) {
      return null;
    }

    editor.focus();
    let range = editor.getSelection();

    if (!range) {
      if (lastRangeRef.current) {
        range = lastRangeRef.current;
        editor.setSelection(range.index, range.length, "silent");
        return range;
      }

      const length = editor.getLength();
      const index = Math.max(0, length - 1);
      editor.setSelection(index, 0, "silent");
      range = editor.getSelection();
    }

    if (range) {
      lastRangeRef.current = { index: range.index, length: range.length };
    }

    return range;
  };

  const syncEditorHtml = () => {
    const editor = getEditor();
    if (editor) {
      setReportHtml(editor.root.innerHTML);
    }
  };

  const runFormat = (format: string, value: string | boolean | number | null) => {
    if (isViewMode) {
      return;
    }

    const editor = getEditor();
    if (!editor) {
      return;
    }

    const range = getActiveRange();
    if (!range) {
      return;
    }

    editor.format(format, value, "user");
    syncEditorHtml();
    syncToolbarState(range);
  };

  const applyFontFamily = (font: FontOptionValue) => {
    if (isViewMode) {
      return;
    }

    const editor = getEditor();
    const range = getActiveRange();

    if (!editor || !range) {
      return;
    }

    if (range.length > 0) {
      editor.formatText(range.index, range.length, "font", font, "user");
      editor.setSelection(range.index, range.length, "silent");
    } else {
      const [line] = editor.getLine(range.index);

      if (line) {
        const lineIndex = editor.getIndex(line);
        const lineLength = Math.max(1, line.length() - 1);
        editor.formatText(lineIndex, lineLength, "font", font, "user");
        editor.setSelection(range.index, 0, "silent");
      } else {
        editor.format("font", font, "user");
      }
    }

    syncEditorHtml();
    const updatedRange = editor.getSelection() ?? range;
    syncToolbarState(updatedRange);
    syncQuoteState(updatedRange);
  };

  const syncToolbarState = (range?: { index: number; length: number } | null) => {
    const editor = getEditor();

    if (!editor || !range) {
      setToolbarState(DEFAULT_TOOLBAR_STATE);
      return;
    }

    const formats = editor.getFormat(range);
    const headerFormat = formats.header;
    const nextHeader =
      typeof headerFormat === "number"
        ? headerFormat
        : typeof headerFormat === "string"
          ? Number.parseInt(headerFormat, 10) || false
          : Array.isArray(headerFormat) && typeof headerFormat[0] === "number"
            ? headerFormat[0]
            : false;
    const nextAlign =
      formats.align === "left" || formats.align === "center" || formats.align === "right"
        ? formats.align
        : "";
    const nextList = formats.list === "bullet" || formats.list === "ordered" ? formats.list : "";

    setToolbarState({
      header: nextHeader,
      bold: Boolean(formats.bold),
      italic: Boolean(formats.italic),
      underline: Boolean(formats.underline),
      strike: Boolean(formats.strike),
      blockquote: Boolean(formats.blockquote),
      align: nextAlign,
      list: nextList,
      hasColor: Boolean(formats.color),
    });

    const fontFormat = formats.font;
    const normalizedFont =
      typeof fontFormat === "string"
        ? fontFormat
        : Array.isArray(fontFormat) && typeof fontFormat[0] === "string"
          ? fontFormat[0]
          : "";

    if (FONT_OPTIONS.some((option) => option.value === normalizedFont)) {
      setFontFamily(normalizedFont as FontOptionValue);
    }

    if (typeof formats.size === "string") {
      const parsedSize = Number.parseInt(formats.size, 10);
      if (Number.isFinite(parsedSize) && SIZE_OPTIONS.includes(parsedSize)) {
        setFontSize(parsedSize);
      }
    }
  };

  const toggleFormat = (
    format: string,
    enabledValue: string | boolean,
    disabledValue: string | boolean | null = false
  ) => {
    if (isViewMode) {
      return;
    }

    const editor = getEditor();
    if (!editor) {
      return;
    }

    const range = getActiveRange();
    if (!range) {
      return;
    }

    const formats = editor.getFormat(range);
    const current = formats[format];
    const isActive =
      enabledValue === true
        ? Boolean(current)
        : Array.isArray(current)
          ? current.includes(enabledValue)
          : current === enabledValue;

    editor.format(format, isActive ? disabledValue : enabledValue, "user");
    syncEditorHtml();
    syncToolbarState(range);
  };

  const handleHistoryAction = (type: "undo" | "redo") => {
    if (isViewMode) {
      return;
    }

    const editor = getEditor();
    if (!editor) {
      return;
    }

    if (type === "undo") {
      editor.history.undo();
    } else {
      editor.history.redo();
    }

    syncEditorHtml();
    const range = editor.getSelection();
    syncToolbarState(range);
    syncQuoteState(range);
  };

  const syncQuoteState = (range?: { index: number; length: number } | null) => {
    const editor = getEditor();

    if (!editor || !range || range.length <= 0) {
      setIsQuotedSelection(false);
      return;
    }

    const selectedText = editor.getText(range.index, range.length).trim();
    setIsQuotedSelection(selectedText.length >= 2 && selectedText.startsWith('"') && selectedText.endsWith('"'));
  };

  const toggleInlineQuotes = () => {
    if (isViewMode) {
      return;
    }

    const editor = getEditor();
    const range = getActiveRange();

    if (!editor || !range) {
      return;
    }

    if (range.length <= 0) {
      editor.insertText(range.index, '""', "user");
      editor.setSelection(range.index + 1, 0, "silent");
      syncEditorHtml();
      syncQuoteState({ index: range.index, length: 2 });
      return;
    }

    const selectedText = editor.getText(range.index, range.length);
    const isAlreadyQuoted = selectedText.startsWith('"') && selectedText.endsWith('"') && selectedText.length >= 2;
    const nextText = isAlreadyQuoted ? selectedText.slice(1, -1) : `"${selectedText}"`;

    editor.deleteText(range.index, range.length, "user");
    editor.insertText(range.index, nextText, "user");
    editor.setSelection(range.index, nextText.length, "silent");
    syncEditorHtml();
    syncQuoteState({ index: range.index, length: nextText.length });
  };

  const applyTextTransform = (mode: string) => {
    if (isViewMode) {
      return;
    }

    const editor = getEditor();
    const range = getActiveRange();

    if (!editor || !range || range.length <= 0) {
      setTextTransformMode(mode);
      return;
    }

    const selectedText = editor.getText(range.index, range.length);

    let transformed = selectedText;
    if (mode === "upper") {
      transformed = selectedText.toUpperCase();
    } else if (mode === "lower") {
      transformed = selectedText.toLowerCase();
    } else if (mode === "title") {
      transformed = selectedText.replace(/\w\S*/g, (word) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      );
    }

    if (transformed !== selectedText) {
      editor.deleteText(range.index, range.length, "user");
      editor.insertText(range.index, transformed, "user");
      editor.setSelection(range.index, transformed.length, "silent");
      syncEditorHtml();
    }

    setTextTransformMode(mode);
  };

  const handleToolbarAction = (action: () => void) => (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    action();
  };

  const applyHeading = (tag: "H1" | "H2" | "H3" | "H4" | "H5" | "H6" | "P") => {
    const editor = getEditor();

    if (!editor || isViewMode) {
      return;
    }

    const range = getActiveRange();
    if (!range) {
      return;
    }

    const nextHeader = tag === "P" ? false : Number(tag.slice(1));
    const currentHeaderFormat = editor.getFormat(range).header;
    const currentHeader =
      typeof currentHeaderFormat === "number"
        ? currentHeaderFormat
        : typeof currentHeaderFormat === "string"
          ? Number.parseInt(currentHeaderFormat, 10) || false
          : false;
    const valueToApply = currentHeader === nextHeader ? false : nextHeader;

    const targetLength = Math.max(range.length, 1);
    const lines = editor.getLines(range.index, targetLength);

    if (lines.length > 0) {
      lines.forEach((line) => {
        const lineIndex = editor.getIndex(line);
        editor.formatLine(lineIndex, 1, "header", valueToApply, "user");
      });
      editor.setSelection(range.index, range.length, "silent");
    } else {
      editor.format("header", valueToApply, "user");
    }

    syncEditorHtml();
    syncToolbarState(range);
  };

  useEffect(() => {
    setIsViewMode(initialMode === "view");
  }, [initialMode]);

  useEffect(() => {
    setShowCreate(startInEditor);
  }, [startInEditor]);

  useEffect(() => {
    if (isViewMode) {
      setToolbarState(DEFAULT_TOOLBAR_STATE);
    }
  }, [isViewMode]);

  const isStyleActive = (styleButton: string) => {
    if (styleButton === "H1") return toolbarState.header === 1;
    if (styleButton === "H2") return toolbarState.header === 2;
    if (styleButton === "H3") return toolbarState.header === 3;
    if (styleButton === "SH1") return toolbarState.header === 4;
    if (styleButton === "SH2") return toolbarState.header === 5;
    if (styleButton === "SH3") return toolbarState.header === 6;
    return toolbarState.header === false;
  };

  const quillModules = useMemo(
    () => ({
      toolbar: false,
      history: {
        delay: 300,
        maxStack: 100,
        userOnly: true,
      },
    }),
    []
  );

  if (!data) {
    return (
      <div style={{ padding: 20 }}>
        <h2>No Data Found</h2>
        <button onClick={onBack}>Back</button>
      </div>
    );
  }

  const editorPanel = (
    <>
      <div className="editor-toolbar">
        <div className="toolbar-section">
          <p className="toolbar-title">STYLES</p>
          <div className="toolbar-chip-row">
            {["H1", "H2", "H3", "SH1", "SH2", "SH3", "T"].map((btn) => (
              <button
                key={btn}
                className={`toolbar-chip ${isStyleActive(btn) ? "active" : ""}`}
                type="button"
                disabled={isViewMode}
                onMouseDown={handleToolbarAction(() => {
                  if (btn === "H1") applyHeading("H1");
                  else if (btn === "H2") applyHeading("H2");
                  else if (btn === "H3") applyHeading("H3");
                  else if (btn === "SH1") applyHeading("H4");
                  else if (btn === "SH2") applyHeading("H5");
                  else if (btn === "SH3") applyHeading("H6");
                  else applyHeading("P");
                })}
              >
                {btn}
              </button>
            ))}
          </div>
        </div>

        <div className="toolbar-section toolbar-section-wide">
          <p className="toolbar-title">CUSTOM OPTIONS</p>
          <div className="toolbar-custom-row">
            <div className="tool-group">
              <button className="tool-btn" type="button" aria-label="Undo" disabled={isViewMode} onMouseDown={handleToolbarAction(() => handleHistoryAction("undo"))}><UndoOutlinedIcon fontSize="small" /></button>
              <button className="tool-btn" type="button" aria-label="Redo" disabled={isViewMode} onMouseDown={handleToolbarAction(() => handleHistoryAction("redo"))}><RedoOutlinedIcon fontSize="small" /></button>
            </div>

            <div className="tool-divider" />

            <div className="tool-group">
              <select
                className="tool-select-native"
                value={fontFamily}
                disabled={isViewMode}
                onMouseDown={() => {
                  const selection = getEditor()?.getSelection();
                  if (selection) {
                    lastRangeRef.current = { index: selection.index, length: selection.length };
                  }
                }}
                onChange={(event) => {
                  const nextFont = event.target.value as FontOptionValue;
                  setFontFamily(nextFont);
                  applyFontFamily(nextFont);
                }}
              >
                {FONT_OPTIONS.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>

              <select
                className="tool-select-native"
                value={textTransformMode}
                disabled={isViewMode}
                onChange={(event) => applyTextTransform(event.target.value)}
              >
                <option value="none">Tt</option>
                <option value="upper">UPPER</option>
                <option value="lower">lower</option>
                <option value="title">Title</option>
              </select>
            </div>

            <div className="tool-divider" />

            <div className="tool-group">
              <button
                className="tool-btn"
                type="button"
                disabled={isViewMode}
                onMouseDown={handleToolbarAction(() => {
                  setFontSize((prev) => {
                    const nextValue = SIZE_OPTIONS[Math.max(0, SIZE_OPTIONS.indexOf(prev) - 1)] ?? prev;
                    runFormat("size", `${nextValue}px`);
                    return nextValue;
                  });
                })}
              >
                −
              </button>
              <span className="tool-value">{fontSize}</span>
              <button
                className="tool-btn"
                type="button"
                disabled={isViewMode}
                onMouseDown={handleToolbarAction(() => {
                  setFontSize((prev) => {
                    const currentIndex = SIZE_OPTIONS.indexOf(prev);
                    const nextValue = SIZE_OPTIONS[Math.min(SIZE_OPTIONS.length - 1, currentIndex + 1)] ?? prev;
                    runFormat("size", `${nextValue}px`);
                    return nextValue;
                  });
                })}
              >
                +
              </button>
            </div>

            <div className="tool-divider" />

            <div className="tool-group">
              <button className={`tool-btn ${toolbarState.bold ? "active" : ""}`} type="button" disabled={isViewMode} onMouseDown={handleToolbarAction(() => toggleFormat("bold", true))}><FormatBoldIcon fontSize="small" /></button>
              <button className={`tool-btn ${toolbarState.italic ? "active" : ""}`} type="button" disabled={isViewMode} onMouseDown={handleToolbarAction(() => toggleFormat("italic", true))}><FormatItalicIcon fontSize="small" /></button>
              <button className={`tool-btn ${toolbarState.underline ? "active" : ""}`} type="button" disabled={isViewMode} onMouseDown={handleToolbarAction(() => toggleFormat("underline", true))}><FormatUnderlinedIcon fontSize="small" /></button>
              <button className={`tool-btn ${textTransformMode === "title" ? "active" : ""}`} type="button" disabled={isViewMode} onMouseDown={handleToolbarAction(() => applyTextTransform("title"))}>Tt</button>
              <button className={`tool-btn ${toolbarState.hasColor ? "active" : ""}`} type="button" disabled={isViewMode} onMouseDown={handleToolbarAction(() => colorInputRef.current?.click())}><FormatColorTextIcon fontSize="small" /></button>
              <input
                ref={colorInputRef}
                type="color"
                className="hidden-color-input"
                onChange={(event) => {
                  runFormat("color", event.target.value);
                  syncToolbarState(lastRangeRef.current);
                }}
              />
            </div>

            <div className="tool-divider" />

            <div className="tool-group">
              <button className={`tool-btn ${toolbarState.align === "left" ? "active" : ""}`} type="button" disabled={isViewMode} onMouseDown={handleToolbarAction(() => toggleFormat("align", "left"))}><FormatAlignLeftIcon fontSize="small" /></button>
              <button className={`tool-btn ${toolbarState.align === "center" ? "active" : ""}`} type="button" disabled={isViewMode} onMouseDown={handleToolbarAction(() => toggleFormat("align", "center"))}><FormatAlignCenterIcon fontSize="small" /></button>
              <button className={`tool-btn ${toolbarState.align === "right" ? "active" : ""}`} type="button" disabled={isViewMode} onMouseDown={handleToolbarAction(() => toggleFormat("align", "right"))}><FormatAlignRightIcon fontSize="small" /></button>
              <button className={`tool-btn ${toolbarState.list === "bullet" ? "active" : ""}`} type="button" disabled={isViewMode} onMouseDown={handleToolbarAction(() => toggleFormat("list", "bullet"))}><FormatListBulletedIcon fontSize="small" /></button>
              <button className={`tool-btn ${toolbarState.list === "ordered" ? "active" : ""}`} type="button" disabled={isViewMode} onMouseDown={handleToolbarAction(() => toggleFormat("list", "ordered"))}><FormatListNumberedIcon fontSize="small" /></button>
              <button className={`tool-btn ${isQuotedSelection ? "active" : ""}`} type="button" disabled={isViewMode} onMouseDown={handleToolbarAction(() => toggleInlineQuotes())}><FormatQuoteIcon fontSize="small" /></button>
              <button className={`tool-btn ${toolbarState.strike ? "active" : ""}`} type="button" disabled={isViewMode} onMouseDown={handleToolbarAction(() => toggleFormat("strike", true))}><StrikethroughSIcon fontSize="small" /></button>
              <button className="tool-btn" type="button" disabled={isViewMode} onMouseDown={handleToolbarAction(() => {
                const editor = getEditor();
                const range = getActiveRange();
                if (editor && range) {
                  editor.removeFormat(range.index, range.length, "user");
                  syncEditorHtml();
                  syncToolbarState(range);
                }
              })}><FormatClearIcon fontSize="small" /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="editor-box">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          className="editor-main-text quill-clean"
          readOnly={isViewMode}
          value={reportHtml}
          onChange={(value) => {
            setReportHtml(value);
            syncToolbarState(lastRangeRef.current);
            syncQuoteState(lastRangeRef.current);
          }}
          onChangeSelection={(range) => {
            if (range) {
              lastRangeRef.current = { index: range.index, length: range.length };
            }
            syncToolbarState(range);
            syncQuoteState(range);
          }}
          modules={quillModules}
          formats={[
            "header",
            "font",
            "size",
            "bold",
            "italic",
            "underline",
            "strike",
            "color",
            "align",
            "list",
            "blockquote",
          ]}
        />
      </div>

      <div className="editor-footer">
        <div className="top-row">
          <input
            placeholder="Suggestion Note"
            value={suggestionNote}
            onChange={(event) => setSuggestionNote(event.target.value)}
            readOnly={isViewMode}
          />
          <input
            placeholder="Foot Note"
            value={footNote}
            onChange={(event) => setFootNote(event.target.value)}
            readOnly={isViewMode}
          />
        </div>

        <div className="bottom-row">
          <select
            value={referredBy}
            onChange={(event) => setReferredBy(event.target.value)}
            disabled={isViewMode}
          >
            <option value="Dr. Soniya S.">Dr. Soniya S.</option>
            <option value="Dr. Smith R.">Dr. Smith R.</option>
            <option value="Dr. Meera T.">Dr. Meera T.</option>
          </select>
          <select
            value={pathologist}
            onChange={(event) => setPathologist(event.target.value)}
            disabled={isViewMode}
          >
            <option value="John Wick">John Wick</option>
            <option value="Dr. Alen P.">Dr. Alen P.</option>
            <option value="Dr. Kavya N.">Dr. Kavya N.</option>
          </select>
        </div>

        <div className="action-buttons">
          {isViewMode ? (
            <button className="edit-btn" onClick={() => {
              setIsViewMode(false);
              setTimeout(() => getEditor()?.focus(), 0);
            }}>
              Edit
            </button>
          ) : (
            <>
              <button className="cancel-btn" onClick={() => setIsViewMode(true)}>
                Cancel
              </button>
              <button className="save-btn" onClick={() => {
                syncEditorHtml();
                setIsViewMode(true);
              }}>
                Save
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="chromosome-page">
      <div className="chromosome-header">
        <button className="chromosome-back" onClick={onBack}>
          <img src={UndoIconAsset} alt="Back" className="chromosome-back-icon" />
        </button>
        <h2>Add Result Details</h2>
      </div>

      <div className="chromosome-patient-card">
        <img src={Ellipse_12} alt="profile" />
        <div className="chromosome-patient-grid">
          <div><span>Patient Name</span><p>{data.patient}</p></div>
          <div><span>Age</span><p>27 Years</p></div>
          <div><span>Sex Assigned At Birth</span><p>Female</p></div>
          <div><span>MRN</span><p>{data.details}</p></div>
          <div><span>Allergy</span><p>No</p></div>
          <div><span>SART ID</span><p>14SK9876432</p></div>
          <div><span>Last Modified</span><p>{data.date}</p></div>
        </div>
      </div>

      <div className="chromosome-main">
        <div className="chromosome-sidebar">
          <h4>PARAMETER</h4>
          {[
            "Select All",
            "HIV (Rapid Card)",
            "HCV (Rapid Card)",
            "HBsAG (Rapid Card)",
            "(CBC) Complete Blood Count",
          ].map((item, i) => (
            <label
              key={item}
              className={`check-row${selectedParamIndex === i ? " selected" : ""}`}
              onClick={() => setSelectedParamIndex(i)}
              style={{ cursor: "pointer" }}
            >
              <span className={`check-box${selectedParamIndex === i ? " checked" : ""}`}>{selectedParamIndex === i ? "✓" : ""}</span>
              {item}
            </label>
          ))}

          <h4 className="template-title">TEMPLATE</h4>
          {[
            "Y Chromosome Microdeletion",
            "VDRL (Rapid Card)",
            "Blood Glucose (RBS)",
          ].map((item, i) => (
            <label
              key={item}
              className={`check-row${selectedTemplateIndex === i ? " selected" : ""}`}
              onClick={() => setSelectedTemplateIndex(i)}
              style={{ cursor: "pointer" }}
            >
              <span className={`check-box${selectedTemplateIndex === i ? " checked" : ""}`}>{selectedTemplateIndex === i ? "✓" : ""}</span>
              {item}
            </label>
          ))}

          <button className="get-test">Get Test</button>
        </div>

        <div className="chromosome-content">
          <div className="tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={activeTab === tab ? "active" : ""}
                onClick={() => {
                  if (tab === "(CBC) Complete Blood Count") {
                    onBack();
                    return;
                  }
                  setActiveTab(tab);
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className={`chromosome-workspace ${showCreate ? "editor-mode" : ""}`}>
            {showCreate ? (
              editorPanel
            ) : (
              <>
                <button
                  className="create-card"
                  onClick={() => {
                    setIsViewMode(true);
                    setShowCreate(true);
                  }}
                >
                  <FiPlusCircle />
                  <span>Create New</span>
                </button>

                <p className="or">OR</p>

                <div className="template-box">
                  <div className="search-bar">
                    <input value="Dr. Alex Carry" readOnly />
                    <div className="search-actions">
                      <FiXCircle />
                      <FiSearch />
                    </div>
                  </div>

                  <p className="template-list-title">
                    List of Templates for Dr. Alex Carry :
                  </p>

                  <div className="template-list">
                    <div><FiPlusCircle /> Y Chromosome Microdel...</div>
                    <div><FiPlusCircle /> Karyotyping Report</div>
                    <div><FiPlusCircle /> Male Hormone Profile</div>
                    <div><FiPlusCircle /> Basic Semen Analysis</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chromosome;
