import { useEffect, useMemo, useState } from "react";
import AddIcon from "../../../assets/icons/add-square.svg";
import EditIcon from "../../../assets/icons/edit.svg";
import LeftArrow from "../../../assets/icons/left_arrow.svg";
import RightArrow from "../../../assets/icons/right_arrow.svg";
import SearchIcon from "../../../assets/icons/search.png";
import { useDispatch, useSelector } from "react-redux";
import {
  createPathologyProfile,
  fetchPathologyProfiles,
  fetchServiceNameLists,
  selectPathologyProfiles,
  togglePathologyProfileStatus,
} from "../../../store/pathologyProfileSlice";
import { AppDispatch } from "../../../store";
import styles from "../../../styles/Configuration/PathologyProfile/pathologyProfile.module.css";
import CreatePathologyProfileModal from "./CreatePathologyProfileModal";

function PathologyProfile() {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch<AppDispatch>();

  const pathologyProfilesData = useSelector(selectPathologyProfiles);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 10;

  const filteredRows = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      return pathologyProfilesData;
    }

    return pathologyProfilesData.filter(
      (item) =>
        item.service_name.toLowerCase().includes(query),
    );
  }, [searchText, pathologyProfilesData]);

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

  const toggleStatus = (id: number) => {
    dispatch(togglePathologyProfileStatus(id));
  };

  useEffect(() => {
    dispatch(fetchPathologyProfiles());
    dispatch(fetchServiceNameLists());
  }, [dispatch]);

  return (
    <div className={styles.container}>

      <div className={styles.content}>
        <div className={styles.toolbar}>
          <span className={styles.title}>List of Profile ({pathologyProfilesData.length})</span>

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
                placeholder={`Search by Name`}
                className={styles.searchInput}
              />
            </div>

            <button
              type="button"
              className={styles.createButton}
              onClick={() => setIsModalOpen(true)}
            >
              <img src={AddIcon} alt="add" className={styles.createIcon} />
              {`New Profile`}
            </button>
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th className={styles.th}>{`Service Name`}</th>
                <th className={styles.th}>{`No. of Test`}</th>
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
                    No Profile found.
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row) => (
                  <tr key={row.id}>
                    <td className={styles.td}>{row.service_name}</td>
                    <td className={styles.td}>{row.tests}</td>
                    <td className={`${styles.td} ${styles.statusCell}`}>
                      <label className={styles.switchLabel}>
                        <input
                          type="checkbox"
                          checked={row.status}
                          onChange={() => toggleStatus(row.id)}
                          className={styles.switchInput}
                        />
                        <span
                          className={
                            row.status
                              ? `${styles.slider} ${styles.sliderOn}`
                              : styles.slider
                          }
                        >
                          <span
                            className={
                              row.status
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
                        aria-label={`Edit ${row.service_name}`}
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

        <CreatePathologyProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={(service_name: any, tests: any) => {
            dispatch(
              createPathologyProfile({
                service_name: service_name,
                tests: tests,
              }),
            );
          }}
        />
      </div>
    </div>
  );
}
export default PathologyProfile;
