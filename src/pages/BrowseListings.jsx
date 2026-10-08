import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { supabase } from "../supabaseClient";
import "./BrowseListings.css";

export default function BrowseListings() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [loading, setLoading] = useState(true);

  // Keep filters in sync when the URL changes (header/footer search, home category links)
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setActiveCategory(searchParams.get("category") || "All");
  }, [searchParams]);

  useEffect(() => {
    async function loadData() {
      const { data: cats } = await supabase
        .from("categories")
        .select("category_name")
        .order("category_name");

      if (cats) {
        setCategories(["All", ...cats.map((c) => c.category_name)]);
      }

      const { data, error } = await supabase
        .from("products")
        .select("*, categories(category_name), vendor_public(business_name)")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading products:", error.message);
      } else {
        setProducts(data ?? []);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const filtered = products.filter((item) => {
    const categoryName = item.categories?.category_name;
    const matchesCategory =
      activeCategory === "All" || categoryName === activeCategory;
    const matchesSearch = item.product_name
      .toLowerCase()
      .includes(search.toLowerCase());
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
          {loading ? (
            <p className="browse-empty">Loading listings...</p>
          ) : filtered.length === 0 ? (
            <p className="browse-empty">No listings match your search.</p>
          ) : (
            filtered.map((item) => (
              <ProductCard
                key={item.product_id}
                {...item}
                category={item.categories?.category_name}
              />
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}