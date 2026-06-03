import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "../../../../assets/icons/edit.svg";
import DataTable, {
  Column,
  Toggle,
} from "../CommonComponents/DataTable/DataTable";
import {
  fetchCategories,
  selectCategories,
  selectCategoriesLoading,
  toggleCategoryStatus,
} from "../../../../store/testSlice";
import type { AppDispatch } from "../../../../store";
import type { CategoryItem } from "../../../../types/test.types";

type CategoryTableProps = {
  onCountChange?: (count: number) => void;
  onEdit: (row: CategoryItem) => void;
  searchText?: string;
};

export default function CategoryTable({
  onCountChange,
  onEdit,
  searchText = "",
}: CategoryTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectCategoriesLoading);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const filteredData = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return categories;
    return categories.filter(
      (item) =>
        item.code.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query),
    );
  }, [categories, searchText]);

  useEffect(() => {
    onCountChange?.(filteredData.length);
  }, [filteredData, onCountChange]);

  const columns: Column<CategoryItem>[] = [
    { key: "code", header: "Category Code", width: "15%" },
    { key: "name", header: "Category Name", width: "19%" },
    {
      key: "tests",
      header: "No. of Tests",
      width: "50%",
      render: (row) => <span>{row.tests.length}</span>,
    },
    {
      key: "status",
      header: "Status",
      align: "right",
      width: "16%",
      render: (row) => (
        <Toggle
          checked={row.isActive}
          onChange={() => dispatch(toggleCategoryStatus({ id: row.id, status: !row.isActive }))}
        />
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      width: "6%",
      render: (row) => (
        <button
          type="button"
          onClick={() => onEdit(row)}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          <img src={EditIcon} alt="edit" width={18} height={18} />
        </button>
      ),
    },
  ];

  if (loading) return <div style={{ padding: "2em", color: "#9e9e9e" }}>Loading...</div>;

  return <DataTable columns={columns} data={filteredData} />;
}