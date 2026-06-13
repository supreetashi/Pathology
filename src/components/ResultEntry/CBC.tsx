import React, { useEffect, useState } from "react";
import "./CBC.css";
// import { Result } from "./types";
import { Result } from "./types";

import Chromosome from "./Chromosome";

import Ellipse_12 from "../../assets/icons/Ellipse_12.svg";
import UndoIconAsset from "../../assets/icons/undo.png";
import {
  getResultEntryDetails,
  ResultEntryDetails,
} from "../../services/resultEntry.api";

interface Props {
  onBack: () => void;
  data: Result;
  initialMode?: "edit" | "view";
}

interface SidebarItem {
  label: string;
  checked: boolean;
}

// const INITIAL_PARAMETERS: SidebarItem[] = [
//   { label: "Select All", checked: false },
//   { label: "HIV (Rapid Card)", checked: true },
//   { label: "HCV (Rapid Card)", checked: true },
//   { label: "HBaSG (Rapid Card)", checked: false },
//   { label: "(CBC) Complete Bl...", checked: true },
// ];

const INITIAL_TEMPLATES: SidebarItem[] = [
  { label: "Testosteron Total", checked: true },
  { label: "VDRL (Rapid Card)", checked: false },
  { label: "Blood Glucose (RBS)", checked: false },
];

const previousResults: Record<
  string,
  { date: string; param: string; value: string }[]
> = {
  "Heamoglobin (hb)": [
    { date: "04/02/2026", param: "Heamoglobin (hb)", value: "13.2 g/dL" },
    { date: "26/10/2025", param: "Heamoglobin (hb)", value: "12.8 g/dL" },
    { date: "29/12/2024", param: "Heamoglobin (hb)", value: "13.0 g/dL" },
  ],
  RDW: [
    { date: "04/02/2026", param: "RDW", value: "12.5 %" },
    { date: "26/10/2025", param: "RDW", value: "13.1 %" },
    { date: "29/12/2024", param: "RDW", value: "12.9 %" },
  ],
  MCHC: [
    { date: "04/02/2026", param: "MCHC", value: "31 g/dL" },
    { date: "26/10/2025", param: "MCHC", value: "33 g/dL" },
    { date: "29/12/2024", param: "MCHC", value: "32 g/dL" },
  ],
};

