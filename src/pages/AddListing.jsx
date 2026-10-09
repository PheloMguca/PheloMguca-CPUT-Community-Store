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
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
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
        setCategories(data || []);
        setForm((f) => ({ ...f, category_id: data?.[0]?.category_id ?? "" }));
      }
    }
    loadCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You need to be logged in to publish a listing.");
      return;
    }

    try {
      setUploading(true);

      // 1. Fetch Vendor Account
      const { data: vendor, error: vendorError } = await supabase
        .from("vendors")
        .select("vendor_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (vendorError || !vendor) {
        alert("Could not find your vendor account.");
        setUploading(false);
        return;
      }

      // 2. Insert Product into database & return created product_id
      const { data: newProduct, error: productError } = await supabase
        .from("products")
        .insert({
          vendor_id: vendor.vendor_id,
          category_id: Number(form.category_id),
          product_name: form.name,
          description: form.description,
          price: Number(form.price),
          quantity: Number(form.stock),
          condition: form.condition,
        })
        .select("product_id")
        .single();

      if (productError) {
        throw new Error("Could not publish listing: " + productError.message);
      }

      // 3. Upload File to Storage and save URL record in listing_images
      if (selectedFile && newProduct?.product_id) {
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `listings/${fileName}`;

        // Upload to Storage bucket 'listing-images'
        const { error: storageError } = await supabase.storage
          .from("listing-images")
          .upload(filePath, selectedFile);

        if (storageError) {
          throw new Error("Image upload failed: " + storageError.message);
        }

        // Get Public URL
        const { data: publicUrlData } = supabase.storage
          .from("listing-images")
          .getPublicUrl(filePath);

        // Insert record into listing_images table
        const { error: imageDbError } = await supabase
          .from("listing_images")
          .insert({
            product_id: newProduct.product_id,
            image_url: publicUrlData.publicUrl,
            is_primary: true,
          });

        if (imageDbError) {
          throw new Error("Could not save image record: " + imageDbError.message);
        }
      }

      navigate("/vendor/my-listings");
    } catch (err) {
      console.error("Submit error:", err);
      alert(err.message || "An unexpected error occurred.");
    } finally {
      setUploading(false);
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
            Listing Image
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>

          <label>
            Description
            <textarea name="description" rows="4" value={form.description} onChange={handleChange} />
          </label>

          <div className="form-actions">
            <button
              type="button"
              className="btn-small"
              onClick={() => navigate("/vendor/my-listings")}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-pill btn-dark" disabled={uploading}>
              {uploading ? "Publishing..." : "Publish Listing"}
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}