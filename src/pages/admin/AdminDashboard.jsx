import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AdminNav from "../../components/AdminNav";
import { users } from "../../data/users";
import { flaggedListings } from "../../data/flaggedListings";
import { reviews } from "../../data/reviews";
import { listings } from "../../data/listings";
import "../vendor/VendorDashboard.css";
import "./Admin.css";

export default function AdminDashboard() {
  const openFlags = flaggedListings.filter((item) => item.status === "Open").length;
  const suspended = users.filter((user) => user.status === "Suspended").length;

  const stats = [
    { label: "Registered users", value: users.length },
    { label: "Active listings", value: listings.length },
    { label: "Open flags", value: openFlags },
    { label: "Reviews", value: reviews.length },
  ];

  const queues = [
    { title: "Manage users", detail: `${suspended} suspended account${suspended === 1 ? "" : "s"}`, to: "/admin/users" },
    { title: "Flagged listings", detail: `${openFlags} waiting for review`, to: "/admin/flagged" },
  ];

  return (
    <div className="page">
      <Header />
      <main className="member-main">
        <h1>Admin Dashboard</h1>
        <p className="browse-subtitle">Trust and safety overview for the campus marketplace.</p>
        <AdminNav />

        <section className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <p className="stat-value">{stat.value}</p>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </section>

        <h2 className="admin-heading">Moderation queues</h2>
        <div className="admin-queue-grid">
          {queues.map((queue) => (
            <Link key={queue.to} to={queue.to} className="admin-queue-card">
              <h3>{queue.title}</h3>
              <p>{queue.detail}</p>
              <span>Open →</span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
