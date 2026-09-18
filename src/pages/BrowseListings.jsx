import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { listings, categories } from "../data/listings";
import "./BrowseListings.css";

export default function BrowseListings() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category");
  const [activeCategory, setActiveCategory] = useState(
    categories.includes(initialCategory) ? initialCategory : "All"
  );
  const [search, setSearch] = useState("");

  const filtered = listings.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="page">
      <Header />
      <main className="browse-main">
        <h1>Browse Listings</h1>
        <p className="browse-subtitle">
          {filtered.length} item{filtered.length !== 1 ? "s" : ""} available on campus
        </p>

        <input
          className="browse-search"
          type="text"
          placeholder="Search listings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="browse-categories">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-pill ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="browse-grid">
          {filtered.length === 0 ? (
            <p className="browse-empty">No listings match your search.</p>
          ) : (
            filtered.map((item) => <ProductCard key={item.id} {...item} />)
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
