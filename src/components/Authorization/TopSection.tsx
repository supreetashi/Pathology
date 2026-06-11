import React from "react";
import "../../styles/Authorization/TopSection.css";

type Props = {
  activeTab: "pending" | "approved";
  setActiveTab: (tab: "pending" | "approved") => void;
  search: string;
  setSearch: (value: string) => void;
  pendingCount: number;
  approvedCount: number;
};

const TopSection: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  search,
  setSearch,
  pendingCount,
  approvedCount,
}) => {
  return (
    <>
      {/* Header */}
      <div className="header">
        <h2>Authorization List</h2>

        <input
          placeholder="Search by Patient name, MRN No."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "pending" ? "active" : ""}
          onClick={() => setActiveTab("pending")}
        >
          Pending ({pendingCount})
        </button>

        <button
          className={activeTab === "approved" ? "active" : ""}
          onClick={() => setActiveTab("approved")}
        >
          Approved ({approvedCount})
        </button>
      </div>
    </>
  );
};

export default TopSection;
