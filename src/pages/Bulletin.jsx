import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Bulletin.css";

const categories = [
  { value: "All", label: "All" },
  { value: "announcements", label: "Announcements" },
  { value: "events", label: "Events" },
  { value: "services", label: "Services" },
  { value: "lost_and_found", label: "Lost & Found" },
];

const labelFor = (value) =>
  categories.find((c) => c.value === value)?.label ?? value;

export default function Bulletin() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchBulletinPosts();
  }, []);

  async function fetchBulletinPosts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("bulletin_posts")
        .select("*, profiles(full_name)")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error("Error fetching bulletin posts:", err.message);
    } finally {
      setLoading(false);
    }
  }

  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  return (
    <div className="page">
      <Header />

      <main className="bulletin-main">
        <div className="bulletin-header">
          <div>
            <h1>Campus Bulletin Board</h1>
            <p className="bulletin-subtitle">
              Stay updated with campus news, announcements, services, and events.
            </p>
          </div>
          <Link to="/bulletin/create" className="btn-create-post">
            + Create Post
          </Link>
        </div>

        <div className="bulletin-categories">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              className={
                selectedCategory === cat.value ? "category-chip active" : "category-chip"
              }
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="bulletin-loading">Loading bulletin posts...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="bulletin-empty">
            <p>No posts found in this category.</p>
            <Link to="/bulletin/create" className="link-action">
              Be the first to post!
            </Link>
          </div>
        ) : (
          <div className="bulletin-grid">
            {filteredPosts.map((post) => (
              <div key={post.post_id} className="bulletin-card">
                <div className="bulletin-card-header">
                  <span className="bulletin-tag">{labelFor(post.category)}</span>
                  <span className="bulletin-date">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="bulletin-title">{post.title}</h3>
                <p className="bulletin-content">{post.content}</p>

                <div className="bulletin-card-footer">
                  <span className="bulletin-author">
                    Posted by {post.profiles?.full_name || "Campus Member"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}