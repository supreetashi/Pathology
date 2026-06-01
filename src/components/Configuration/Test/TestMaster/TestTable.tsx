import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "../../../../assets/icons/edit.svg";
import DataTable, {
  Column,
  Toggle,
} from "../CommonComponents/DataTable/DataTable";
import {
  fetchTests,
  selectTests,
  selectTestLoading,
  toggleTestStatus,
} from "../../../../store/testSlice";
import type { AppDispatch } from "../../../../store";

type TestRow = {
  id: number;
  code: string;
  name: string;
  printName: string;
  serviceName: string;
  testCompletionTime: string;
  isSensitive: boolean;
  suggestionNote: string;
  disclaimer: string;
  reportType: string;
  isActive: boolean;
};

type TestTableProps = {
  onCountChange?: (count: number) => void;
  searchText?: string;
  onEdit: (row: TestRow) => void;
};

export default function TestTable({
  onCountChange,
  searchText = "",
  onEdit,
}: TestTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const tests = useSelector(selectTests);
  const loading = useSelector(selectTestLoading);

  useEffect(() => {
    dispatch(fetchTests());
  }, [dispatch]);

  const filteredData = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return tests;
    return tests.filter(
      (item) =>
        item.code.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query) ||
        item.printName.toLowerCase().includes(query),
    );
  }, [tests, searchText]);

  useEffect(() => {
    onCountChange?.(filteredData.length);
  }, [filteredData, onCountChange]);

  const columns: Column<TestRow>[] = [
    { key: "code", header: "Test Code", width: "16%" },
    { key: "name", header: "Test Name", width: "10%" },
    { key: "printName", header: "Print Name", width: "24%" },
    {
      key: "status",
      header: "Status",
      align: "right",
      width: "16%",
      render: (row) => (
        <Toggle
          checked={row.isActive}
          onChange={() => dispatch(toggleTestStatus({ id: row.id, status: !row.isActive }))}
        />
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      width: "4%",
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