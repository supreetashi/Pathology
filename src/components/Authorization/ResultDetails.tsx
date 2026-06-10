import React, { useState } from "react";
import "../../styles/Authorization/ResultDetails.css";
import backIcon from "../Authorization/Icons/back-icon.png";
import { AuthorizationItem } from "../../types";
import {
    approveAuthorization,
    rejectAuthorization,
} from "../../services/authorizationService";

type Props = {
    onBack: () => void;
    authorization?: AuthorizationItem | null;
};


const ResultDetails: React.FC<Props> = ({
    onBack,
    authorization,
}) => {
    const handleApprove = async () => {
        if (!authorization) return;

        try {
            await approveAuthorization(
                Number(authorization.id)
            );

            alert("Approved Successfully");
            onBack();
        } catch (err) {
            console.error(err);
        }
    };

    const handleReject = async () => {
        if (!authorization) return;

        try {
            await rejectAuthorization(
                Number(authorization.id)
            );

            alert("Rejected Successfully");
            onBack();
        } catch (err) {
            console.error(err);
        }
    };


    const [selectedTests, setSelectedTests] = useState<string[]>([
        "HIV (Rapid Card)",
        "HCV (Rapid Card)",
        "(CBC) Complete Blood Count",
    ]);
    const [activeTab, setActiveTab] = useState(
        "(CBC) Complete Blood Count"
    );

    const tests = [
        "HIV (Rapid Card)",
        "HCV (Rapid Card)",
        "HBaSG (Rapid Card)",
        "(CBC) Complete Blood Count",
        "Serum Uric Acid",
        "VDRL (Rapid Card)",
        "Blood Glucose (RBS)",
    ];

    const handleParameterChange = (
        index: number,
        field: string,
        value: string
    ) => {
        const updated = [...parameters];

        updated[index] = {
            ...updated[index],
            [field]: value,
        };

        setParameters(updated);
    };


    const [parameters, setParameters] = useState([
        {
            parameter: "Heamoglobin (hb)",
            category: "Female",
            machine: "Manual",
            operator: "+",
            resultValue: "14",
            referenceRange: "12 - 16.5",
            authRange: "14",
            status: "Normal",
        },
        {
            parameter: "MCV",
            category: "Female",
            machine: "Manual",
            operator: "-",
            resultValue: "91",
            referenceRange: "80 - 100",
            authRange: "90",
            status: "Abnormal",
        },
        {
            parameter: "Hematocrit",
            category: "Female",
            machine: "Manual",
            operator: "+",
            resultValue: "Red",
            referenceRange: "40 - 52.5",
            authRange: "45",
            status: "Reflex",
        },
        {
            parameter: "RDW",
            category: "Female",
            machine: "Manual",
            operator: "",
            resultValue: "12.8",
            referenceRange: "12 - 16.5",
            authRange: "13",
            status: "Panic",
        },
        {
            parameter: "MCHC",
            category: "Female",
            machine: "Manual",
            operator: "",
            resultValue: "14",
            referenceRange: "12 - 16.5",
            authRange: "14",
            status: "Improbable",
        },
    ]);

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
                <img
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="patient"
                />

                <div className="patient-grid">
                    <div>
                        <label>Patient Name</label>
                        <p>Emilia Williamson</p>
                    </div>
                    <div>
                        <label>Age</label>
                        <p>27 Years</p>
                    </div>
                    <div>
                        <label>Sex Assigned At Birth</label>
                        <p>Female</p>
                    </div>
                    <div>
                        <label>MRN</label>
                        <p>PCC - 4912</p>
                    </div>
                    <div>
                        <label>Allergy</label>
                        <p>No</p>
                    </div>
                    <div>
                        <label>SART ID</label>
                        <p>14SGK9876432</p>
                    </div>
                    <div>
                        <label>Last Modified</label>
                        <p>04/02/2026</p>
                    </div>
                    <div>
                        <label>Referred By</label>
                        <p>Soniya</p>
                    </div>
                    <div>
                        <label>Pathologist</label>
                        <p>John Wick</p>
                    </div>
                </div>
            </div>

            <div className="result-content">

                <div className="test-sidebar">

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
                                        setSelectedTests(
                                            selectedTests.filter((t) => t !== test)
                                        );
                                    } else {
                                        setSelectedTests([...selectedTests, test]);
                                    }
                                }}
                            >
                                <div className="checkbox">
                                    {isSelected && "✓"}
                                </div>

                                {test}
                            </div>
                        );
                    })}

                    <button
                        className="get-test-btn"
                        onClick={() => alert("Get Test Clicked")}
                    >
                        Get Test
                    </button>

                </div>

                {/* RIGHT SIDE */}
                <div className="table-section">

                    {/* Tabs */}
                    <div className="result-tabs">

                        <button
                            className={activeTab === "HIV (Rapid Card)" ? "active" : ""}
                            onClick={() => setActiveTab("HIV (Rapid Card)")}
                        >
                            HIV (Rapid Card)
                        </button>

                        <button
                            className={activeTab === "HCV (Rapid Card)" ? "active" : ""}
                            onClick={() => setActiveTab("HCV (Rapid Card)")}
                        >
                            HCV (Rapid Card)
                        </button>

                        <button
                            className={
                                activeTab === "(CBC) Complete Blood Count"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setActiveTab("(CBC) Complete Blood Count")
                            }
                        >
                            (CBC) Complete Blood Count
                        </button>

                    </div>

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
                                        <th>Varying Ref. Range</th>
                                        <th>Result Status</th>
                                        <th>Previous</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {parameters.map((row, index) => (
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
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="">Select</option>
                                                    <option value="+">+</option>
                                                    <option value="-">-</option>
                                                </select>
                                            </td>

                                            {/* Result Value Editable Dropdown */}
                                            <td>
                                                <input
                                                    list={`result-options-${index}`}
                                                    className="table-input"
                                                    value={row.resultValue}
                                                    onChange={(e) =>
                                                        handleParameterChange(
                                                            index,
                                                            "resultValue",
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                                <datalist id={`result-options-${index}`}>
                                                    <option value="14" />
                                                    <option value="15" />
                                                    <option value="16" />
                                                    <option value="91" />
                                                    <option value="12.8" />
                                                    <option value="Red" />
                                                </datalist>
                                            </td>

                                            <td>{row.referenceRange}</td>
                                            <td>{row.authRange}</td>

                                            <td>
                                                Female: 12-16.5 g/dl
                                                <br />
                                                Newborn: 14-22 g/dl
                                            </td>

                                            <td>
                                                <span className={`badge ${row.status.toLowerCase()}`}>
                                                    {row.status}
                                                </span>
                                            </td>

                                            <td>⚠️</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="result-footer">

                        <div>
                            <strong>Suggestion Note :</strong>

                            <p>
                                Hb Within Normal Range. Continue Routine Monitoring If Clinically Required.
                            </p>
                        </div>

                        <div>
                            <strong>Foot Note :</strong>

                            <p>
                                Reference Ranges May Vary Depending On Age, Gender, And Clinical Condition.
                            </p>
                        </div>

                    </div>

                    {/* BUTTON */}
                    <div className="authorize-btn-wrap">
                        <button
                            className="authorize-btn"
                            onClick={handleApprove}
                        >
                            Authorize
                        </button>

                        <button
                            className="authorize-btn"
                            onClick={handleReject}
                        >
                            Reject
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default ResultDetails;