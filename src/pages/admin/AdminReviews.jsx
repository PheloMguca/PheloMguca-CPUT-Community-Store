import { useEffect, useState } from "react";
import AdminNav from "../../components/AdminNav";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../context/AuthContext";
import "./Admin.css";

const filters = [
  { value: "all", label: "All" },
  { value: "low", label: "Low (1–2★)" },
  { value: "mid", label: "Mid (3★)" },
  { value: "high", label: "High (4–5★)" },
];

export default function AdminReviews() {
  const { profile } = useAuth();
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select(
        "reviews_id, ratings, comment, created_at, products(product_name), profiles(full_name)"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading reviews:", error.message);
    } else {
      setRows(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const matchesFilter = (r) => {
    if (filter === "low") return r.ratings <= 2;
    if (filter === "mid") return r.ratings === 3;
    if (filter === "high") return r.ratings >= 4;
    return true;
  };

  const visible = rows.filter((r) => {
    const haystack = `${r.products?.product_name ?? ""} ${r.profiles?.full_name ?? ""} ${
      r.comment ?? ""
    }`.toLowerCase();
    return matchesFilter(r) && haystack.includes(query.toLowerCase());
  });

  const average =
    rows.length === 0
      ? "0.0"
      : (rows.reduce((sum, r) => sum + r.ratings, 0) / rows.length).toFixed(1);

  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review permanently?")) return;

    const { error } = await supabase.rpc("admin_delete_review", {
      p_review_id: id,
    });

    if (error) {
      console.error("Delete failed:", error.message);
      alert("Could not delete review: " + error.message);
      return;
    }

    setRows((current) => current.filter((r) => r.reviews_id !== id));
  };

  return (
    <div className="admin-layout">
      <AdminNav />

      <main className="admin-content">
        <div className="admin-topbar">
          <div>
            <h1>Reviews</h1>
            <p>Read what students are saying and remove reviews that break the rules.</p>
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
          <div className="panel-header">
            <div>
              <h2>All Reviews</h2>
              <p>
                {rows.length} review{rows.length !== 1 ? "s" : ""} · average rating {average}
              </p>
            </div>
          </div>

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
            placeholder="Search by listing, reviewer, or comment..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="admin-table-wrap">
            {loading ? (
              <p className="browse-empty">Loading reviews...</p>
            ) : visible.length === 0 ? (
              <p className="browse-empty">No reviews match this view.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Listing</th>
                    <th>Reviewer</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((r) => (
                    <tr key={r.reviews_id}>
                      <td>
                        <strong>{r.products?.product_name ?? "Listing removed"}</strong>
                      </td>
                      <td>{r.profiles?.full_name ?? "Unknown"}</td>
                      <td>
                        <span className="review-stars">
                          {"★".repeat(r.ratings)}
                          {"☆".repeat(5 - r.ratings)}
                        </span>
                      </td>
                      <td>{r.comment || "—"}</td>
                      <td>{new Date(r.created_at).toLocaleDateString()}</td>
                      <td>
                        <button
                          type="button"
                          className="btn-small btn-danger"
                          onClick={() => deleteReview(r.reviews_id)}
                        >
                          Delete
                        </button>
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