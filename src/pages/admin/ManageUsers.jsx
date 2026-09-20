import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AdminNav from "../../components/AdminNav";
import { users as seedUsers } from "../../data/users";
import "./Admin.css";

export default function ManageUsers() {
  const [rows, setRows] = useState(seedUsers);
  const [query, setQuery] = useState("");

  const filtered = rows.filter((user) => {
    const haystack = `${user.name} ${user.email} ${user.role} ${user.campus}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  const toggleStatus = (id) => {
    setRows((current) =>
      current.map((user) =>
        user.id === id
          ? { ...user, status: user.status === "Active" ? "Suspended" : "Active" }
          : user
      )
    );
  };

  return (
    <div className="page">
      <Header />
      <main className="member-main">
        <h1>Manage Users</h1>
        <p className="browse-subtitle">Search, review roles, and suspend campus accounts.</p>
        <AdminNav />

        <input
          className="admin-search"
          type="search"
          placeholder="Search by name, email, role, or campus..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="admin-table-wrap">
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
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.campus}</td>
                  <td>
                    <span className={user.status === "Active" ? "badge badge-ok" : "badge badge-warn"}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    {user.role === "Admin" ? (
                      "—"
                    ) : (
                      <button type="button" className="btn-small" onClick={() => toggleStatus(user.id)}>
                        {user.status === "Active" ? "Suspend" : "Restore"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
}
