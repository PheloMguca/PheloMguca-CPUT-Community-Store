import Header from "../components/Header";
import Footer from "../components/Footer";
import { listings } from "../data/listings";
import { reviews as seedReviews } from "../data/reviews";
import { useState } from "react";
import "./Reviews.css";

export default function Reviews() {
  const [items, setItems] = useState(seedReviews);
  const [form, setForm] = useState({ listingId: String(listings[0].id), rating: "5", comment: "" });

  const average =
    items.length === 0
      ? "0.0"
      : (items.reduce((sum, review) => sum + review.rating, 0) / items.length).toFixed(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    const listing = listings.find((item) => String(item.id) === form.listingId);
    setItems([
      {
        id: Date.now(),
        listingId: Number(form.listingId),
        listingName: listing?.name ?? "Listing",
        reviewer: "You",
        campus: "District Six",
        rating: Number(form.rating),
        comment: form.comment.trim() || "No comment.",
        date: "Just now",
      },
      ...items,
    ]);
    setForm({ ...form, comment: "" });
  };

  return (
    <div className="page">
      <Header />
      <main className="member-main">
        <h1>Reviews &amp; Ratings</h1>
        <p className="browse-subtitle">
          Campus feedback for listings. Average rating <strong>{average}</strong> from {items.length} reviews.
        </p>

        <form className="review-form" onSubmit={handleSubmit}>
          <label>
            Listing
            <select
              value={form.listingId}
              onChange={(e) => setForm({ ...form, listingId: e.target.value })}
            >
              {listings.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
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
          <button type="submit" className="btn btn-pill btn-dark">
            Submit review
          </button>
        </form>

        <ul className="review-list">
          {items.map((review) => (
            <li key={review.id} className="review-card">
              <div className="review-card-top">
                <div>
                  <p className="review-item">{review.listingName}</p>
                  <p className="review-meta">
                    {review.reviewer} · {review.campus} · {review.date}
                  </p>
                </div>
                <span className="review-stars">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
              </div>
              <p className="review-comment-text">{review.comment}</p>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}
