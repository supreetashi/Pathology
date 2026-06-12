import React, { useState } from "react";
import { AuthorizationItem } from "../../types/index";
import "../../styles/Authorization/TableSection.css";
import resultIcon from "../Authorization/Icons/download1.png";

type Props = {
    data: AuthorizationItem[];
    onViewResult: (item: AuthorizationItem) => void;
};


const TableSection: React.FC<Props> = ({ data, onViewResult }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;
    const totalPages = Math.ceil(data.length / recordsPerPage);

    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;



    const currentData = data.slice(startIndex, endIndex);

    return (
        <>
            <table className="table">
                <thead>
                    <tr>
                        <th>Order Date | Time</th>
                        <th>Patient</th>
                        <th>Patient Type</th>
                        <th>Doctor Name</th>
                        <th>Bill Details</th>
                        <th>No. of Orders</th>
                        <th>Result</th>
                    </tr>
                </thead>

                <tbody>
                    {currentData.map((item) => (
                        <tr
                            key={item.id}
                            onClick={() => onViewResult(item)}
                            style={{ cursor: "pointer" }}
                        >
                            <td>
                                <div>{item.order_date}</div>
                                <span className="sub">{item.order_time}</span>
                            </td>

                            <td>
                                <div>
                                    {item.patient_name} | {item.patient_age}
                                </div>
                                <span className="sub">
                                    {item.patient_code} | {item.patient_gender}
                                </span>
                            </td>

                            <td>{item.patient_type}</td>

                            <td>{item.doctor_name}</td>

                            <td>
                                <span className="bill">{item.bill_no}</span>
                            </td>

                            <td>{item.no_of_orders}</td>
                            <td>
                                <button className="icon-btn" onClick={() => onViewResult(item)}>
                                    <img src={resultIcon} alt="result" className="icon-img" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="footer">
                <span>
                    Showing {startIndex + 1} to{" "}
                    {Math.min(endIndex, data.length)} of{" "}
                    {data.length} entries
                </span>

                <div className="pagination">

                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        {"<"}
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            className={currentPage === index + 1 ? "active" : ""}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        {">"}
                    </button>

                </div>
            </div>
        </>
    );
};

export default TableSection;