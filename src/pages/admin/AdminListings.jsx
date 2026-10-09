import { useEffect, useState } from "react";
import AdminNav from "../../components/AdminNav";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../context/AuthContext";
import "./Admin.css";

const filters = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "sold", label: "Sold" },
  { value: "removed", label: "Removed" },
];

export default function AdminListings() {
  const { profile } = useAuth();
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const loadListings = async () => {
    const { data, error } = await supabase
      .from("products")
      .select(
        "product_id, product_name, price, quantity, status, created_at, categories(category_name), vendor_public(business_name)"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading listings:", error.message);
    } else {
      setRows(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadListings();
  }, []);

  const visible = rows.filter((row) => {
    const matchesStatus = filter === "all" || row.status === filter;
    const haystack = `${row.product_name} ${row.vendor_public?.business_name ?? ""} ${
      row.categories?.category_name ?? ""
    }`.toLowerCase();
    return matchesStatus && haystack.includes(query.toLowerCase());
  });

  const setStatus = async (row, status) => {
    if (
      status === "removed" &&
      !window.confirm(`Remove "${row.product_name}" from the store?`)
    ) {
      return;
    }

    const { error } = await supabase.rpc("admin_set_product_status", {
      p_product_id: row.product_id,
      p_status: status,
    });

    if (error) {
      console.error("Status update failed:", error.message);
      alert("Could not update listing: " + error.message);
      return;
    }

    await loadListings();
  };

  const badgeClass = (status) =>
    status === "active" ? "badge badge-ok" : "badge badge-warn";

  return (
    <div className="admin-layout">
      <AdminNav />

      <main className="admin-content">
        <div className="admin-topbar">
          <div>
            <h1>Listings</h1>
            <p>Search every listing on the store and remove ones that break the rules.</p>
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

          <input
            className="admin-search"
            type="search"
            placeholder="Search by name, vendor, or category..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="admin-table-wrap">
            {loading ? (
              <p className="browse-empty">Loading listings...</p>
            ) : visible.length === 0 ? (
              <p className="browse-empty">No listings match this view.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Listing</th>
                    <th>Vendor</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((row) => (
                    <tr key={row.product_id}>
                      <td>
                        <strong>{row.product_name}</strong>
                      </td>
                      <td>{row.vendor_public?.business_name ?? "—"}</td>
                      <td>{row.categories?.category_name ?? "—"}</td>
                      <td>R{Number(row.price).toFixed(2)}</td>
                      <td>{row.quantity}</td>
                      <td>
                        <span className={badgeClass(row.status)}>
                          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        {row.status === "removed" ? (
                          <button
                            type="button"
                            className="btn-small"
                            onClick={() => setStatus(row, "active")}
                          >
                            Restore
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn-small btn-danger"
                            onClick={() => setStatus(row, "removed")}
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}