// import { useEffect, useMemo, useState } from "react";
// import AddIcon from "../../../assets/icons/add-square.svg";
// import EditIcon from "../../../assets/icons/edit.svg";
// import LeftArrow from "../../../assets/icons/left_arrow.svg";
// import RightArrow from "../../../assets/icons/right_arrow.svg";
// import SearchIcon from "../../../assets/icons/search.png";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   createPathologyProfile,
//   fetchPathologyProfiles,
//   fetchServiceNameLists,
//   selectPathologyProfiles,
//   togglePathologyProfileStatus,
//   updatePathologyProfile,
// } from "../../../store/pathologyProfileSlice";
// import { AppDispatch } from "../../../store";
// import styles from "../../../styles/Configuration/PathologyProfile/pathologyProfile.module.css";
// import CreatePathologyProfileModal from "./CreatePathologyProfileModal";
// import { PathologyProfileItem } from "../../../types/pathologyProfile.types";

// function PathologyProfile() {
//   const [searchText, setSearchText] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const dispatch = useDispatch<AppDispatch>();

//   const pathologyProfilesData = useSelector(selectPathologyProfiles);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingProfile, setEditingProfile] = useState<PathologyProfileItem | null>(null);

//   const itemsPerPage = 10;

//   const filteredRows = useMemo(() => {
//     const query = searchText.trim().toLowerCase();

//     if (!query) {
//       return pathologyProfilesData;
//     }

//     return pathologyProfilesData.filter(
//       (item) =>
//         item.service_name.toLowerCase().includes(query),
//     );
//   }, [searchText, pathologyProfilesData]);

//   const totalItems = filteredRows.length;
//   const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
//   const safeCurrentPage = Math.min(currentPage, totalPages);
//   const startIndex = (safeCurrentPage - 1) * itemsPerPage;
//   const paginatedRows = filteredRows.slice(
//     startIndex,
//     startIndex + itemsPerPage,
//   );

//   const startEntry = totalItems === 0 ? 0 : startIndex + 1;
//   const endEntry = Math.min(startIndex + itemsPerPage, totalItems);

//   const toggleStatus = (id: number) => {
//     dispatch(togglePathologyProfileStatus(id));
//   };

//   useEffect(() => {
//     dispatch(fetchPathologyProfiles());
//     dispatch(fetchServiceNameLists());
//   }, [dispatch]);

//   return (
//     <div className={styles.container}>

//       <div className={styles.content}>
//         <div className={styles.toolbar}>
//           <span className={styles.title}>List of Profile ({pathologyProfilesData.length})</span>

//           <div className={styles.actions}>
//             <div className={styles.searchWrapper}>
//               <img
//                 src={SearchIcon}
//                 alt="search"
//                 className={styles.searchIcon}
//               />
//               <input
//                 value={searchText}
//                 onChange={(event) => {
//                   setSearchText(event.target.value);
//                   setCurrentPage(1);
//                 }}
//                 placeholder={`Search by Name`}
//                 className={styles.searchInput}
//               />
//             </div>

//             <button
//               type="button"
//               className={styles.createButton}
//               onClick={() => setIsModalOpen(true)}
//             >
//               <img src={AddIcon} alt="add" className={styles.createIcon} />
//               {`New Profile`}
//             </button>
//           </div>
//         </div>

//         <div className={styles.tableWrap}>
//           <table className={styles.table}>
//             <thead className={styles.tableHead}>
//               <tr>
//                 <th className={styles.th}>{`Service Name`}</th>
//                 <th className={styles.th}>{`No. of Test`}</th>
//                 <th className={`${styles.th} ${styles.statusHeader}`}>
//                   {" "}
//                   Status
//                 </th>
//                 <th className={`${styles.th} ${styles.actionHeader}`}></th>
//               </tr>
//             </thead>
//             <tbody>
//               {paginatedRows.length === 0 ? (
//                 <tr>
//                   <td className={`${styles.td} ${styles.mutedTd}`} colSpan={4}>
//                     No Profile found.
//                   </td>
//                 </tr>
//               ) : (
//                 paginatedRows.map((row) => (
//                   <tr key={row.id}>
//                     <td className={styles.td}>{row.service_name}</td>
//                     <td className={styles.td}>{row.no_of_tests ?? 0}</td>
//                     <td className={`${styles.td} ${styles.statusCell}`}>
//                       <label className={styles.switchLabel}>
//                         <input
//                           type="checkbox"
//                           checked={row.status}
//                           onChange={() => toggleStatus(row.id)}
//                           className={styles.switchInput}
//                         />
//                         <span
//                           className={
//                             row.status
//                               ? `${styles.slider} ${styles.sliderOn}`
//                               : styles.slider
//                           }
//                         >
//                           <span
//                             className={
//                               row.status
//                                 ? `${styles.knob} ${styles.knobOn}`
//                                 : styles.knob
//                             }
//                           />
//                         </span>
//                       </label>
//                     </td>
//                     <td className={`${styles.td} ${styles.actionCell}`}>
//                       <button
//                         type="button"
//                         className={styles.iconButton}
//                         aria-label={`Edit ${row.service_name}`}
//                         onClick={() => {
//                           setEditingProfile(row);
//                           setIsModalOpen(true);
//                         }}
//                       >
//                         <img src={EditIcon} alt="edit" width={14} height={14} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>

