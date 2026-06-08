import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTests, fetchCategories } from "../../../store/testSlice";
import {
  TabsHeader,
  PageToolbar,
} from "./CommonComponents/DataTable/DataTable";

import ParameterTable from "./ParameterMaster/ParameterTable";
import CategoryTable from "./CategoryMaster/CategoryTable";
import TestTable from "./TestMaster/TestTable";
import TemplateTable from "./TemplateMaster/TemplateTable";
import CreateCategoryModal from "./CategoryMaster/CreateCategoryModal";
import styles from "./Test.module.css";

import {
  createCategory,
  updateCategory,
  selectCategories,
  selectTests,
} from "../../../store/testSlice";
import type { AppDispatch } from "../../../store";
import type { CategoryItem } from "../../../types/test.types";

const tabs = ["Parameter", "Category", "Test", "Template"] as const;
type TabKey = (typeof tabs)[number];

export type CategoryRow = {
  code: string;
  name: string;
  tests: number;
  status: boolean;
  testIds?: string[];
};

type ToolbarConfig = {
  title: (count: number) => string;
  searchPlaceholder: string;
  createLabel: string;
  createPath: string;
};

const toolbarConfig: Record<TabKey, ToolbarConfig> = {
  Parameter: {
    title: (count) => `List of Parameters (${count})`,
    searchPlaceholder: "Search by Parameter Code / Name / Print Name / Unit",
    createLabel: "Create New Parameter",
    createPath: "/pathology/configuration/test/parameter/create",
  },
  Category: {
    title: (count) => `List of Categories (${count})`,
    searchPlaceholder: "Search by Category Code / Name",
    createLabel: "Create New Category",
    createPath: "",
  },
  Test: {
    title: (count) => `List of Tests (${count})`,
    searchPlaceholder: "Search by Test Code / Name",
    createLabel: "Create New Test",
    createPath: "/pathology/configuration/test/test/create",
  },
  Template: {
    title: (count) => `List of Templates (${count})`,
    searchPlaceholder: "Search by Template Code / Name",
    createLabel: "Create New Template",
    createPath: "/pathology/configuration/test/template/create",
  },
};

function TestConfigurationView() {
  const [activeTab, setActiveTab] = useState<TabKey>(() => {
  return (
    (localStorage.getItem("testConfigurationTab") as TabKey) || "Parameter"
  );
});
  const [dataCount, setDataCount] = useState(0);
  const [isTemplateFilterOpen, setIsTemplateFilterOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(
    null,
  );

  const [searchByTab, setSearchByTab] = useState<Record<TabKey, string>>({
    Parameter: "",
    Category: "",
    Test: "",
    Template: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchTests());
    dispatch(fetchCategories());
  }, [dispatch]);
  const categories = useSelector(selectCategories);
  const tests = useSelector(selectTests);

  // Map tests to { id: string, name: string } for the modal
  const availableTests = tests.map((t) => ({
    id: String(t.id),
    name: t.name,
  }));

  const handleTabChange = (tab: string) => {
  if (tab === activeTab) return;

  setActiveTab(tab as TabKey);
  localStorage.setItem("testConfigurationTab", tab);

  setIsTemplateFilterOpen(false);
  setIsCategoryModalOpen(false);
  setEditingCategory(null);
};

  const handleAdd = () => {
    if (activeTab === "Category") {
      setEditingCategory(null);
      setIsCategoryModalOpen(true);
      return;
    }
    navigate(toolbarConfig[activeTab].createPath);
  };

  const currentSearchText = searchByTab[activeTab];

  const renderTable = () => {
    switch (activeTab) {
      case "Parameter":
        return (
          <ParameterTable
            onCountChange={setDataCount}
            searchText={currentSearchText}
            onEdit={(row) =>
              navigate("/pathology/configuration/test/parameter/create", {
                state: { mode: "edit", parameterData: row },
              })
            }
          />
        );

      case "Category":
        return (
          <CategoryTable
            onCountChange={setDataCount}
            searchText={currentSearchText}
            onEdit={(row) => {
              setEditingCategory(row);
              setIsCategoryModalOpen(true);
            }}
          />
        );

      case "Test":
        return (
          <TestTable
            onCountChange={setDataCount}
            searchText={currentSearchText}
            onEdit={(row) =>
              navigate("/pathology/configuration/test/test/create", {
                state: { mode: "edit", testData: row },
              })
            }
          />
        );

      case "Template":
        return (
          <TemplateTable
            onCountChange={setDataCount}
            searchText={currentSearchText}
            filterOpen={isTemplateFilterOpen}
            onFilterClose={() => setIsTemplateFilterOpen(false)}
            onEdit={(row) =>
              navigate("/pathology/configuration/test/template/create", {
                state: { mode: "edit", templateData: row },
              })
            }
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
    >
      <div className={styles.contentContainer}>
        <TabsHeader
          tabs={[...tabs]}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
        />

        <PageToolbar
          title={toolbarConfig[activeTab].title(dataCount)}
          searchPlaceholder={toolbarConfig[activeTab].searchPlaceholder}
          searchValue={searchByTab[activeTab]}
          createLabel={toolbarConfig[activeTab].createLabel}
          onSearch={(val: string) =>
            setSearchByTab((prev) => ({ ...prev, [activeTab]: val }))
          }
          onAdd={handleAdd}
          showFilter={activeTab === "Template"}
          onFilter={() => setIsTemplateFilterOpen(true)}
        />

        {renderTable()}

        <CreateCategoryModal
          isOpen={isCategoryModalOpen}
          onClose={() => {
            setIsCategoryModalOpen(false);
            setEditingCategory(null);
          }}
          existingCodes={categories.map((item) => item.code)}
          availableTests={availableTests}
          initialData={
            editingCategory
              ? {
                  code: editingCategory.code,
                  name: editingCategory.name,
                  testIds: editingCategory.tests.map(String),
                }
              : undefined
          }
          onSave={(formData) => {
            if (editingCategory) {
              dispatch(
                updateCategory({
                  id: editingCategory.id,
                  category_code: formData.categoryCode,
                  category_name: formData.categoryName,
                  tests: formData.testIds,
                }),
              );
            } else {
              dispatch(
                createCategory({
                  category_code: formData.categoryCode,
                  category_name: formData.categoryName,
                  status: true,
                  tests: formData.testIds,
                }),
              );
            }
            setIsCategoryModalOpen(false);
            setEditingCategory(null);
          }}
        />
      </div>
    </div>
  );
}

export default TestConfigurationView;
