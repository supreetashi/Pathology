import React, { useState } from "react";
import { toast } from "react-toastify";
import "../../styles/Authorization/ResultDetails.css";
import backIcon from "../Authorization/Icons/back-icon.png";
import { AuthorizationItem } from "../../types";
import {
  approveAuthorization,
  rejectAuthorization,
} from "../../services/authorization.api";

type Props = {
  onBack: () => void;
  authorization?: AuthorizationItem | null;
};

type ParameterRow = {
  parameter: string;
  category: string;
  machine: string;
  operator: string;
  resultValue: string;
  referenceRange: string;
  authRange: string;
  status: string;
};

const ResultDetails: React.FC<Props> = ({ onBack, authorization }) => {
  const [submitting, setSubmitting] = useState(false);

  const tests = authorization?.test_name
    ? authorization.test_name.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const [selectedTests, setSelectedTests] = useState<string[]>(tests);
  const [activeTab, setActiveTab] = useState<string>(tests[0] ?? "");

  const [parameters, setParameters] = useState<ParameterRow[]>([]);
  const [showApprovePopup, setShowApprovePopup] = useState(false);

  const handleParameterChange = (
    index: number,
    field: keyof ParameterRow,
    value: string,
  ) => {
    const updated = [...parameters];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setParameters(updated);
  };

  const handleApprove = async () => {
    if (!authorization || submitting) return;

    try {
      setSubmitting(true);
      await approveAuthorization(Number(authorization.id));

      toast.success("Approved Successfully");
      onBack();
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!authorization || submitting) return;

    try {
      setSubmitting(true);
      await rejectAuthorization(Number(authorization.id));

      toast.success("Rejected Successfully");
      onBack();
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="result-container">
      {/* Top Header */}
      <div className="result-header">
        <button className="back-btn" onClick={onBack}>
          <img src={backIcon} alt="back" className="back-icon" />
        </button>
        <h2>View Result Details</h2>
      </div>

      {/* Patient Info Card */}
      <div className="patient-card">
        <div className="patient-grid">
          <div>
            <label>Patient Name</label>
            <p>{authorization?.patient_name ?? "-"}</p>
          </div>
          <div>
            <label>Age</label>
            <p>{authorization?.patient_age ? `${authorization.patient_age} Years` : "-"}</p>
          </div>
          <div>
            <label>Sex Assigned At Birth</label>
            <p>{authorization?.patient_gender ?? "-"}</p>
          </div>
          <div>
            <label>MRN</label>
            <p>{authorization?.patient_code ?? "-"}</p>
          </div>
          <div>
            <label>Bill No</label>
            <p>{authorization?.bill_no ?? "-"}</p>
          </div>
          <div>
            <label>Order Date</label>
            <p>{authorization?.order_date ?? "-"}</p>
          </div>
          <div>
            <label>Order Time</label>
            <p>{authorization?.order_time ?? "-"}</p>
          </div>
          <div>
            <label>Referred By</label>
            <p>{authorization?.doctor_name ?? "-"}</p>
          </div>
          <div>
            <label>Authorized By</label>
            <p>{authorization?.authorized_by ?? "-"}</p>
          </div>
        </div>
      </div>

      <div className="result-content">
        <div className="test-sidebar">
          {tests.length > 0 ? (
            <>
              {/* SELECT ALL */}
              <div
                className="test-item"
                onClick={() => {
                  if (selectedTests.length === tests.length) {
                    setSelectedTests([]);
                  } else {
                    setSelectedTests(tests);
                  }
                }}
              >
                <div className="checkbox">
                  {selectedTests.length === tests.length && "✓"}
                </div>
                Select All
              </div>

              {/* TEST LIST */}
              {tests.map((test) => {
                const isSelected = selectedTests.includes(test);

                return (
                  <div
                    key={test}
                    className={`test-item ${isSelected ? "active" : ""}`}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedTests(selectedTests.filter((t) => t !== test));
                      } else {
                        setSelectedTests([...selectedTests, test]);
                      }
                    }}
                  >
                    <div className="checkbox">{isSelected && "✓"}</div>

                    {test}
                  </div>
                );
              })}
            </>
          ) : (
            <p className="empty-state">No tests available</p>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="table-section">
          {/* Tabs */}
          {tests.length > 0 && (
            <div className="result-tabs">
              {tests.map((test) => (
                <button
                  key={test}
                  className={activeTab === test ? "active" : ""}
                  onClick={() => setActiveTab(test)}
                >
                  {test}
                </button>
              ))}
            </div>
          )}

          {/* TABLE */}
          <div className="table-scroll">
            <div className="result-table">
              <table>
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Category</th>
                    <th>Machine/Manual</th>
                    <th>Operator</th>
                    <th>Result Value</th>
                    <th>Reference Range</th>
                    <th>AuthZ Range</th>
                    <th>Result Status</th>
                  </tr>
                </thead>

                <tbody>
                  {parameters.length > 0 ? (
                    parameters.map((row, index) => (
                      <tr key={index}>
                        <td>{row.parameter}</td>
                        <td>{row.category}</td>
                        <td>{row.machine}</td>

                        {/* Operator Dropdown */}
                        <td>
                          <select
                            className="table-select"
                            value={row.operator}
                            onChange={(e) =>
                              handleParameterChange(
                                index,
                                "operator",
                                e.target.value,
                              )
                            }
                          >
                            <option value="">Select</option>
                            <option value="+">+</option>
                            <option value="-">-</option>
                          </select>
                        </td>

                        {/* Result Value */}
                        <td>
                          <input
                            className="table-input"
                            value={row.resultValue}
                            onChange={(e) =>
                              handleParameterChange(
                                index,
                                "resultValue",
                                e.target.value,
                              )
                            }
                          />
                        </td>

                        <td>{row.referenceRange}</td>
                        <td>{row.authRange}</td>

                        <td>
                          <span className={`badge ${row.status.toLowerCase()}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="empty-state">
                        No parameter data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* BUTTON */}
          <div className="authorize-btn-wrap">

            <div className="authorize-btn-wrap">

              {authorization?.authorization_status?.toUpperCase() === "PENDING" && (
                <>
                  <button
                    className="authorize-btn"
                    onClick={() => setShowApprovePopup(true)}
                    disabled={submitting}
                  >
                    Authorize
                  </button>

                  <button
                    className="reject-btn"
                    onClick={handleReject}
                    disabled={submitting}
                  >
                    Reject
                  </button>
                </>
              )}

              {authorization?.authorization_status?.toUpperCase() === "APPROVED" && (
                <div className="authorization-status">
                  <span>Authorization Status :</span>

                  <span className="authorized-badge">
                    Authorized
                  </span>
                </div>
              )}

              {authorization?.authorization_status?.toUpperCase() === "REJECTED" && (
                <div className="authorization-status">
                  <span>Authorization Status :</span>

                  <span className="rejected-badge">
                    Rejected
                  </span>
                </div>
              )}

            </div>

          </div>
        </div>
      </div>
      {showApprovePopup && (
        <div className="modal-overlay">
          <div className="confirm-modal">

            <h2>Authorize Result</h2>

            <p>
              Are you sure you want to Authorize
              <br />
              "{activeTab}" Result?
            </p>

            <div className="modal-actions">

              <button
                className="cancel-btn"
                onClick={() => setShowApprovePopup(false)}
              >
                Cancel
              </button>

              <button
                className="yes-btn"
                onClick={async () => {
                  setShowApprovePopup(false);
                  await handleApprove();
                }}
              >
                Yes
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultDetails;