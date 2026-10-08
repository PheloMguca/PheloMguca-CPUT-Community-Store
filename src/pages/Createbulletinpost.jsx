import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import "./CreateBulletinPost.css";

const categoryOptions = [
  { value: "announcements", label: "Announcements" },
  { value: "events", label: "Events" },
  { value: "services", label: "Services" },
  { value: "lost_and_found", label: "Lost & Found" },
];

export default function CreateBulletinPost() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    category: categoryOptions[0].value,
    title: "",
    excerpt: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("Please sign in to post to the bulletin.");
      return;
    }

    if (!form.title.trim() || !form.excerpt.trim()) {
      setError("Please fill in both a title and a description.");
      return;
    }

    setError("");
    setSaving(true);

    const { error: insertError } = await supabase.from("bulletin_posts").insert({
      user_id: user.id,
      category: form.category,
      title: form.title.trim(),
      content: form.excerpt.trim(),
    });

    setSaving(false);

    if (insertError) {
      console.error("Post failed:", insertError.message);
      setError("Could not publish post: " + insertError.message);
      return;
    }

    navigate("/bulletin");
  };

  return (
    <div className="page">
      <Header />

      <main className="create-post-page">
        <Link to="/bulletin" className="back-link">
          ← Back to Bulletin
        </Link>

        <h1>New Bulletin Post</h1>
        <p className="create-post-subtitle">
          Share a lost item, service, event, or campus update with the community.
        </p>

        <form className="create-post-form" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Category</span>
            <select value={form.category} onChange={handleChange("category")}>
              {categoryOptions.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span>Title</span>
            <input
              type="text"
              placeholder="e.g. Found: Black backpack near the library"
              value={form.title}
              onChange={handleChange("title")}
            />
          </label>

          <label className="form-field">
            <span>Description</span>
            <textarea
              rows={6}
              placeholder="Add the details other students will need..."
              value={form.excerpt}
              onChange={handleChange("excerpt")}
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <div className="form-actions">
            <Link to="/bulletin" className="btn btn-pill btn-outline">
              Cancel
            </Link>
            <button type="submit" className="btn btn-pill btn-dark" disabled={saving}>
              {saving ? "Posting..." : "Post to Bulletin"}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}