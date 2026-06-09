import React, { useEffect, useState } from "react";
import "./Add_agency.css";
import back_icon from "../../../assets/icons/back_icon.svg";
import { http } from "../../../services/http";
import {
  agencyApi,
  type Agency,
  type CreateAgencyPayload,
} from "../../../services/agency.api";

interface Props {
  onBack: () => void;
  onSaved: () => void;
  editingAgency?: Agency | null;
}

interface ServiceOption {
  id: number;
  name: string;
}

interface Service {
  id: number;
  name: string;
  rate: string;
}

const AddNewAgency: React.FC<Props> = ({ onBack, onSaved, editingAgency }) => {
  const isEdit = !!editingAgency;
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [agencyData, setAgencyData] = useState({
    code: "",
    name: "",
    country: "",
    state: "",
    city: "",
    pinCode: "",
    field1: "",
    field2: "",
    field3: "",
    contact1Name: "",
    contact1Phone: "",
    contact1Email: "",
    contact2Name: "",
    contact2Phone: "",
    contact2Email: "",
  });

  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [allServiceOptions, setAllServiceOptions] = useState<ServiceOption[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);

  // ── Fetch laboratory tests from Vidai ────────────────
  useEffect(() => {
    const fetchServices = async () => {
      setLoadingServices(true);
      try {
        const allItems: any[] = [];
        let offset = 0;
        const limit = 100;

        while (true) {
          const res = await http.get(
            `/laboratory-test/?limit=${limit}&offset=${offset}`
          );
          const data = res.data;
          const objects = data?.objects ?? [];
          allItems.push(...objects);
          if (!data?.meta?.next) break;
          offset += limit;
        }

        setAllServiceOptions(
          allItems.map((item: any) => ({
            id: item.id,
            name: item.name ?? "Unknown",
          }))
        );
      } catch (err) {
        console.error("Failed to fetch laboratory tests:", err);
        setAllServiceOptions([]);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  // ── Pre-fill when editing ────────────────────────────
  useEffect(() => {
    if (editingAgency) {
      setAgencyData({
        code: editingAgency.agency_code ?? "",
        name: editingAgency.agency_name ?? "",
        country: editingAgency.country ?? "",
        state: editingAgency.state ?? "",
        city: editingAgency.city ?? "",
        pinCode: editingAgency.pincode ?? "",
        field1: editingAgency.address_line_1 ?? "",
        field2: editingAgency.address_line_2 ?? "",
        field3: editingAgency.address_line_3 ?? "",
        contact1Name: editingAgency.contact_person_1_name ?? "",
        contact1Phone: editingAgency.contact_person_1_mobile ?? "",
        contact1Email: editingAgency.contact_person_1_email ?? "",
        contact2Name: editingAgency.contact_person_2_name ?? "",
        contact2Phone: editingAgency.contact_person_2_mobile ?? "",
        contact2Email: editingAgency.contact_person_2_email ?? "",
      });

      if (Array.isArray(editingAgency.agency_services)) {
        setServices(
          editingAgency.agency_services.map((s) => ({
            id: s.id,
            name: s.service_name ?? s.profile_name ?? "",
            rate: s.rate,
          }))
        );
      }
    }
  }, [editingAgency]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAgencyData((prev) => ({ ...prev, [name]: value }));
  };

  // ── Services ─────────────────────────────────────────
  const filteredServiceOptions = allServiceOptions.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) &&
      !services.find((added) => added.name === s.name)
  );

  const addService = (svc: ServiceOption) => {
    setServices((prev) => [
      ...prev,
      { id: Date.now(), name: svc.name, rate: "" },
    ]);
    setSearch("");
  };

  const removeService = (id: number) =>
    setServices((prev) => prev.filter((s) => s.id !== id));

  const updateRate = (id: number, value: string) =>
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, rate: value } : s))
    );

  // ── Build payload ────────────────────────────────────
  const buildPayload = (): CreateAgencyPayload => ({
    agency_code: agencyData.code,
    agency_name: agencyData.name,
    country: agencyData.country || undefined,
    state: agencyData.state || undefined,
    city: agencyData.city || undefined,
    pincode: agencyData.pinCode || undefined,
    address_line_1: agencyData.field1 || undefined,
    address_line_2: agencyData.field2 || undefined,
    address_line_3: agencyData.field3 || undefined,
    contact_person_1_name: agencyData.contact1Name || undefined,
    contact_person_1_mobile: agencyData.contact1Phone || undefined,
    contact_person_1_email: agencyData.contact1Email || undefined,
    contact_person_2_name: agencyData.contact2Name || undefined,
    contact_person_2_mobile: agencyData.contact2Phone || undefined,
    contact_person_2_email: agencyData.contact2Email || undefined,
    agency_services: services.map((s) => ({
      service_name: s.name,
      rate: s.rate,
      status: true,
    })),
  });

  // ── Save ─────────────────────────────────────────────
  const handleSave = async () => {
    setError(null);
    setSaving(true);
    try {
      const payload = buildPayload();
      if (isEdit && editingAgency) {
        await agencyApi.update(editingAgency.id, payload);
      } else {
        await agencyApi.create(payload);
      }
      onSaved();
    } catch (err: any) {
      console.error("Save failed:", err);
      const djangoError = err?.response?.data;
      if (djangoError && typeof djangoError === "object") {
        const messages = Object.entries(djangoError)
          .map(([field, msgs]) => {
            if (Array.isArray(msgs)) {
              return `${field}: ${msgs
                .map((m) =>
                  typeof m === "object" ? JSON.stringify(m) : String(m)
                )
                .join(", ")}`;
            }
            return `${field}: ${msgs}`;
          })
          .join(" | ");
        setError(messages);
      } else {
        setError("Failed to save. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="add-wrapper">
      {/* Header */}
      <div className="top-header">
        <button className="edit-btn" onClick={onBack}>
          <img src={back_icon} alt="back" />
        </button>
        <h2>{isEdit ? "Edit Agency" : "Add New Agency"}</h2>
      </div>

      {/* Stepper */}
      <div className="stepper">
        <div className={`step ${step === 1 ? "active" : ""}`}>
          1 Agency Details
        </div>
        <div className={`step ${step === 2 ? "active" : ""}`}>
          2 Service Details
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div
          style={{
            color: "red",
            padding: "8px 16px",
            background: "#fff0f0",
            borderRadius: 6,
            margin: "0 0 12px",
            fontSize: 13,
            wordBreak: "break-word",
          }}
        >
          {error}
        </div>
      )}

      {/* ── STEP 1 ── */}
      {step === 1 && (
        <div className="form-container">
          <h4>BASIC DETAILS</h4>

          <div className="row">
            <input
              name="code"
              placeholder="Agency Code"
              value={agencyData.code}
              onChange={handleChange}
            />
            <input
              name="name"
              placeholder="Agency Name"
              value={agencyData.name}
              onChange={handleChange}
            />
          </div>

          <div className="row">
            <select
              name="country"
              value={agencyData.country}
              onChange={handleChange}
            >
              <option value="">Select Country</option>
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
            </select>

            <select
              name="state"
              value={agencyData.state}
              onChange={handleChange}
            >
              <option value="">Select State</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Delhi">Delhi</option>
            </select>

            <select
              name="city"
              value={agencyData.city}
              onChange={handleChange}
            >
              <option value="">Select City</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Chennai">Chennai</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
            </select>

            <input
              name="pinCode"
              placeholder="Pin Code"
              value={agencyData.pinCode}
              onChange={handleChange}
            />
          </div>

          <div className="row">
            <input
              name="field1"
              placeholder="Address Line 1"
              value={agencyData.field1}
              onChange={handleChange}
            />
            <input
              name="field2"
              placeholder="Address Line 2"
              value={agencyData.field2}
              onChange={handleChange}
            />
            <input
              name="field3"
              placeholder="Address Line 3"
              value={agencyData.field3}
              onChange={handleChange}
            />
          </div>

          <h4>CONTACT DETAILS</h4>

          <div className="contact-box">
            <p>CONTACT PERSON 1</p>
            <div className="row">
              <input
                name="contact1Name"
                placeholder="Name"
                value={agencyData.contact1Name}
                onChange={handleChange}
              />
              <input
                name="contact1Phone"
                placeholder="Phone Number"
                value={agencyData.contact1Phone}
                onChange={handleChange}
              />
              <input
                name="contact1Email"
                placeholder="Email Address"
                value={agencyData.contact1Email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="contact-box">
            <p>CONTACT PERSON 2</p>
            <div className="row">
              <input
                name="contact2Name"
                placeholder="Name"
                value={agencyData.contact2Name}
                onChange={handleChange}
              />
              <input
                name="contact2Phone"
                placeholder="Phone Number"
                value={agencyData.contact2Phone}
                onChange={handleChange}
              />
              <input
                name="contact2Email"
                placeholder="Email Address"
                value={agencyData.contact2Email}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2 ── */}
      {step === 2 && (
        <div className="service-container">
          <div className="service-header">
            <div>
              <span>
                Agency Code: <b>{agencyData.code || "—"}</b>
              </span>
              <span>
                Agency Name: <b>{agencyData.name || "—"}</b>
              </span>
            </div>

            <div className="search-wrapper">
              <input
                className="search"
                placeholder={
                  loadingServices
                    ? "Loading services..."
                    : "Search & Add Service"
                }
                value={search}
                disabled={loadingServices}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && !loadingServices && (
                <div className="dropdown">
                  {filteredServiceOptions.length === 0 ? (
                    <div
                      className="dropdown-item"
                      style={{ color: "#aaa" }}
                    >
                      No results
                    </div>
                  ) : (
                    filteredServiceOptions.map((item) => (
                      <div
                        key={item.id}
                        className="dropdown-item"
                        onClick={() => addService(item)}
                      >
                        {item.name}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <h4>SERVICE LIST ({services.length})</h4>

          <div className="service-grid">
            {services.map((s) => (
              <div key={s.id} className="service-card">
                <button
                  className="remove-btn"
                  onClick={() => removeService(s.id)}
                >
                  ×
                </button>

                <div className="field">
                  <label>Service Name</label>
                  <select value={s.name} onChange={() => {}}>
                    <option>{s.name}</option>
                  </select>
                </div>

                <div className="field">
                  <label>Rate (₹)</label>
                  <input
                    value={s.rate}
                    onChange={(e) => updateRate(s.id, e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
            ))}

            {services.length === 0 && (
              <p style={{ color: "#aaa", padding: "12px 0" }}>
                No services added. Search above to add.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="footer">
        <button className="cancel" onClick={onBack} disabled={saving}>
          Cancel
        </button>

        {step === 1 ? (
          <button
            className="save"
            onClick={() => setStep(2)}
            disabled={!agencyData.code || !agencyData.name}
          >
            Save & Next
          </button>
        ) : (
          <button className="save" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : isEdit ? "Update" : "Save"}
          </button>
        )}
      </div>
    </div>
  );
};

export default AddNewAgency;