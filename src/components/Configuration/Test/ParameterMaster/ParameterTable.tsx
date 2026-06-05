import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "../../../../assets/icons/edit.svg";
import DataTable, {
  Column,
  Toggle,
} from "../CommonComponents/DataTable/DataTable";
import {
  fetchParameters,
  selectParameters,
  selectParameterLoading,
  toggleParameterStatus,
} from "../../../../store/parameterSlice";
import type { AppDispatch } from "../../../../store";
import type { ParameterItem } from "../../../../types/parameter.types";

type ParameterTableProps = {
  onCountChange?: (count: number) => void;
  searchText?: string;
  onEdit: (row: ParameterItem) => void;
};

export default function ParameterTable({
  onCountChange,
  searchText = "",
  onEdit,
}: ParameterTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const parameters = useSelector(selectParameters);
  const loading = useSelector(selectParameterLoading);

  useEffect(() => {
    dispatch(fetchParameters());
  }, [dispatch]);

  const filteredData = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return parameters;
    return parameters.filter(
      (item) =>
        item.code.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query) ||
        item.printName.toLowerCase().includes(query) ||
        item.unit.toLowerCase().includes(query),
    );
  }, [parameters, searchText]);

  useEffect(() => {
    onCountChange?.(filteredData.length);
  }, [filteredData, onCountChange]);

  const columns: Column<ParameterItem>[] = [
    { key: "code",      header: "Parameter Code",       width: "18%" },
    { key: "name",      header: "Parameter Name",       width: "26%" },
    { key: "printName", header: "Parameter Print Name", width: "20%" },
    { key: "unit",      header: "Unit",                 width: "20%" },
    {
      key: "status",
      header: "Status",
      align: "right",
      width: "12%",
      render: (row) => (
        <Toggle
          checked={row.isActive}
          onChange={() =>
            dispatch(toggleParameterStatus({ id: row.id, status: !row.isActive }))
          }
        />
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      width: "7%",
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