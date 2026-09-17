import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import { listings } from "../../data/listings";
import "./VendorDashboard.css";

const myVendorName = "Phelo M.";

export default function VendorDashboard() {
  const mine = listings.filter((item) => item.vendor === myVendorName);

  const stats = [
    { label: "Active Listings", value: mine.length },
    { label: "Items Sold", value: 12 },
    { label: "Revenue", value: "R4,850" },
    { label: "Avg Rating", value: "4.7" },
  ];

  return (
    <div className="page">
      <Header />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>Vendor Dashboard</h1>
            <p className="browse-subtitle">Welcome back, {myVendorName}</p>
          </div>
          <Link to="/vendor/add-listing" className="btn btn-pill btn-dark">
            + Add New Listing
          </Link>
        </div>

        <section className="stats-grid">
          {stats.map((s) => (
            <div key={s.label} className="stat-card">
              <p className="stat-value">{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          ))}
        </section>

        <div className="dashboard-section-header">
          <h2>Recent Listings</h2>
          <Link to="/vendor/my-listings" className="view-all-link">View all</Link>
        </div>

        <div className="dashboard-grid">
          {mine.slice(0, 4).map((item) => (
            <ProductCard key={item.id} {...item} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
