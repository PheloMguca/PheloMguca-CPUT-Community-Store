import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BulletinCard from "../components/BulletinCard";
import "./Bulletin.css";

const filterCategories = [
  "All",
  "Announcements",
  "Lost & Found",
  "Study Groups",
  "Roommates",
  "Events",
  "General",
];

// Swap this for real posts once the backend is wired up.
const bulletinPosts = [
  {
    id: 1,
    category: "Lost & Found",
    title: "Found: Black backpack near the library",
    author: "Naledi M.",
    date: "2 hours ago",
    excerpt:
      "Picked up a black Jansport backpack outside the main library entrance yesterday evening. Has a laptop and some notes inside. DM to claim.",
    replies: 3,
  },
  {
    id: 2,
    category: "Study Groups",
    title: "Forming a study group for COS 216 (Data Structures)",
    author: "Thabo K.",
    date: "5 hours ago",
    excerpt:
      "Looking for 3-4 people to meet twice a week ahead of the November exams. Library or online, whichever works for everyone.",
    replies: 8,
  },
  {
    id: 3,
    category: "Roommates",
    title: "Room available in 3-bed off-campus house, Hatfield",
    author: "Aisha P.",
    date: "1 day ago",
    excerpt:
      "One of our housemates is moving out end of the month. Furnished room, fibre wifi, 10 min walk to campus. R3200/month.",
    replies: 5,
  },
  {
    id: 4,
    category: "Events",
    title: "Campus Market Day this Saturday — vendors welcome",
    author: "Student Council",
    date: "1 day ago",
    excerpt:
      "Sign up your stall for Saturday's market day on the quad. Free tables for verified student vendors, first come first served.",
    replies: 12,
  },
  {
    id: 5,
    category: "Announcements",
    title: "Library extended hours during exam season",
    author: "Campus Admin",
    date: "2 days ago",
    excerpt:
      "The main library will be open until 1am from next week through the end of exams. Bring your student card.",
    replies: 1,
  },
  {
    id: 6,
    category: "General",
    title: "Anyone selling a mini fridge for res?",
    author: "Kabelo S.",
    date: "3 days ago",
    excerpt: "Moving into res next semester and need a small fridge. Willing to collect on campus.",
    replies: 4,
  },
];

export default function CommunityBulletin() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");

  const filteredPosts = useMemo(() => {
    return bulletinPosts.filter((post) => {
      const matchesCategory = activeCategory === "All" || post.category === activeCategory;
      const matchesQuery =
        query.trim() === "" ||
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  return (
    <div className="page">
      <Header />

      <main className="bulletin-page">
        <div className="bulletin-header">
          <div>
            <h1>Community Bulletin</h1>
            <p>Lost &amp; found, study groups, roommates and campus news — from students, for students.</p>
          </div>

          <Link to="/bulletin/new" className="btn btn-pill btn-dark">
            + New Post
          </Link>
        </div>

        <div className="bulletin-controls">
          <input
            type="text"
            placeholder="Search posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bulletin-search"
          />

          <div className="bulletin-filters">
            {filterCategories.map((category) => (
              <button
                key={category}
                type="button"
                className={`category-pill${activeCategory === category ? " active" : ""}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredPosts.length > 0 ? (
          <div className="bulletin-grid">
            {filteredPosts.map((post) => (
              <BulletinCard key={post.id} {...post} />
            ))}
          </div>
        ) : (
          <p className="bulletin-empty">No posts match your search yet.</p>
        )}
      </main>

      <Footer />
    </div>
  );
}
