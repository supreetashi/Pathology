import { useEffect, useMemo, useState } from "react";
import AddIcon from "../../../assets/icons/add-square.svg";
import EditIcon from "../../../assets/icons/edit.svg";
import LeftArrow from "../../../assets/icons/left_arrow.svg";
import RightArrow from "../../../assets/icons/right_arrow.svg";
import SearchIcon from "../../../assets/icons/search.png";
import { useDispatch, useSelector } from "react-redux";
import {
  createSample,
  createTube,
  fetchSamples,
  fetchTubes,
  selectSamples,
  selectTubes,
  toggleSampleStatus,
  toggleTubeStatus,
  updateSample,
  updateTube,
} from "../../../store/sampleTubeSlice";
import {
  SampleTubeItem,
  SampleTubeSortField,
  SampleTubeTab,
  SortOrder,
} from "../../../types/sampleTube.types";
import styles from "../../../styles/Configuration/SampleTube/sampleAndTube.module.css";
import { AppDispatch, RootState } from "../../../store";
import CreateSampleTubeModal from "./CreateSampleTubeModal";
import {
  SAMPLE_TUBE_PAGE_SIZE,
  SAMPLE_TUBE_TABS,
} from "../../../constants/sampleTube";
import { toast } from "react-toastify";

const tabs = SAMPLE_TUBE_TABS;
const itemsPerPage = SAMPLE_TUBE_PAGE_SIZE;

