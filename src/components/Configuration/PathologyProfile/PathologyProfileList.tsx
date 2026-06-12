import { useMemo, useState } from "react";
import AddIcon from "../../../assets/icons/add-square.svg";
import EditIcon from "../../../assets/icons/edit.svg";
import LeftArrow from "../../../assets/icons/left_arrow.svg";
import RightArrow from "../../../assets/icons/right_arrow.svg";
import SearchIcon from "../../../assets/icons/search.png";

type PathologyProfileRow = {
    id: number;
    code: string;
    name: string;
    linkedParameterIds: number[];
    isActive: boolean;
};

type Props = {
    rows: PathologyProfileRow[];
    onAdd: () => void;
    onEdit: (row: PathologyProfileRow) => void;
    onToggleStatus: (id: number) => void;
    onSave: (service_name: string, tests: string[], clinic: string) => void;
};

function PathologyProfileList({ rows, onAdd, onEdit, onToggleStatus }: Props) {
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;

    const filteredRows = useMemo(() => {
        const q = searchText.toLowerCase();
        if (!q) return rows;

        return rows.filter(
            (row) =>
                row.code.toLowerCase().includes(q) ||
                row.name.toLowerCase().includes(q),
        );
    }, [rows, searchText]);

    const totalItems = filteredRows.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const safePage = Math.min(currentPage, totalPages);

    const startIndex = (safePage - 1) * itemsPerPage;
    const paginatedRows = filteredRows.slice(
        startIndex,
        startIndex + itemsPerPage,
    );

    const startEntry = totalItems === 0 ? 0 : startIndex + 1;
    const endEntry = Math.min(startIndex + itemsPerPage, totalItems);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                minHeight: 0,
                padding: "14px",
                gap: "14px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <span
                    style={{
                        fontSize: "22px",
                        fontWeight: 700,
                        color: "#2a2d33",
                    }}
                >
                    List of Profile ({rows.length})
                </span>

                <div style={{ display: "flex", gap: "10px" }}>
                    <div style={{ position: "relative" }}>
                        <img
                            src={SearchIcon}
                            style={{
                                position: "absolute",
                                left: "12px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                width: "14px",
                                opacity: 0.5,
                            }}
                        />
                        <input
                            placeholder="Search by Service Name"
                            value={searchText}
                            onChange={(event) => {
                                setSearchText(event.target.value);
                                setCurrentPage(1);
                            }}
                            style={{
                                width: "280px",
                                height: "36px",
                                borderRadius: "10px",
                                border: "1px solid #dde1e7",
                                padding: "0 12px 0 34px",
                                fontSize: "13px",
                            }}
                        />
                    </div>

                    <button
                        onClick={onAdd}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            height: "36px",
                            padding: "0 14px",
                            backgroundColor: "#4e5158",
                            color: "#fff",
                            borderRadius: "10px",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: 600,
                        }}
                    >
                        <img src={AddIcon} width={14} />
                        New Profile
                    </button>
                </div>
            </div>

            <div
                style={{
                    border: "1px solid #edf0f4",
                    borderRadius: "12px",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    minHeight: 0,
                    overflow: "hidden",
                }}
            >
                <div style={{ flex: 1, overflowY: "auto" }}>
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                        }}
                    >
                        <thead style={{ backgroundColor: "#f8f9fb" }}>
                            <tr>
                                <th style={th}>Service Name</th>
                                <th style={th}>No. of Test</th>
                                <th style={{ ...th, textAlign: "center" }}>Status</th>
                                <th style={{ ...th, width: "40px" }}></th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedRows.map((row) => (
                                <tr key={row.id}>
                                    <td style={td}>{row.code}</td>
                                    <td style={td}>{row.name}</td>
                                    <td style={{ ...td, textAlign: "center" }}>
                                        <button
                                            type="button"
                                            aria-label={
                                                row.isActive ? "Deactivate PathologyProfile" : "Activate PathologyProfile"
                                            }
                                            onClick={() => onToggleStatus(row.id)}
                                            style={{
                                                width: "28px",
                                                height: "16px",
                                                borderRadius: "999px",
                                                border: "none",
                                                backgroundColor: row.isActive ? "#49b86b" : "#dbdee3",
                                                position: "relative",
                                                cursor: "pointer",
                                                padding: 0,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    position: "absolute",
                                                    top: "2px",
                                                    left: row.isActive ? "14px" : "2px",
                                                    width: "12px",
                                                    height: "12px",
                                                    borderRadius: "50%",
                                                    backgroundColor: "#ffffff",
                                                    transition: "left 0.2s ease",
                                                }}
                                            />
                                        </button>
                                    </td>

                                    <td style={{ ...td, textAlign: "center" }}>
                                        <button
                                            type="button"
                                            onClick={() => onEdit(row)}
                                            style={{
                                                border: "none",
                                                backgroundColor: "transparent",
                                                cursor: "pointer",
                                                padding: 0,
                                            }}
                                        >
                                            <img src={EditIcon} width={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px 14px",
                        fontSize: "12px",
                        color: "#8a909a",
                        borderTop: "1px solid #edf0f4",
                    }}
                >
                    <span>
                        Showing {startEntry} to {endEntry} of {totalItems} entries
                    </span>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <button
                            style={paginationButton(safePage === 1)}
                            disabled={safePage === 1}
                            onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                        >
                            <img src={LeftArrow} width={10} />
                        </button>

                        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                            (page) => (
                                <button
                                    key={page}
                                    style={pageButton(page === safePage)}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            ),
                        )}

                        <button
                            style={paginationButton(safePage === totalPages)}
                            disabled={safePage === totalPages}
                            onClick={() =>
                                setCurrentPage((page) => Math.min(page + 1, totalPages))
                            }
                        >
                            <img src={RightArrow} width={10} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PathologyProfileList;

const th = {
    textAlign: "left" as const,
    fontSize: "12px",
    color: "#7d828b",
    padding: "12px 14px",
};

const td = {
    padding: "13px 14px",
    borderBottom: "1px solid #f2f4f7",
    fontSize: "14px",
    color: "#373b43",
};

const pageButton = (active: boolean) => ({
    width: "26px",
    height: "26px",
    borderRadius: "6px",
    border: active ? "1px solid #1f232a" : "1px solid transparent",
    background: active ? "#1f232a" : "transparent",
    color: active ? "#fff" : "#8a909a",
    fontWeight: 600,
    fontSize: "12px",
    cursor: "pointer",
});

const paginationButton = (disabled: boolean) => ({
    width: "24px",
    height: "24px",
    border: "1px solid #d6dae2",
    borderRadius: "6px",
    backgroundColor: "#ffffff",
    opacity: disabled ? 0.4 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
});
