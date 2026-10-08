import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import "./Reviews.css";

export default function Reviews() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ productId: "", rating: "5", comment: "" });

  const loadReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("reviews_id, ratings, comment, created_at, product_id, products(product_name), profiles(full_name)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading reviews:", error.message);
    } else {
      setItems(data ?? []);
    }
  };

  useEffect(() => {
    async function loadData() {
      const { data: prods } = await supabase
        .from("products")
        .select("product_id, product_name")
        .eq("status", "active")
        .order("product_name");

      if (prods) {
        setProducts(prods);
        setForm((f) => ({ ...f, productId: prods[0]?.product_id ?? "" }));
      }

      await loadReviews();
      setLoading(false);
    }
    loadData();
  }, []);

  const average =
    items.length === 0
      ? "0.0"
      : (items.reduce((sum, r) => sum + r.ratings, 0) / items.length).toFixed(1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please sign in to leave a review.");
      return;
    }
    if (!form.productId) {
      alert("Please choose a listing.");
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("reviews").insert({
      user_id: user.id,
      product_id: Number(form.productId),
      ratings: Number(form.rating),
      comment: form.comment.trim() || null,
    });
    setSaving(false);

    if (error) {
      console.error("Review failed:", error.message);
      alert("Could not submit review: " + error.message);
      return;
    }

    setForm({ ...form, comment: "" });
    await loadReviews();
  };

  return (
    <div className="page">
      <Header />
      <main className="member-main">
        <h1>Reviews &amp; Ratings</h1>
        <p className="browse-subtitle">
          Campus feedback for listings. Average rating <strong>{average}</strong> from{" "}
          {items.length} review{items.length !== 1 ? "s" : ""}.
        </p>

        <form className="review-form" onSubmit={handleSubmit}>
          <label>
            Listing
            <select
              value={form.productId}
              onChange={(e) => setForm({ ...form, productId: e.target.value })}
            >
              {products.map((p) => (
                <option key={p.product_id} value={p.product_id}>
                  {p.product_name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Rating
            <select
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} star{value === 1 ? "" : "s"}
                </option>
              ))}
            </select>
          </label>
          <label className="review-comment">
            Comment
            <textarea
              rows="3"
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              placeholder="How was the item and pickup?"
            />
          </label>
          <button type="submit" className="btn btn-pill btn-dark" disabled={saving}>
            {saving ? "Submitting..." : "Submit review"}
          </button>
        </form>

        {loading ? (
          <p>Loading reviews...</p>
        ) : items.length === 0 ? (
          <p>No reviews yet. Be the first to leave one.</p>
        ) : (
          <ul className="review-list">
            {items.map((review) => (
              <li key={review.reviews_id} className="review-card">
                <div className="review-card-top">
                  <div>
                    <p className="review-item">
                      {review.products?.product_name ?? "Listing"}
                    </p>
                    <p className="review-meta">
                      {review.profiles?.full_name ?? "Student"} ·{" "}
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="review-stars">
                    {"★".repeat(review.ratings)}
                    {"☆".repeat(5 - review.ratings)}
                  </span>
                </div>
                {review.comment && (
                  <p className="review-comment-text">{review.comment}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
}