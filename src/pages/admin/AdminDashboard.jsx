import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminNav from "../../components/AdminNav";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../context/AuthContext";
import "./Admin.css";

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({ users: 0, listings: 0, flags: 0, reviews: 0 });
  const [openFlags, setOpenFlags] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const [users, listings, flags, reviews, flagList, newestProduct, newestUser] =
        await Promise.all([
          supabase.from("profiles").select("*", { count: "exact", head: true }),
          supabase
            .from("products")
            .select("*", { count: "exact", head: true })
            .eq("status", "active"),
          supabase
            .from("listing_flags")
            .select("*", { count: "exact", head: true })
            .eq("status", "open"),
          supabase.from("reviews").select("*", { count: "exact", head: true }),
          supabase
            .from("listing_flags")
            .select("flag_id, reason, created_at, products(product_name), profiles(full_name)")
            .eq("status", "open")
            .order("created_at", { ascending: false })
            .limit(5),
          supabase
            .from("products")
            .select("product_name, created_at")
            .order("created_at", { ascending: false })
            .limit(1),
          supabase
            .from("profiles")
            .select("full_name, created_at")
            .order("created_at", { ascending: false })
            .limit(1),
        ]);

      setStats({
        users: users.count ?? 0,
        listings: listings.count ?? 0,
        flags: flags.count ?? 0,
        reviews: reviews.count ?? 0,
      });

      const flagRows = flagList.data ?? [];
      setOpenFlags(flagRows);

      const events = [];
      if (newestProduct.data?.[0]) {
        events.push({
          type: "success",
          icon: "+",
          text: `New listing: ${newestProduct.data[0].product_name}`,
          date: newestProduct.data[0].created_at,
        });
      }
      if (newestUser.data?.[0]) {
        events.push({
          type: "info",
          icon: "👤",
          text: `New user: ${newestUser.data[0].full_name}`,
          date: newestUser.data[0].created_at,
        });
      }
      if (flagRows[0]) {
        events.push({
          type: "warning",
          icon: "⚑",
          text: `Listing reported: ${flagRows[0].products?.product_name ?? "Listing"}`,
          date: flagRows[0].created_at,
        });
      }
      events.sort((a, b) => new Date(b.date) - new Date(a.date));
      setActivity(events);

      setLoading(false);
    }

    loadDashboard();
  }, []);

  const statCards = [
    { label: "Registered Users", value: stats.users, type: "users", icon: "👥" },
    { label: "Active Listings", value: stats.listings, type: "listings", icon: "📦" },
    {
      label: "Open Flags",
      value: stats.flags,
      type: "flags",
      icon: "⚑",
      badge: stats.flags > 0 ? "Needs attention" : "All clear",
      badgeClass: stats.flags > 0 ? "stat-warning" : "stat-positive",
    },
    { label: "Reviews", value: stats.reviews, type: "reviews", icon: "★" },
  ];

  return (
    <div className="admin-layout">
      <AdminNav />

      <main className="admin-content">
        <div className="admin-topbar">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Here's an overview of what's happening on the CPUT Community Store.</p>
          </div>

          <div className="admin-profile">
            <div className="admin-avatar">{profile?.full_name?.[0] ?? "A"}</div>
            <div>
              <strong>{profile?.full_name ?? "Admin"}</strong>
              <span>Administrator</span>
            </div>
          </div>
        </div>

        <section className="admin-stats">
          {statCards.map((stat) => (
            <div key={stat.label} className={`admin-stat-card ${stat.type}`}>
              <div className="stat-icon">{stat.icon}</div>
              <p className="stat-value">{loading ? "..." : stat.value}</p>
              <p className="stat-label">{stat.label}</p>
              {stat.badge && !loading && (
                <span className={stat.badgeClass}>{stat.badge}</span>
              )}
            </div>
          ))}
        </section>

        <section className="admin-dashboard-grid">
          <div className="admin-panel">
            <div className="panel-header">
              <div>
                <h2>⚠ Needs Attention</h2>
                <p>
                  {stats.flags} listing{stats.flags !== 1 ? "s" : ""} waiting for review
                </p>
              </div>
              <Link to="/admin/flagged">View all →</Link>
            </div>

            <div className="attention-list">
              {loading ? (
                <p className="browse-empty">Loading flagged items...</p>
              ) : openFlags.length === 0 ? (
                <p className="browse-empty">No open flags. Nice work.</p>
              ) : (
                openFlags.slice(0, 3).map((flag) => (
                  <div className="attention-item" key={flag.flag_id}>
                    <div className="attention-info">
                      <strong>{flag.products?.product_name ?? "Listing"}</strong>
                      <span>Reported by {flag.profiles?.full_name ?? "Unknown"}</span>
                      <small>{flag.reason}</small>
                    </div>
                    <Link to="/admin/flagged" className="review-button">
                      Review →
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="admin-panel">
            <div className="panel-header">
              <div>
                <h2>◷ Recent Activity</h2>
              </div>
              <Link to="/admin/users">View users →</Link>
            </div>

            <div className="activity-list">
              {loading ? (
                <p className="browse-empty">Loading activity...</p>
              ) : activity.length === 0 ? (
                <p className="browse-empty">No activity yet.</p>
              ) : (
                activity.map((item) => (
                  <div className="activity-item" key={item.text}>
                    <span className={`activity-icon ${item.type}`}>{item.icon}</span>
                    <div>
                      <strong>{item.text}</strong>
                      <small>{new Date(item.date).toLocaleDateString()}</small>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
