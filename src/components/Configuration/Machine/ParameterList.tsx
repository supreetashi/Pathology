import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import AddIcon from "../../../assets/icons/add-square.svg";
import EditIcon from "../../../assets/icons/edit.svg";
import LeftArrow from "../../../assets/icons/left_arrow.svg";
import RightArrow from "../../../assets/icons/right_arrow.svg";
import SearchIcon from "../../../assets/icons/search.png";

// =====================================================
// Types
// =====================================================
type ParameterItem = {
  id: string;
  code: string;
  name: string;
  linkedMachineIds: string[];
  isActive: boolean;
};

type Props = {
  rows: ParameterItem[];
  onAdd: () => void;
  onEdit: (row: ParameterItem) => void;
  onToggleStatus: (id: string) => void;
};

// =====================================================
// Styles — defined before the component
// =====================================================
const styles: Record<string, CSSProperties> = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minHeight: 0,
    padding: "14px",
    gap: "14px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#2a2d33",
  },
  headerActions: {
    display: "flex",
    gap: "10px",
  },
  searchWrap: {
    position: "relative",
  },
  searchIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "14px",
    opacity: 0.5,
  },
  searchInput: {
    width: "280px",
    height: "36px",
    borderRadius: "10px",
    border: "1px solid #dde1e7",
    padding: "0 12px 0 34px",
    fontSize: "13px",
    boxSizing: "border-box",
  },
  addButton: {
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
  },
  card: {
    border: "1px solid #edf0f4",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minHeight: 0,
    overflow: "hidden",
  },
  tableWrap: {
    flex: 1,
    overflowY: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  thead: {
    backgroundColor: "#f8f9fb",
  },
  emptyCell: {
    padding: "40px 14px",
    textAlign: "center",
    fontSize: "14px",
    color: "#8a909a",
  },
  iconButton: {
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    padding: 0,
  },
  pagination: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 14px",
    fontSize: "12px",
    color: "#8a909a",
    borderTop: "1px solid #edf0f4",
  },
  pageButtons: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
};

const th: CSSProperties = {
  textAlign: "left",
  fontSize: "12px",
  color: "#7d828b",
  padding: "12px 14px",
};

const td: CSSProperties = {
  padding: "13px 14px",
  borderBottom: "1px solid #f2f4f7",
  fontSize: "14px",
  color: "#373b43",
};

const toggleTrack = (active: boolean): CSSProperties => ({
  width: "28px",
  height: "16px",
  borderRadius: "999px",
  border: "none",
  backgroundColor: active ? "#49b86b" : "#dbdee3",
  position: "relative",
  cursor: "pointer",
  padding: 0,
});

const toggleThumb = (active: boolean): CSSProperties => ({
  position: "absolute",
  top: "2px",
  left: active ? "14px" : "2px",
  width: "12px",
  height: "12px",
  borderRadius: "50%",
  backgroundColor: "#ffffff",
  transition: "left 0.2s ease",
});

const pageBtn = (active: boolean): CSSProperties => ({
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

const arrowBtn = (disabled: boolean): CSSProperties => ({
  width: "24px",
  height: "24px",
  border: "1px solid #d6dae2",
  borderRadius: "6px",
  backgroundColor: "#ffffff",
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.4 : 1,
});

// =====================================================
// Component
// =====================================================
function ParameterList({ rows, onAdd, onEdit, onToggleStatus }: Props) {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // Reset to page 1 when rows change (after save/delete)
  useEffect(() => {
    setCurrentPage(1);
  }, [rows]);

  const filteredRows = useMemo(() => {
    const q = searchText.toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.code.toLowerCase().includes(q) || r.name.toLowerCase().includes(q),
    );
  }, [rows, searchText]);

  const totalItems = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);

  const startIndex = (safePage - 1) * itemsPerPage;
  const paginatedRows = filteredRows.slice(startIndex, startIndex + itemsPerPage);

  const startEntry = totalItems === 0 ? 0 : startIndex + 1;
  const endEntry = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.title}>
          List of Machine Parameter ({rows.length})
        </span>

        <div style={styles.headerActions}>
          <div style={styles.searchWrap}>
            <img src={SearchIcon} alt="" style={styles.searchIcon} />
            <input
              placeholder="Search by Machine Parameter Code / Name"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
              style={styles.searchInput}
            />
          </div>

          {/* Fixed: added type="button" */}
          <button type="button" onClick={onAdd} style={styles.addButton}>
            <img src={AddIcon} width={14} alt="" />
            Add New Machine Parameter
          </button>
        </div>
      </div>

      {/* Table card */}
      <div style={styles.card}>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={th}>Machine Parameter Code</th>
                <th style={th}>Machine Parameter Name</th>
                <th style={{ ...th, textAlign: "center" }}>No. of Machines linked</th>
                <th style={{ ...th, textAlign: "center" }}>Status</th>
                <th style={{ ...th, width: "40px" }} />
              </tr>
            </thead>

            <tbody>
              {/* Fixed: empty state */}
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={5} style={styles.emptyCell}>
                    {searchText
                      ? `No parameters match "${searchText}"`
                      : "No machine parameters found"}
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row) => (
                  <tr key={row.id}>
                    <td style={td}>{row.code}</td>
                    <td style={td}>{row.name}</td>

                    <td style={{ ...td, textAlign: "center" }}>
                      {row.linkedMachineIds.length}
                    </td>

                    <td style={{ ...td, textAlign: "center" }}>
                      <button
                        type="button"
                        aria-label={
                          row.isActive
                            ? "Deactivate machine parameter"
                            : "Activate machine parameter"
                        }
                        onClick={() => onToggleStatus(row.id)}
                        style={toggleTrack(row.isActive)}
                      >
                        <span style={toggleThumb(row.isActive)} />
                      </button>
                    </td>

                    <td style={{ ...td, textAlign: "center" }}>
                      <button
                        type="button"
                        onClick={() => onEdit(row)}
                        style={styles.iconButton}
                      >
                        <img src={EditIcon} width={14} alt="Edit" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={styles.pagination}>
          <span>
            Showing {startEntry} to {endEntry} of {totalItems} entries
          </span>

          <div style={styles.pageButtons}>
            <button
              type="button"
              style={arrowBtn(safePage === 1)}
              disabled={safePage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              <img src={LeftArrow} width={10} alt="Previous" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                style={pageBtn(page === safePage)}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              style={arrowBtn(safePage === totalPages)}
              disabled={safePage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              <img src={RightArrow} width={10} alt="Next" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParameterList;