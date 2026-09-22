import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AdminNav from "../../components/AdminNav";
import { flaggedListings as seedFlags } from "../../data/flaggedListings";
import "./Admin.css";

export default function FlaggedListings() {
  const [rows, setRows] = useState(seedFlags);
  const [filter, setFilter] = useState("Open");

  const visible = rows.filter((row) => filter === "All" || row.status === filter);

  const setStatus = (id, status) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, status } : row)));
  };

  return (
    <div className="page">
      <Header />
      <main className="member-main">
        <h1>Manage Flagged Listings</h1>
        <p className="browse-subtitle">Review reports and keep listings that break campus rules off the store.</p>
        <AdminNav />

        <div className="admin-filters">
          {["Open", "Resolved", "Removed", "All"].map((value) => (
            <button
              key={value}
              type="button"
              className={filter === value ? "category-pill active" : "category-pill"}
              onClick={() => setFilter(value)}
            >
              {value}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="browse-empty">No flagged listings in this view.</p>
        ) : (
          <ul className="flag-list">
            {visible.map((flag) => (
              <li key={flag.id} className="flag-card">
                <div>
                  <p className="flag-title">{flag.name}</p>
                  <p className="flag-meta">
                    Vendor {flag.vendor} · Reported by {flag.reportedBy} · {flag.date}
                  </p>
                  <p className="flag-reason">{flag.reason}</p>
                </div>
                <div className="flag-actions">
                  <span className={flag.status === "Open" ? "badge badge-warn" : "badge badge-ok"}>
                    {flag.status}
                  </span>
                  {flag.status === "Open" ? (
                    <>
                      <button type="button" className="btn-small" onClick={() => setStatus(flag.id, "Resolved")}>
                        Dismiss
                      </button>
                      <button type="button" className="btn-small btn-danger" onClick={() => setStatus(flag.id, "Removed")}>
                        Remove listing
                      </button>
                    </>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
}