function SampleAndTube() {
  const [activeTab, setActiveTab] = useState<SampleTubeTab>("Sample");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch<AppDispatch>();

  const sampleData = useSelector(selectSamples);
  const tubeData = useSelector(selectTubes);
  const error = useSelector((state: RootState) => state.sampleTube.error);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SampleTubeItem | null>(null);

  const [sortField, setSortField] = useState<SampleTubeSortField | null>(null);

  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const activeData = activeTab === "Sample" ? sampleData : tubeData;

  const filteredRows = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    let rows = [...activeData];

    if (query) {
      rows = rows.filter(
        (item) =>
          item.code.toLowerCase().includes(query) ||
          item.name.toLowerCase().includes(query),
      );
    }

    if (sortField) {
      rows.sort((a, b) => {
        let result = 0;

        if (sortField === "status") {
          result = Number(a.isActive) - Number(b.isActive);
        } else {
          result = a[sortField]
            .toLowerCase()
            .localeCompare(b[sortField].toLowerCase());
        }

        return sortOrder === "asc" ? result : -result;
      });
    }

    return rows;
  }, [searchText, activeData, sortField, sortOrder]);

  const totalItems = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const paginatedRows = filteredRows.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const startEntry = totalItems === 0 ? 0 : startIndex + 1;
  const endEntry = Math.min(startIndex + itemsPerPage, totalItems);

  const toolbarTitle = `List of ${activeTab} (${activeData.length})`;

  const handleTabClick = (tab: SampleTubeTab) => {
    setActiveTab(tab);
    setSearchText("");
    setCurrentPage(1);
  };

  const handleSort = (field: SampleTubeSortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field: SampleTubeSortField) =>
    sortField === field ? (sortOrder === "asc" ? " ▲" : " ▼") : "";

  const handleStatusToggle = (id: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    if (activeTab === "Sample") {
      dispatch(toggleSampleStatus(id));

      toast.success(
        `Sample ${newStatus ? "activated" : "deactivated"} successfully`,
      );
    } else {
      dispatch(toggleTubeStatus(id));

      toast.success(
        `Tube ${newStatus ? "activated" : "deactivated"} successfully`,
      );
    }
  };

  const handleSave = async (code: string, name: string) => {
    try {
      if (editingItem) {
        if (activeTab === "Sample") {
          await dispatch(
            updateSample({
              id: editingItem.id,
              payload: {
                sample_code: code,
                sample_name: name,
                frequency: 1,
              },
            }),
          ).unwrap();

          toast.success("Sample updated successfully");
        } else {
          await dispatch(
            updateTube({
              id: editingItem.id,
              payload: {
                tube_code: code,
                tube_name: name,
              },
            }),
          ).unwrap();

          toast.success("Tube updated successfully");
        }
      } else {
        if (activeTab === "Sample") {
          await dispatch(
            createSample({
              sample_code: code,
              sample_name: name,
              frequency: 1,
            }),
          ).unwrap();

          toast.success("Sample created successfully");
        } else {
          await dispatch(
            createTube({
              tube_code: code,
              tube_name: name,
            }),
          ).unwrap();

          toast.success("Tube created successfully");
        }
      }

      setEditingItem(null);
    } catch {
      toast.error(
        `Failed to ${
          editingItem ? "update" : "create"
        } ${activeTab.toLowerCase()}`,
      );
    }
  };

  useEffect(() => {
    dispatch(fetchSamples());
    dispatch(fetchTubes());
  }, [dispatch]);

  useEffect(() => {
    if (!error) return;

    toast.error(error);
  }, [error]);

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        {tabs.map((tab) => {
          return (
            <button
              key={tab}
              type="button"
              className={
                activeTab === tab
                  ? `${styles.tabButton} ${styles.tabButtonActive}`
                  : styles.tabButton
              }
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div className={styles.content}>
        <div className={styles.toolbar}>
          <span className={styles.title}>{toolbarTitle}</span>

          <div className={styles.actions}>
            <div className={styles.searchWrapper}>
              <img
                src={SearchIcon}
                alt="search"
                className={styles.searchIcon}
              />
              <input
                value={searchText}
                onChange={(event) => {
                  setSearchText(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder={`Search by ${activeTab} Code / Name`}
                className={styles.searchInput}
              />
            </div>

            <button
              type="button"
              className={styles.createButton}
              onClick={() => setIsModalOpen(true)}
            >
              <img src={AddIcon} alt="add" className={styles.createIcon} />
              {`Create New ${activeTab}`}
            </button>
          </div>
        </div>

        <div className={styles.tableWrap}>
          <div className={styles.tableBody}>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th
                    className={`${styles.th} ${styles.codeColumn} ${styles.sortableHeader}`}
                    onClick={() => handleSort("code")}
                  >
                    {`${activeTab} Code`}
                    {getSortIcon("code")}
                  </th>

                  <th
                    className={`${styles.th} ${styles.nameColumn} ${styles.sortableHeader}`}
                    onClick={() => handleSort("name")}
                  >
                    {`${activeTab} Name`}
                    {getSortIcon("name")}
                  </th>
                  <th
                    className={`${styles.th} ${styles.statusHeader} ${styles.sortableHeader}`}
                    onClick={() => handleSort("status")}
                  >
                    Status
                    {getSortIcon("status")}
                  </th>
                  <th className={`${styles.th} ${styles.actionHeader}`}></th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.length === 0 ? (
                  <tr>
                    <td
                      className={`${styles.td} ${styles.mutedTd}`}
                      colSpan={4}
                    >
                      No {activeTab.toLowerCase()} records found.
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((row) => (
                    <tr key={row.id}>
                      <td className={`${styles.td} ${styles.codeColumn}`}>
                        {row.code}
                      </td>

                      <td className={`${styles.td} ${styles.nameColumn}`}>
                        {row.name}
                      </td>
                      <td className={`${styles.td} ${styles.statusCell}`}>
                        <label className={styles.switchLabel}>
                          <input
                            type="checkbox"
                            checked={row.isActive}
                            onChange={() =>
                              handleStatusToggle(row.id, row.isActive)
                            }
                            className={styles.switchInput}
                          />
                          <span
                            className={
                              row.isActive
                                ? `${styles.slider} ${styles.sliderOn}`
                                : styles.slider
                            }
                          >
                            <span
                              className={
                                row.isActive
                                  ? `${styles.knob} ${styles.knobOn}`
                                  : styles.knob
                              }
                            />
                          </span>
                        </label>
                      </td>
                      <td className={`${styles.td} ${styles.actionCell}`}>
                        <button
                          type="button"
                          className={styles.iconButton}
                          onClick={() => {
                            setEditingItem(row);
                            setIsModalOpen(true);
                          }}
                        >
                          <img
                            src={EditIcon}
                            alt="edit"
                            width={14}
                            height={14}
                          />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className={styles.tableFooter}>
            <span>
              Showing {startEntry} to {endEntry} of {totalItems} entries
            </span>

            <div className={styles.pagination}>
              <button
                type="button"
                className={
                  safeCurrentPage === 1
                    ? `${styles.pageButton} ${styles.pageButtonDisabled}`
                    : styles.pageButton
                }
                onClick={() =>
                  setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
                }
                disabled={safeCurrentPage === 1}
                aria-label="Previous page"
              >
                <img src={LeftArrow} alt="previous" width={10} height={10} />
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    className={
                      safeCurrentPage === page
                        ? `${styles.pageButton} ${styles.pageButtonActive}`
                        : styles.pageButton
                    }
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                type="button"
                className={
                  safeCurrentPage === totalPages
                    ? `${styles.pageButton} ${styles.pageButtonDisabled}`
                    : styles.pageButton
                }
                onClick={() =>
                  setCurrentPage((prevPage) =>
                    Math.min(prevPage + 1, totalPages),
                  )
                }
                disabled={safeCurrentPage === totalPages}
                aria-label="Next page"
              >
                <img src={RightArrow} alt="next" width={10} height={10} />
              </button>
            </div>
          </div>
        </div>

        <CreateSampleTubeModal
          isOpen={isModalOpen}
          type={activeTab}
          mode={editingItem ? "edit" : "create"}
          initialCode={editingItem?.code}
          initialName={editingItem?.name}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
export default SampleAndTube;
