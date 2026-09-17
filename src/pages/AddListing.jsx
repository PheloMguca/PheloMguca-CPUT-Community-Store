import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { categories } from "../data/listings";
import "./ListingForm.css";

export default function AddListing() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    category: categories[1],
    price: "",
    stock: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Listing added (mock):\n" + JSON.stringify(form, null, 2));
    navigate("/vendor/my-listings");
  };

  return (
    <div className="page">
      <Header />
      <main className="form-main">
        <h1>Add New Listing</h1>
        <p className="browse-subtitle">Fill in the details below to publish a new item.</p>

        <form className="listing-form" onSubmit={handleSubmit}>
          <label>
            Item name
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>

          <label>
            Category
            <select name="category" value={form.category} onChange={handleChange}>
              {categories.filter((c) => c !== "All").map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>

          <label>
            Price (R)
            <input name="price" value={form.price} onChange={handleChange} placeholder="e.g. R250" required />
          </label>

          <label>
            Stock quantity
            <input name="stock" type="number" value={form.stock} onChange={handleChange} min="1" required />
          </label>

          <label>
            Description
            <textarea name="description" rows="4" value={form.description} onChange={handleChange} />
          </label>

          <div className="form-actions">
            <button type="button" className="btn-small" onClick={() => navigate("/vendor/my-listings")}>Cancel</button>
            <button type="submit" className="btn btn-pill btn-dark">Publish Listing</button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
