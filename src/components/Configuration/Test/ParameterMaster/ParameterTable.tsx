import { useState, useEffect, useMemo } from "react";
import EditIcon from "../../../../assets/icons/edit.svg";
import DataTable, {
  Column,
  Toggle,
} from "../CommonComponents/DataTable/DataTable";

type ParameterRow = {
  code: string;
  name: string;
  printName: string;
  unit: string;
  status: boolean;
};

type ParameterTableProps = {
  onCountChange?: (count: number) => void;
  searchText?: string;
  onEdit: (row: ParameterRow) => void;
};

const initialData: ParameterRow[] = [
  {
    code: "PN-041421",
    name: "Urea (Serum)",
    printName: "Urea",
    unit: "ML",
    status: false,
  },
  {
    code: "PN-041423",
    name: "Serum Sodium Levels",
    printName: "Sodium (Na+)",
    unit: "g/dL",
    status: true,
  },
  {
    code: "PN-041429",
    name: "Sodium Concentration in Serum",
    printName: "Sodium (Na+)",
    unit: "g/dL",
    status: true,
  },
  {
    code: "PN-041437",
    name: "Serum Sodium Measurement",
    printName: "Sodium (Na+)",
    unit: "g/dL",
    status: true,
  },
  {
    code: "PN-041445",
    name: "Sodium Serum Analysis",
    printName: "Sodium (Na+)",
    unit: "g/dL",
    status: true,
  },
  {
    code: "PN-041452",
    name: "Sodium Content in Blood",
    printName: "Sodium (Na+)",
    unit: "g/dL",
    status: true,
  },
  {
    code: "PN-041460",
    name: "Blood Sodium Assessment",
    printName: "Sodium (Na+)",
    unit: "g/dL",
    status: true,
  },
  {
    code: "PN-041478",
    name: "Sodium Serum Evaluation",
    printName: "Sodium (Na+)",
    unit: "g/dL",
    status: true,
  },
  {
    code: "PN-041486",
    name: "Sodium Levels in Serum",
    printName: "Sodium (Na+)",
    unit: "g/dL",
    status: false,
  },
  {
    code: "PN-041494",
    name: "Serum Sodium Testing",
    printName: "Sodium (Na+)",
    unit: "g/dL",
    status: false,
  },
  {
    code: "PN-041502",
    name: "Sodium Serum Profile",
    printName: "Sodium (Na+)",
    unit: "g/dL",
    status: false,
  },
  {
    code: "PN-041510",
    name: "Potassium (Serum)",
    printName: "Potassium (K+)",
    unit: "mmol/L",
    status: true,
  },
  {
    code: "PN-041518",
    name: "Chloride (Serum)",
    printName: "Chloride",
    unit: "mmol/L",
    status: true,
  },
  {
    code: "PN-041526",
    name: "Calcium (Total)",
    printName: "Calcium",
    unit: "mg/dL",
    status: true,
  },
  {
    code: "PN-041534",
    name: "Magnesium (Serum)",
    printName: "Magnesium",
    unit: "mg/dL",
    status: false,
  },
  {
    code: "PN-041542",
    name: "Phosphorus (Serum)",
    printName: "Phosphorus",
    unit: "mg/dL",
    status: true,
  },
  {
    code: "PN-041550",
    name: "Creatinine (Serum)",
    printName: "Creatinine",
    unit: "mg/dL",
    status: true,
  },
  {
    code: "PN-041568",
    name: "Bilirubin Total",
    printName: "Bilirubin",
    unit: "mg/dL",
    status: false,
  },
  {
    code: "PN-041576",
    name: "Albumin (Serum)",
    printName: "Albumin",
    unit: "g/dL",
    status: true,
  },
  {
    code: "PN-041584",
    name: "Globulin (Serum)",
    printName: "Globulin",
    unit: "g/dL",
    status: true,
  },
];

export default function ParameterTable({
  onCountChange,
  searchText = "",
  onEdit,
}: ParameterTableProps) {
  const [data, setData] = useState<ParameterRow[]>(initialData);

  const filteredData = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return data;
    return data.filter(
      (item) =>
        item.code.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query) ||
        item.printName.toLowerCase().includes(query) ||
        item.unit.toLowerCase().includes(query),
    );
  }, [data, searchText]);

  useEffect(() => {
    onCountChange?.(filteredData.length);
  }, [filteredData, onCountChange]);

  const handleToggle = (code: string) => {
    setData((prev) =>
      prev.map((item) =>
        item.code === code ? { ...item, status: !item.status } : item,
      ),
    );
  };

  // Figma widths: Code 20% | Name 28% | Print Name 22% | Unit 12% | Status 12% | Edit 6%
  const columns: Column<ParameterRow>[] = [
    { key: "code", header: "Parameter Code", width: "18%" },
    { key: "name", header: "Parameter Name", width: "26%" },
    { key: "printName", header: "Parameter Print Name", width: "20%" },
    { key: "unit", header: "Unit", width: "40%" },
    {
      key: "status",
      header: "Status",
      align: "right",
      width: "12%",
      render: (row) => (
        <Toggle checked={row.status} onChange={() => handleToggle(row.code)} />
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

  return <DataTable columns={columns} data={filteredData} />;
}