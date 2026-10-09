import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { supabase } from "../supabaseClient";
import "./BrowseListings.css";

export default function BrowseListings() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  async function fetchCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("category_id, category_name")
      .order("category_name");

    if (error) {
      console.error("Error fetching categories:", error.message);
    } else {
      setCategories(data || []);
    }
  }

  async function fetchProducts() {
  try {
    setLoading(true);

    // Filter out removed products so only active listings display on the storefront
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories ( category_name ),
        vendors ( business_name ),
        listing_images ( image_id, image_url, is_primary )
      `)
      .eq("status", "active") // <--- ADD THIS LINE
      .order("created_at", { ascending: false });

    if (error) throw error;
    setProducts(data || []);
  } catch (err) {
    console.error("Error fetching products:", err.message);
  } finally {
    setLoading(false);
  }
}

  // Filter products by search and category selection
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" ||
      String(product.category_id) === String(selectedCategory);

    const matchesSearch =
      product.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="page">
      <Header />
      <main className="browse-main">
        <div className="browse-header">
          <h1>Browse Listings</h1>
          <p className="browse-subtitle">
            Discover textbook deals, electronics, and essentials from fellow CPUT students.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="browse-controls">
          <input
            type="text"
            className="browse-search"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="category-pills">
            <button
              type="button"
              className={`category-pill ${selectedCategory === "all" ? "active" : ""}`}
              onClick={() => setSelectedCategory("all")}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.category_id}
                type="button"
                className={`category-pill ${
                  String(selectedCategory) === String(cat.category_id) ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(cat.category_id)}
              >
                {cat.category_name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <p className="browse-empty">Loading listings...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="browse-empty">No products found matching your criteria.</p>
        ) : (
          <div className="browse-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.product_id}
                product_id={product.product_id}
                product_name={product.product_name}
                price={product.price}
                vendor={product.vendors?.business_name}
                category={product.categories?.category_name}
                listing_images={product.listing_images}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}