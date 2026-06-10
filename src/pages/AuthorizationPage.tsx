import React, { useEffect, useState } from "react";
import TopSection from "../components/Authorization/TopSection";
import TableSection from "../components/Authorization/TableSection";
import ResultDetails from "../components/Authorization/ResultDetails";
import { AuthorizationItem } from "../types";
import { getAuthorizations } from "../services/authorizationService";
import "../styles/Authorization/AuthorizationPage.css";

const AuthorizationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");
  const [search, setSearch] = useState("");
  const [showResult, setShowResult] = useState(false);

  const [selectedAuthorization, setSelectedAuthorization] =
    useState<AuthorizationItem | null>(null);

  const [data, setData] = useState<AuthorizationItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAuthorizations = async () => {
    try {
      setLoading(true);

      const status =
        activeTab === "pending"
          ? "Pending"
          : "APPROVED";

      const response = await getAuthorizations(
        status,
        search
      );

      setData(response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthorizations();
  }, [activeTab, search]);

  return (
    <div className="container">
      {showResult ? (
        <ResultDetails
          onBack={() => setShowResult(false)}
          authorization={selectedAuthorization}
        />
      ) : (
        <>
          <TopSection
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            search={search}
            setSearch={setSearch}
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