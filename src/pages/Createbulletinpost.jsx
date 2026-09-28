import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./CreateBulletinPost.css";

const postCategories = [
  "Announcements",
  "Lost & Found",
  "Study Groups",
  "Roommates",
  "Events",
  "General",
];

export default function CreateBulletinPost() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    category: postCategories[0],
    title: "",
    excerpt: "",
  });
  const [error, setError] = useState("");

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.excerpt.trim()) {
      setError("Please fill in both a title and a description.");
      return;
    }

    // TODO: replace with a real POST request once the backend is wired up.
    console.log("New bulletin post:", form);

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
          Share a lost item, study group, room listing, or campus update with the community.
        </p>

        <form className="create-post-form" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Category</span>
            <select value={form.category} onChange={handleChange("category")}>
              {postCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
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
            <button type="submit" className="btn btn-pill btn-dark">
              Post to Bulletin
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