//           <div className={styles.tableFooter}>
//             <span>
//               Showing {startEntry} to {endEntry} of {totalItems} entries
//             </span>

//             <div className={styles.pagination}>
//               <button
//                 type="button"
//                 className={
//                   safeCurrentPage === 1
//                     ? `${styles.pageButton} ${styles.pageButtonDisabled}`
//                     : styles.pageButton
//                 }
//                 onClick={() =>
//                   setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
//                 }
//                 disabled={safeCurrentPage === 1}
//                 aria-label="Previous page"
//               >
//                 <img src={LeftArrow} alt="previous" width={10} height={10} />
//               </button>

//               {Array.from({ length: totalPages }, (_, index) => index + 1).map(
//                 (page) => (
//                   <button
//                     key={page}
//                     type="button"
//                     className={
//                       safeCurrentPage === page
//                         ? `${styles.pageButton} ${styles.pageButtonActive}`
//                         : styles.pageButton
//                     }
//                     onClick={() => setCurrentPage(page)}
//                   >
//                     {page}
//                   </button>
//                 ),
//               )}

//               <button
//                 type="button"
//                 className={
//                   safeCurrentPage === totalPages
//                     ? `${styles.pageButton} ${styles.pageButtonDisabled}`
//                     : styles.pageButton
//                 }
//                 onClick={() =>
//                   setCurrentPage((prevPage) =>
//                     Math.min(prevPage + 1, totalPages),
//                   )
//                 }
//                 disabled={safeCurrentPage === totalPages}
//                 aria-label="Next page"
//               >
//                 <img src={RightArrow} alt="next" width={10} height={10} />
//               </button>
//             </div>
//           </div>
//         </div>

//         {
// <CreatePathologyProfileModal
//   isOpen={isModalOpen}
//   editingProfile={editingProfile}
//   onClose={() => {
//     setIsModalOpen(false);
//     setEditingProfile(null);
//   }}
//   onSave={(data) => {
//     if (editingProfile) {
//       dispatch(
//         updatePathologyProfile({
//           id: editingProfile.id,
//           ...data,
//         })
//       );
//     } else {
//       dispatch(createPathologyProfile(data));
//     }
//   }}
// />}
//       </div>
//     </div>
//   );
// }
// export default PathologyProfile;
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "../../../assets/icons/edit.svg";
import DataTable, {
  Column,
  Toggle,
  PageToolbar,
} from "../Test/CommonComponents/DataTable/DataTable";
import {
  createPathologyProfile,
  fetchPathologyProfiles,
  fetchServiceNameLists,
  selectPathologyProfiles,
  updatePathologyProfile,
} from "../../../store/pathologyProfileSlice";
import type { AppDispatch } from "../../../store";
import type { PathologyProfileItem } from "../../../types/pathologyProfile.types";
import CreatePathologyProfileModal from "./CreatePathologyProfileModal";

export default function PathologyProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const profiles = useSelector(selectPathologyProfiles);

  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<PathologyProfileItem | null>(null);
  const [countDisplay, setCountDisplay] = useState(0);

  useEffect(() => {
    dispatch(fetchPathologyProfiles());
    dispatch(fetchServiceNameLists());
  }, [dispatch]);

  const filteredData = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return profiles;
    return profiles.filter((item) =>
      item.service_name.toLowerCase().includes(query)
    );
  }, [profiles, searchText]);

  useEffect(() => {
    setCountDisplay(filteredData.length);
  }, [filteredData]);

  const columns: Column<PathologyProfileItem>[] = [
    { key: "service_name", header: "Service Name", width: "60%" },
    {
      key: "no_of_tests",
      header: "No. of Tests",
      width: "20%",
      render: (row) => <span>{row.no_of_tests ?? 0}</span>,
    },
    {
      key: "status",
      header: "Status",
      align: "right",
      width: "14%",
      render: (row) => (
        <Toggle
          checked={row.status}
          onChange={() => {
            // TODO: wire status toggle to backend
          }}
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
          onClick={() => {
            setEditingProfile(row);
            setIsModalOpen(true);
          }}
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

  return (
    <div style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "0" }}>
        <PageToolbar
          title={`List of Profiles (${countDisplay})`}
          searchPlaceholder="Search by Service Name"
          searchValue={searchText}
          createLabel="New Profile"
          onSearch={(val) => setSearchText(val)}
          onAdd={() => {
            setEditingProfile(null);
            setIsModalOpen(true);
          }}
        />

        <DataTable columns={columns} data={filteredData} />

        <CreatePathologyProfileModal
          isOpen={isModalOpen}
          editingProfile={editingProfile}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProfile(null);
          }}
          onSave={(data) => {
            if (editingProfile) {
              dispatch(updatePathologyProfile({ id: editingProfile.id, ...data }));
            } else {
              dispatch(createPathologyProfile(data));
            }
          }}
        />
      </div>
    </div>
  );
}