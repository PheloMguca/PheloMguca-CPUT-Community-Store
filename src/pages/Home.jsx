import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import "./Home.css";

const categories = ["Textbooks", "Electronics", "Stationery", "Food & Meals", "Apparel"];

const trustPoints = [
  { icon: "👥", label: "4 Campuses" },
  { icon: "🛡", label: "PayFast & SnapScan" },
  { icon: "♥", label: "Reviews & Ratings" },
];

// Swap this for real listings once the backend is wired up.
const featuredItems = [
  { category: "Textbooks", name: "Intro to Networking, 6th Ed", price: "R320", rating: "4.8" },
  { category: "Electronics", name: "TI-84 Plus Calculator", price: "R650", rating: "4.6" },
  { category: "Stationery", name: "A4 Refill Pad, 5 Pack", price: "R95", rating: "4.9" },
  { category: "Food & Meals", name: "Weekly Meal Prep Box", price: "R180", rating: "4.7" },
];

export default function Home() {
  return (
    <div className="page">
      <Header />

      <main className="home-hero">
        <div className="hero-copy">
          <h1>Buy, sell and connect on campus — safely.</h1>
          <p>
            Textbooks, electronics, dorm essentials and local services from people in your
            campus community. Verified accounts, secure payments, real reviews.
          </p>

          <div className="hero-actions">
            <Link to="/browse" className="btn btn-pill btn-dark">
              Browse Listings →
            </Link>
            <Link to="/vendor" className="btn btn-pill btn-outline">
              Sell as vendor
            </Link>
          </div>

          <div className="hero-trust">
            {trustPoints.map((point) => (
              <span key={point.label}>
                <span aria-hidden="true">{point.icon}</span> {point.label}
              </span>
            ))}
          </div>

          <div className="hero-categories">
            {categories.map((category) => (
              <button key={category} type="button" className="category-pill">
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="hero-gallery">
          <div className="hero-gallery-grid">
            {featuredItems.map((item) => (
              <ProductCard key={item.name} {...item} />
            ))}
          </div>
          <Link to="/browse" className="view-all">
            View All →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
