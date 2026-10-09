import { useEffect, useState } from "react";
import AdminNav from "../../components/AdminNav";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../context/AuthContext";
import "./Admin.css";

const filters = [
  { value: "open", label: "Open" },
  { value: "resolved", label: "Resolved" },
  { value: "dismissed", label: "Dismissed" },
  { value: "all", label: "All" },
];

export default function FlaggedListings() {
  const { profile } = useAuth();
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("open");
  const [loading, setLoading] = useState(true);

  const loadFlags = async () => {
    // Replace line 19 in FlaggedListings.jsx:
const { data, error } = await supabase
  .from("listing_flags")
  .select(
    "flag_id, reason, description, status, created_at, products(product_name, vendor_public(business_name)), profiles!listing_flags_user_id_fkey(full_name)"
  )
  .order("created_at", { ascending: false });
    if (error) {
      console.error("Error loading flags:", error.message);
    } else {
      setRows(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadFlags();
  }, []);

  const visible = rows.filter((row) => filter === "all" || row.status === filter);

  const resolveFlag = async (flagId, action) => {
    if (
      action === "remove" &&
      !window.confirm("Remove this listing from the store?")
    ) {
      return;
    }

    const { error } = await supabase.rpc("admin_resolve_flag", {
      p_flag_id: flagId,
      p_action: action,
    });

    if (error) {
      console.error("Resolve failed:", error.message);
      alert("Could not update flag: " + error.message);
      return;
    }

    await loadFlags();
  };

  return (
    <div className="admin-layout">
      <AdminNav />

      <main className="admin-content">
        <div className="admin-topbar">
          <div>
            <h1>Flagged Listings</h1>
            <p>Review reports and keep listings that break campus rules off the store.</p>
          </div>

          <div className="admin-profile">
            <div className="admin-avatar">{profile?.full_name?.[0] ?? "A"}</div>
            <div>
              <strong>{profile?.full_name ?? "Admin"}</strong>
              <span>Administrator</span>
            </div>
          </div>
        </div>

        <section className="admin-panel">
          <div className="admin-filters">
            {filters.map((f) => (
              <button
                key={f.value}
                type="button"
                className={filter === f.value ? "category-pill active" : "category-pill"}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="browse-empty">Loading flagged listings...</p>
          ) : visible.length === 0 ? (
            <p className="browse-empty">No flagged listings in this view.</p>
          ) : (
            <ul className="flag-list">
              {visible.map((flag) => (
                <li key={flag.flag_id} className="flag-card">
                  <div>
                    <p className="flag-title">
                      {flag.products?.product_name ?? "Listing removed"}
                    </p>
                    <p className="flag-meta">
                      Vendor {flag.products?.vendor_public?.business_name ?? "Unknown"} ·
                      Reported by {flag.profiles?.full_name ?? "Unknown"} ·{" "}
                      {new Date(flag.created_at).toLocaleDateString()}
                    </p>
                    <p className="flag-reason">
                      {flag.reason}
                      {flag.description ? ` — ${flag.description}` : ""}
                    </p>
                  </div>

                  <div className="flag-actions">
                    <span
                      className={flag.status === "open" ? "badge badge-warn" : "badge badge-ok"}
                    >
                      {flag.status.charAt(0).toUpperCase() + flag.status.slice(1)}
                    </span>

                    {flag.status === "open" && (
                      <>
                        <button
                          type="button"
                          className="btn-small"
                          onClick={() => resolveFlag(flag.flag_id, "dismiss")}
                        >
                          Dismiss
                        </button>
                        <button
                          type="button"
                          className="btn-small btn-danger"
                          onClick={() => resolveFlag(flag.flag_id, "remove")}
                        >
                          Remove listing
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}