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
} from "../../../store/sampleTubeSlice";
import { SampleTubeTab } from "../../../types/sampleTube.types";
import styles from "../../../styles/Configuration/SampleTube/sampleAndTube.module.css";
import { AppDispatch } from "../../../store";
import CreateSampleTubeModal from "./CreateSampleTubeModal";

const tabs: SampleTubeTab[] = ["Sample", "Tube"];

function SampleAndTube() {
  const [activeTab, setActiveTab] = useState<SampleTubeTab>("Sample");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch<AppDispatch>();

  const sampleData = useSelector(selectSamples);
  const tubeData = useSelector(selectTubes);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 10;

  const activeData = activeTab === "Sample" ? sampleData : tubeData;

  const filteredRows = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      return activeData;
    }

    return activeData.filter(
      (item) =>
        item.code.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query),
    );
  }, [searchText, activeData]);

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

  const toggleStatus = (id: number) => {
    if (activeTab === "Sample") {
      dispatch(toggleSampleStatus(id));
    } else {
      dispatch(toggleTubeStatus(id));
    }
  };

  useEffect(() => {
    dispatch(fetchSamples());
    dispatch(fetchTubes());
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        {tabs.map((tab) => {
          // const tabStyle =
          //   activeTab === tab
          //     ? { ...styles.tabButton, ...styles.tabButtonActive }
          //     : styles.tabButton;

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
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th className={styles.th}>{`${activeTab} Code`}</th>
                <th className={styles.th}>{`${activeTab} Name`}</th>
                <th className={`${styles.th} ${styles.statusHeader}`}>
                  {" "}
                  Status
                </th>
                <th className={`${styles.th} ${styles.actionHeader}`}></th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.length === 0 ? (
                <tr>
                  <td className={`${styles.td} ${styles.mutedTd}`} colSpan={4}>
                    No {activeTab.toLowerCase()} records found.
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row) => (
                  <tr key={row.id}>
                    <td className={styles.td}>{row.code}</td>
                    <td className={styles.td}>{row.name}</td>
                    <td className={`${styles.td} ${styles.statusCell}`}>
                      <label className={styles.switchLabel}>
                        <input
                          type="checkbox"
                          checked={row.isActive}
                          onChange={() => toggleStatus(row.id)}
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
                        aria-label={`Edit ${row.name}`}
                      >
                        <img src={EditIcon} alt="edit" width={14} height={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

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

        {/* STEP 4 — ADD HERE */}
        <CreateSampleTubeModal
          isOpen={isModalOpen}
          type={activeTab}
          onClose={() => setIsModalOpen(false)}
          onSave={(code, name) => {
            if (activeTab === "Sample") {
              dispatch(
                createSample({
                  sample_code: code,
                  sample_name: name,
                  frequency: 1,
                }),
              );
            } else {
              dispatch(
                createTube({
                  tube_code: code,
                  tube_name: name,
                }),
              );
            }
          }}
        />
      </div>
    </div>
  );
}
export default SampleAndTube;
