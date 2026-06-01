import { useMemo, useState, useRef, useEffect } from "react";
import LeftArrow from "../../../../../assets/icons/left_arrow.svg";
import RightArrow from "../../../../../assets/icons/right_arrow.svg";
import AddIcon from "../../../../../assets/icons/add-square.svg";
import FunnelIcon from "../../../../../assets/icons/Filter_Leads.svg";
import SearchIcon from "../../../../../assets/icons/search.png";
import tableStyles from "./DataTable.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Column<T> = {
  key: keyof T | string;
  header: string;
  width?: string;
  align?: "left" | "right";
  render?: (row: T) => React.ReactNode;
};

// ─── Toggle ───────────────────────────────────────────────────────────────────

type ToggleProps = {
  checked: boolean;
  onChange: () => void;
};

export function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <label className={tableStyles.switch}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className={tableStyles.slider}></span>
    </label>
  );
}

// ─── TabsHeader ───────────────────────────────────────────────────────────────

type TabsHeaderProps = {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export function TabsHeader({ tabs, activeTab, setActiveTab }: TabsHeaderProps) {
  return (
    <div className={tableStyles.tabs}>
      {tabs.map((tab) => (
        <span
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`${tableStyles.tab} ${activeTab === tab ? tableStyles.activeTab : ""}`}
        >
          {tab}
        </span>
      ))}
    </div>
  );
}

// ─── PageToolbar ──────────────────────────────────────────────────────────────

type PageToolbarProps = {
  title: string;
  searchPlaceholder?: string;
  searchValue?: string;
  createLabel?: string;
  onSearch?: (value: string) => void;
  onAdd?: () => void;
  showFilter?: boolean;
  onFilter?: () => void;
};

export function PageToolbar({
  title,
  searchPlaceholder = "Search...",
  searchValue = "",
  createLabel = "Create New",
  onSearch,
  onAdd,
  showFilter = false,
  onFilter,
}: PageToolbarProps) {
  return (
    <div className={tableStyles.toolbar}>
      <span className={tableStyles.title}>{title}</span>
      <div className={tableStyles.actions}>
        <div className={tableStyles.searchWrapper}>
          <img
            src={SearchIcon}
            className={tableStyles.searchIcon}
            alt="search"
          />
          <input
            value={searchValue}
            placeholder={searchPlaceholder}
            className={tableStyles.searchInput}
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>

        {showFilter && (
          <button
            type="button"
            className={tableStyles.filterBtn}
            onClick={onFilter}
          >
            <img src={FunnelIcon} alt="filter" width={30} height={30} />
          </button>
        )}

        <button type="button" className={tableStyles.createBtn} onClick={onAdd}>
          <img src={AddIcon} alt="add" className={tableStyles.btnIcon} />
          {createLabel}
        </button>
      </div>
    </div>
  );
}

// ─── DataTable ────────────────────────────────────────────────────────────────

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  itemsPerPage?: number;
};

export default function DataTable<T extends object>({
  columns,
  data,
  itemsPerPage: fixedItemsPerPage,
}: DataTableProps<T>) {
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  const [rowHeight, setRowHeight] = useState(44);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = fixedItemsPerPage ?? 10;
  const totalItems = data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startEntry =
    totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, totalItems);

  useEffect(() => {
    setCurrentPage(1);
  }, [data, itemsPerPage]);

  useEffect(() => {
    const calculateRowHeight = () => {
      if (!tableWrapperRef.current || !tableRef.current) return;

      const wrapperHeight =
        tableWrapperRef.current.getBoundingClientRect().height;
      const thead = tableRef.current.querySelector("thead");
      const headerHeight = thead?.getBoundingClientRect().height ?? 48;

      // tableWrapper already excludes footer because footer is outside it
      const availableBodyHeight = wrapperHeight - headerHeight;

      // small safety adjustment for borders / rounding
      const safeHeight = availableBodyHeight - 6;

      const nextRowHeight = Math.floor(safeHeight / 10);

      setRowHeight(Math.max(36, nextRowHeight));
    };

    calculateRowHeight();

    const observer = new ResizeObserver(calculateRowHeight);

    if (tableWrapperRef.current) observer.observe(tableWrapperRef.current);
    if (tableRef.current) observer.observe(tableRef.current);

    window.addEventListener("resize", calculateRowHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", calculateRowHeight);
    };
  }, []);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const currentRows = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  const emptyRowsCount = Math.max(0, itemsPerPage - currentRows.length);

  return (
    <div className={tableStyles.wrapper}>
      <div className={tableStyles.tableWrapper} ref={tableWrapperRef}>
        <table className={tableStyles.table} ref={tableRef}>
          <thead className={tableStyles.head}>
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  style={{ width: col.width, textAlign: col.align ?? "left" }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {currentRows.map((row, rowIndex) => (
              <tr
                key={`row-${(currentPage - 1) * itemsPerPage + rowIndex}`}
                className={tableStyles.row}
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    style={{
                      textAlign: col.align ?? "left",
                      height: `${rowHeight}px`,
                    }}
                  >
                    {col.render
                      ? col.render(row)
                      : String(row[col.key as keyof T] ?? "")}
                  </td>
                ))}
              </tr>
            ))}

            {Array.from({ length: emptyRowsCount }).map((_, rowIndex) => (
              <tr key={`empty-row-${rowIndex}`} className={tableStyles.row}>
                {columns.map((col) => (
                  <td
                    key={`empty-${String(col.key)}-${rowIndex}`}
                    style={{
                      height: `${rowHeight}px`,
                    }}
                  ></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={tableStyles.footer}>
        <span>
          Showing {startEntry} to {endEntry} of {totalItems} entries
        </span>
        <div className={tableStyles.pagination}>
          <button
            type="button"
            className={tableStyles.pageBtn}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            <img src={LeftArrow} alt="previous" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              type="button"
              key={page}
              className={`${tableStyles.pageBtn} ${currentPage === page ? tableStyles.active : ""}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            className={tableStyles.pageBtn}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <img src={RightArrow} alt="next" />
          </button>
        </div>
      </div>
    </div>
  );
}
