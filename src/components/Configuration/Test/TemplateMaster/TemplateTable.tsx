import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable, { Column, Toggle } from "../CommonComponents/DataTable/DataTable";
import EditIcon from "../../../../assets/icons/edit.svg";
import FilterModal, { FilterValues } from "./FilterModal";
import {
  fetchTemplates,
  selectTemplates,
  selectTemplateLoading,
  toggleTemplateStatus,
} from "../../../../store/templateSlice";
import type { AppDispatch } from "../../../../store";
import type { TemplateItem } from "../../../../types/template.types";
import { useState } from "react";

const TEMPLATE_FOR_LABELS: Record<string, string> = {
  LEAD: "Lead", PATHOLOGY: "Pathology", RADIOLOGY: "Radiology",
  EXAMINATION: "Examination", INVESTIGATION: "Investigation",
  SURGERY: "Surgery", OUTCOME: "Outcome",
};
const GENDER_LABELS: Record<string, string> = { MALE: "Male", FEMALE: "Female", BOTH: "Both" };
const USER_TYPE_LABELS: Record<string, string> = { PATHOLOGIST: "Pathologist", RADIOLOGIST: "Radiologist" };
const FORMAT_LABELS: Record<string, string> = { TEXT: "Text", FORM: "Form" };

const defaultFilters: FilterValues = { templateFor: "", gender: "", userType: "", templateFormat: "" };

type TemplateTableProps = {
  onCountChange?: (count: number) => void;
  filterOpen?: boolean;
  onFilterClose?: () => void;
  searchText?: string;
  onEdit: (row: TemplateItem) => void;
};

export default function TemplateTable({
  onCountChange,
  filterOpen = false,
  onFilterClose,
  searchText = "",
  onEdit,
}: TemplateTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const templates = useSelector(selectTemplates);
  const loading = useSelector(selectTemplateLoading);
  const [activeFilters, setActiveFilters] = useState<FilterValues>(defaultFilters);

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  const filteredData = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    return templates.filter((row) => {
      const matchesSearch = !query ||
        row.code.toLowerCase().includes(query) ||
        row.name.toLowerCase().includes(query);
      const matchesFor = !activeFilters.templateFor || row.templateFor === activeFilters.templateFor;
      const matchesGender = !activeFilters.gender || row.gender === activeFilters.gender;
      const matchesUserType = !activeFilters.userType || row.userType === activeFilters.userType;
      const matchesFormat = !activeFilters.templateFormat || row.templateFormat === activeFilters.templateFormat;
      return matchesSearch && matchesFor && matchesGender && matchesUserType && matchesFormat;
    });
  }, [templates, searchText, activeFilters]);

  useEffect(() => {
    onCountChange?.(filteredData.length);
  }, [filteredData, onCountChange]);

  const columns: Column<TemplateItem>[] = [
    { key: "code", header: "Template Code", width: "12%" },
    {
      key: "templateFor",
      header: "Template For",
      width: "14%",
      render: (row) => <span>{TEMPLATE_FOR_LABELS[row.templateFor] ?? row.templateFor}</span>,
    },
    { key: "name", header: "Template Name", width: "20%" },
    {
      key: "gender",
      header: "Gender",
      width: "8%",
      render: (row) => <span>{GENDER_LABELS[row.gender] ?? row.gender}</span>,
    },
    {
      key: "templateFormat",
      header: "Template Format",
      width: "12%",
      render: (row) => <span>{FORMAT_LABELS[row.templateFormat] ?? row.templateFormat}</span>,
    },
    {
      key: "userType",
      header: "User Type",
      width: "12%",
      render: (row) => <span>{USER_TYPE_LABELS[row.userType] ?? row.userType}</span>,
    },
    { key: "serviceName", header: "Service Name", width: "14%" },
    {
      key: "status",
      header: "Status",
      align: "right",
      width: "10%",
      render: (row) => (
        <Toggle
          checked={row.isActive}
          onChange={() => dispatch(toggleTemplateStatus({ id: row.id, status: !row.isActive }))}
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
          style={{ background: "transparent", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center" }}
        >
          <img src={EditIcon} alt="edit" width={18} height={18} />
        </button>
      ),
    },
  ];

  if (loading) return <div style={{ padding: "2em", color: "#9e9e9e" }}>Loading...</div>;

  return (
    <>
      <DataTable columns={columns} data={filteredData} />
      <FilterModal
        isOpen={filterOpen}
        onClose={() => onFilterClose?.()}
        onApply={(filters) => setActiveFilters(filters)}
        onClearAll={() => setActiveFilters(defaultFilters)}
        initialValues={activeFilters}
      />
    </>
  );
}