const CBC: React.FC<Props> = ({ onBack, data, initialMode = "edit" }) => {
  const [isEdit, setIsEdit] = useState(initialMode === "edit");
  const [activeTab, setActiveTab] = useState("");
  const [modalParam, setModalParam] = useState<string | null>(null);
  const [templates, setTemplates] = useState<SidebarItem[]>(INITIAL_TEMPLATES);
  const [details, setDetails] = useState<ResultEntryDetails | null>(null);
  const parameters: SidebarItem[] = [
    {
      label: "Select All",
      checked: true,
    },
    ...(details?.parameters?.map((p) => ({
      label: p.parameter_name,
      checked: true,
    })) ?? []),
  ];

  React.useEffect(() => {
    setIsEdit(initialMode === "edit");
  }, [initialMode]);

  useEffect(() => {
    if (!data?.id) return;

    getResultEntryDetails(data.id).then(setDetails).catch(console.error);
  }, [data.id]);

  // const testTabs = [
  //   "HIV (Rapid Card)",
  //   "HCV (Rapid Card)",
  //   "(CBC) Complete Blood Count",
  //   "Y Chromosome Microdeletion",
  // ];
  const testTabs = [details?.test?.test_name ?? "Loading..."];

  // const toggleParameter = (index: number) => {
  //   setParameters((prev) => {
  //     // First row controls all test checkboxes.
  //     if (index === 0) {
  //       const nextChecked = !prev[0].checked;
  //       return prev.map((item) => ({ ...item, checked: nextChecked }));
  //     }

  //     const next = prev.map((item, i) =>
  //       i === index ? { ...item, checked: !item.checked } : item,
  //     );
  //     const allChecked = next.slice(1).every((item) => item.checked);
  //     next[0] = { ...next[0], checked: allChecked };
  //     return next;
  //   });
  // };

  const toggleTemplate = (index: number) => {
    setTemplates((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item,
      ),
    );
  };

  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    if (!details?.parameters) return;

    setTableData(
      details.parameters.map((p) => ({
        param: p.parameter_name,
        category: details.patient.gender,
        type: "Manual",
        operator: "=",
        value: "",
        ref: `${p.min_ref} - ${p.max_ref} ${p.unit}`,
        auth: `${p.min_authz} - ${p.max_authz}`,
        varying: [
          {
            label: details.patient.gender,
            val: p.varying_reference_range ?? "-",
          },
        ],
        status: [],
        warn: false,
      })),
    );
  }, [details]);

  const updateRow = (
    index: number,
    field: "operator" | "value",
    val: string,
  ) => {
    setTableData((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: val } : row)),
    );
  };

  const statusClass = (s: string) => {
    switch (s.toLowerCase()) {
      case "normal":
        return "status normal";
      case "abnormal":
        return "status abnormal";
      case "panic":
        return "status panic";
      case "improbable":
        return "status improbable";
      case "reflex":
        return "status reflex";
      default:
        return "status";
    }
  };

  const PreviousModal = () => {
    const modalData = modalParam ? (previousResults[modalParam] ?? []) : [];
    return (
      <div className="modal-overlay" onClick={() => setModalParam(null)}>
        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Previous Result</h3>
            <button className="modal-close" onClick={() => setModalParam(null)}>
              ✕
            </button>
          </div>
          <div className="modal-divider" />
          <table className="modal-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Parameter Name</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {modalData.map((row, i) => (
                <tr key={i}>
                  <td>{row.date}</td>
                  <td>{row.param}</td>
                  <td>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderRows = (editable: boolean) =>
    tableData.map((row, i) => (
      <tr key={i}>
        <td>{row.param}</td>
        <td>{row.category}</td>
        <td>{row.type}</td>
        <td>
          {editable ? (
            <div className="select-wrap">
              <select
                value={row.operator}
                onChange={(e) => updateRow(i, "operator", e.target.value)}
              >
                <option value="Select">Select</option>
                <option value="=">=</option>
                <option value="+">+</option>
                <option value="-">-</option>
              </select>
            </div>
          ) : (
            row.operator
          )}
        </td>
        <td>
          {editable ? (
            <div className="spinner-wrap">
              <input
                type="number"
                value={row.value}
                onChange={(e) => updateRow(i, "value", e.target.value)}
              />
              <div className="spinner-arrows">
                <button
                  onClick={() =>
                    updateRow(
                      i,
                      "value",
                      String((parseFloat(row.value) + 0.1).toFixed(1)),
                    )
                  }
                >
                  ▲
                </button>
                <button
                  onClick={() =>
                    updateRow(
                      i,
                      "value",
                      String((parseFloat(row.value) - 0.1).toFixed(1)),
                    )
                  }
                >
                  ▼
                </button>
              </div>
            </div>
          ) : (
            row.value
          )}
        </td>
        <td>{row.ref}</td>
        <td>{row.auth}</td>
        <td className="varying-cell">
          {row.varying.map((v: { label: string; val: string }, vi: number) => (
            <div key={vi} className="varying-row">
              <span className="varying-label">{v.label}</span>
              <span className="varying-val">{v.val}</span>
            </div>
          ))}
        </td>
        <td>
          <div className="status-wrap">
            {row.status.map((s: string, si: number) => (
              <span key={si} className={statusClass(s)}>
                {s}
              </span>
            ))}
          </div>
        </td>
        <td>
          {row.warn ? (
            <button
              className="warn-icon-btn"
              onClick={() => setModalParam(row.param)}
              title="View previous results"
            >
              !
            </button>
          ) : (
            <span className="no-warn">-</span>
          )}
        </td>
      </tr>
    ));
  if (activeTab === "Y Chromosome Microdeletion") {
    return (
      <Chromosome
        onBack={() => setActiveTab("")}
        data={data}
        initialMode={isEdit ? "edit" : "view"}
        startInEditor
      />
    );
  }

  if (isEdit) {
    return (
      <div className="cbc-edit-wrapper">
        {modalParam && <PreviousModal />}

        <div className="cbc-header">
          <button className="back-btn" onClick={onBack}>
            <img src={UndoIconAsset} alt="Back" className="back-btn-icon" />
          </button>
          <h2>Add Result Details</h2>
        </div>

        <div className="cbc-patient-card">
          <img src={Ellipse_12} alt="profile" />

          <div className="cbc-patient-info">
            <div className="pi-field">
              <span>Patient Name</span>
              <strong>{data.patient}</strong>
            </div>
            <div className="pi-field">
              <span>Age</span>
              <strong>{details?.patient.age} Years</strong>
            </div>
            <div className="pi-field">
              <span>Sex Assigned At Birth</span>
              <strong>{details?.patient.gender}</strong>
            </div>
            <div className="pi-field">
              <span>MRN</span>
              <strong>{details?.patient.patient_code}</strong>
            </div>
            <div className="pi-field">
              <span>Allergy</span>
              <strong>No</strong>
            </div>
            <div className="pi-field">
              <span>SART ID</span>
              <strong>14SKG9876432</strong>
            </div>
            <div className="pi-field">
              <span>Last Modified</span>
              <strong>{data.date}</strong>
            </div>
          </div>
        </div>

        <div className="cbc-body">
          <div className="cbc-sidebar">
            <div className="sidebar-section-title">PARAMETER</div>
            {parameters.map((p, i) => (
              <label
                key={i}
                className="sidebar-item"
                onClick={() => {}}
                style={{ cursor: "pointer" }}
              >
                <span className={`sidebar-check ${p.checked ? "checked" : ""}`}>
                  {p.checked && <span>✓</span>}
                </span>
                {p.label}
              </label>
            ))}
            <div className="sidebar-section-title" style={{ marginTop: 20 }}>
              TEMPLATE
            </div>
            {templates.map((t, i) => (
              <label
                key={i}
                className="sidebar-item"
                onClick={() => toggleTemplate(i)}
                style={{ cursor: "pointer" }}
              >
                <span className={`sidebar-check ${t.checked ? "checked" : ""}`}>
                  {t.checked && <span>✓</span>}
                </span>
                {t.label}
              </label>
            ))}
            <button className="get-test-btn">Get Test</button>
          </div>

          <div className="cbc-main">
            <div className="cbc-tabs">
              {testTabs.map((tab, i) => (
                <button
                  key={i}
                  className={`cbc-tab ${
                    tab === "(CBC) Complete Blood Count" ? "active" : ""
                  }`}
                  onClick={() => {
                    if (tab === "Y Chromosome Microdeletion") {
                      setActiveTab(tab);
                    }
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="cbc-table-wrap">
              <table className="cbc-table">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Category</th>
                    <th>Machine/Manual</th>
                    <th>Operator</th>
                    <th>Result Value</th>
                    <th>Reference Range</th>
                    <th>AuthZ Range</th>
                    <th>Varying Ref. Range</th>
                    <th>Result Status</th>
                    <th>Previous</th>
                  </tr>
                </thead>
                <tbody>{renderRows(true)}</tbody>
              </table>
            </div>

            <div className="cbc-notes-row">
              <div className="cbc-note-field">
                <label>Suggestion Note</label>
                <textarea defaultValue={details?.test?.suggestion_note ?? ""} />
              </div>
              <div className="cbc-note-field">
                <label>Foot Note</label>
                <textarea defaultValue={details?.test?.disclaimer ?? ""} />
              </div>
            </div>

            <div className="cbc-bottom-row">
              <div className="cbc-input-field">
                <label>Referred By</label>
                <input type="text" defaultValue="Dr. Soniya S." />
              </div>
              <div className="cbc-input-field">
                <label>Pathologist</label>
                <div className="select-wrap">
                  <select defaultValue="John Wick">
                    <option>John Wick</option>
                    <option>Dr. Smith</option>
                  </select>
                </div>
              </div>
              <div className="cbc-action-btns">
                <button className="cancel-btn" onClick={() => setIsEdit(false)}>
                  Cancel
                </button>
                <button className="save-btn" onClick={() => setIsEdit(false)}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cbc-view-wrapper">
      {modalParam && <PreviousModal />}

      <div className="cbc-header">
        <button className="back-btn" onClick={onBack}>
          <img src={UndoIconAsset} alt="Back" className="back-btn-icon" />
        </button>
        <h2>View Result Details</h2>
        <button className="print-btn" style={{ marginLeft: "auto" }}>
          🖨
        </button>
      </div>

      <div className="cbc-patient-card">
        <img src={Ellipse_12} alt="profile" />
        <div className="cbc-patient-info">
          <div className="pi-field">
            <span>Patient Name</span>
            <strong>{data.patient}</strong>
          </div>
          <div className="pi-field">
            <span>Age</span>
            <strong>{details?.patient.age} Years</strong>
          </div>
          <div className="pi-field">
            <span>Sex Assigned At Birth</span>
            <strong>{details?.patient.gender}</strong>
          </div>
          <div className="pi-field">
            <span>MRN</span>
            <strong>{details?.patient.patient_code}</strong>
          </div>
          <div className="pi-field">
            <span>Allergy</span>
            <strong>No</strong>
          </div>
          <div className="pi-field">
            <span>SART ID</span>
            <strong>14SKG9876432</strong>
          </div>
          <div className="pi-field">
            <span>Last Modified</span>
            <strong>{data.date}</strong>
          </div>
          <div className="pi-field">
            <span>Referred By</span>
            <strong>Soniya</strong>
          </div>
          <div className="pi-field">
            <span>Pathologist</span>
            <strong>John Wick</strong>
          </div>
        </div>
      </div>

      <div className="cbc-tabs">
        {testTabs.map((tab, i) => (
          <button
            key={i}
            className={`cbc-tab ${tab === "(CBC) Complete Blood Count" ? "active" : ""}`}
            onClick={() => {
              if (tab === "Y Chromosome Microdeletion") {
                setActiveTab(tab);
              }
            }}
          >
            {tab}
          </button>
        ))}
        <button className="print-btn tab-print">🖨</button>
      </div>

      <div className="cbc-table-wrap">
        <table className="cbc-table">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Category</th>
              <th>Machine/Manual</th>
              <th>Operator</th>
              <th>Result Value</th>
              <th>Reference Range</th>
              <th>AuthZ Range</th>
              <th>Varying Ref. Range</th>
              <th>Result Status</th>
              <th>Previous</th>
            </tr>
          </thead>
          <tbody>{renderRows(false)}</tbody>
        </table>
      </div>

      <div className="cbc-footer-notes">
        <div>
          <span className="note-label">Suggestion Note :</span>
          <p>
            Hb Within Normal Range. Continue Routine Monitoring If Clinically
            Required.
          </p>
        </div>
        <div>
          <span className="note-label">Foot Note :</span>
          <p>
            Reference Ranges May Vary Depending On Age, Gender, And Clinical
            Condition.
          </p>
        </div>
      </div>

      <div className="view-edit-row">
        <button className="save-btn" onClick={() => setIsEdit(true)}>
          Edit
        </button>
      </div>
    </div>
  );
};

export default CBC;
