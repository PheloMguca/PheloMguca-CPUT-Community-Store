import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { listings, categories } from "../data/listings";
import "./ListingForm.css";

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const original = listings.find((l) => String(l.id) === String(id)) || listings[0];

  const [form, setForm] = useState({
    name: original.name,
    category: original.category,
    price: original.price,
    stock: original.stock,
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Listing updated (mock):\n" + JSON.stringify(form, null, 2));
    navigate("/vendor/my-listings");
  };

  return (
    <div className="page">
      <Header />
      <main className="form-main">
        <h1>Edit Listing</h1>
        <p className="browse-subtitle">Editing item #{id}</p>

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
            <input name="price" value={form.price} onChange={handleChange} required />
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
            <button type="submit" className="btn btn-pill btn-dark">Save Changes</button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
