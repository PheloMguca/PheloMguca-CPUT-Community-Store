import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import "./ListingForm.css";

export default function AddListing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category_id: "",
    price: "",
    stock: "",
    description: "",
    condition: "used",
  });

  useEffect(() => {
    async function loadCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("category_id, category_name")
        .order("category_name");

      if (error) {
        console.error("Error loading categories:", error.message);
      } else {
        setCategories(data);
        setForm((f) => ({ ...f, category_id: data[0]?.category_id ?? "" }));
      }
    }
    loadCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
  alert("You need to be logged in to publish a listing.");
  return;
}

    const { data: vendor, error: vendorError } = await supabase
      .from("vendors")
      .select("vendor_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (vendorError || !vendor) {
      alert("Could not find your vendor account.");
      return;
    }

    const { error } = await supabase.from("products").insert({
      vendor_id: vendor.vendor_id,
      category_id: Number(form.category_id),
      product_name: form.name,
      description: form.description,
      price: Number(form.price),
      quantity: Number(form.stock),
      condition: form.condition,
    });

    if (error) {
      console.error("Insert failed:", error.message);
      alert("Could not publish listing: " + error.message);
    } else {
      navigate("/vendor/my-listings");
    }
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
            <select name="category_id" value={form.category_id} onChange={handleChange}>
              {categories.map((c) => (
                <option key={c.category_id} value={c.category_id}>
                  {c.category_name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Condition
            <select name="condition" value={form.condition} onChange={handleChange}>
              <option value="new">New</option>
              <option value="like_new">Like new</option>
              <option value="used">Used</option>
            </select>
          </label>

          <label>
            Price (R)
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Stock quantity
            <input
              name="stock"
              type="number"
              min="1"
              value={form.stock}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Description
            <textarea name="description" rows="4" value={form.description} onChange={handleChange} />
          </label>

          <div className="form-actions">
            <button type="button" className="btn-small" onClick={() => navigate("/vendor/my-listings")}>
              Cancel
            </button>
            <button type="submit" className="btn btn-pill btn-dark">
              Publish Listing
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}