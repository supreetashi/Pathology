import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TopSection from "../components/Authorization/TopSection";
import TableSection from "../components/Authorization/TableSection";
import ResultDetails from "../components/Authorization/ResultDetails";
import { AuthorizationItem } from "../types";
import { getAuthorizations } from "../services/authorization.api";
import "../styles/Authorization/AuthorizationPage.css";

const AuthorizationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [search, setSearch] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);

  const [selectedAuthorization, setSelectedAuthorization] =
    useState<AuthorizationItem | null>(null);

  const [data, setData] = useState<AuthorizationItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCounts = async () => {
    try {
      const pending = await getAuthorizations("Pending");
      const approved = await getAuthorizations("APPROVED");
      const rejected = await getAuthorizations("REJECTED");

      setPendingCount(pending.length);
      setApprovedCount(approved.length);
      setRejectedCount(rejected.length);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load authorization counts");
    }
  };

  useEffect(() => {
    loadCounts();
  }, []);

  const fetchAuthorizations = async () => {
    try {
      setLoading(true);

      const status =
        activeTab === "pending"
          ? "Pending"
          : activeTab === "approved"
          ? "APPROVED"
          : "REJECTED";

      const response = await getAuthorizations(status, search);

      setData(response);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load authorizations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthorizations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, search]);

  return (
    <div className="container">
      {showResult ? (
        <ResultDetails
          onBack={() => {
            setShowResult(false);
            loadCounts();
            fetchAuthorizations();
          }}
          authorization={selectedAuthorization}
        />
      ) : (
        <>
          <TopSection
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            search={search}
            setSearch={setSearch}
            pendingCount={pendingCount}
            approvedCount={approvedCount}
            rejectedCount={rejectedCount}
          />

          {loading ? (
            <p>Loading...</p>
          ) : (
            <TableSection
              data={data}
              onViewResult={(item) => {
                setSelectedAuthorization(item);
                setShowResult(true);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AuthorizationPage;