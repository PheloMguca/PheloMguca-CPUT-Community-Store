import { useEffect, useState } from "react";
import AdminNav from "../../components/AdminNav";
import { supabase } from "../../supabaseClient";
import "./Admin.css";

export default function ManageUsers() {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, full_name, email, campus, status, roles(role_name)")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading users:", error.message);
      } else {
        setRows(data ?? []);
      }
      setLoading(false);
    }
    loadUsers();
  }, []);

  const roleOf = (user) => user.roles?.role_name ?? "";

  const filtered = rows.filter((user) => {
    const haystack =
      `${user.full_name} ${user.email} ${roleOf(user)} ${user.campus ?? ""}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  const toggleStatus = async (user) => {
    const newStatus = user.status === "active" ? "suspended" : "active";

    const { error } = await supabase.rpc("admin_set_user_status", {
      p_user_id: user.user_id,
      p_status: newStatus,
    });

    if (error) {
      console.error("Status update failed:", error.message);
      alert("Could not update user: " + error.message);
      return;
    }

    setRows((current) =>
      current.map((u) =>
        u.user_id === user.user_id ? { ...u, status: newStatus } : u
      )
    );
  };

  return (
    <div className="admin-layout">
      <AdminNav />

      <main className="admin-content">
        <div className="admin-topbar">
          <div>
            <h1>Manage Users</h1>
            <p>Search, review roles, and suspend campus accounts.</p>
          </div>

          <div className="admin-profile">
            <div className="admin-avatar">A</div>
            <div>
              <strong>Admin</strong>
              <span>Administrator</span>
            </div>
          </div>
        </div>

        <section className="admin-panel">
          <div className="panel-header">
            <div>
              <h2>Campus Accounts</h2>
              <p>
                {filtered.length} user{filtered.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          <input
            className="admin-search"
            type="search"
            placeholder="Search by name, email, role, or campus..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="admin-table-wrap">
            {loading ? (
              <p className="browse-empty">Loading users...</p>
            ) : filtered.length === 0 ? (
              <p className="browse-empty">No users match your search.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Campus</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user) => (
                    <tr key={user.user_id}>
                      <td>
                        <strong>{user.full_name}</strong>
                      </td>
                      <td>{user.email}</td>
                      <td>{roleOf(user)}</td>
                      <td>{user.campus || "—"}</td>
                      <td>
                        <span
                          className={
                            user.status === "active" ? "badge badge-ok" : "badge badge-warn"
                          }
                        >
                          {user.status === "active" ? "Active" : "Suspended"}
                        </span>
                      </td>
                      <td>
                        {roleOf(user).toLowerCase() === "admin" ? (
                          "—"
                        ) : (
                          <button
                            type="button"
                            className="btn-small"
                            onClick={() => toggleStatus(user)}
                          >
                            {user.status === "active" ? "Suspend" : "Restore"}
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