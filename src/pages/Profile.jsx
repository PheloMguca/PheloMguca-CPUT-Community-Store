import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Profile.css";

export default function Profile() {
  const [form, setForm] = useState({
    fullName: "Phelo Mguca",
    email: "phelo@mycput.ac.za",
    campus: "District Six",
    studentNumber: "123456789",
    phone: "082 000 0000",
    notifyOrders: true,
    notifyReviews: true,
    notifyBulletins: false,
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
  };

  return (
    <div className="page">
      <Header />
      <main className="member-main profile-main">
        <h1>Profile &amp; Settings</h1>
        <p className="browse-subtitle">Update your campus account details and notification preferences.</p>

        <form className="profile-form" onSubmit={handleSubmit}>
          <h2>Account</h2>
          <label>
            Full name
            <input name="fullName" value={form.fullName} onChange={handleChange} required />
          </label>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Student number
            <input name="studentNumber" value={form.studentNumber} onChange={handleChange} />
          </label>
          <label>
            Phone
            <input name="phone" value={form.phone} onChange={handleChange} />
          </label>
          <label>
            Campus
            <select name="campus" value={form.campus} onChange={handleChange}>
              <option>District Six</option>
              <option>Bellville</option>
              <option>Mowbray</option>
              <option>Wellington</option>
            </select>
          </label>

          <h2>Notifications</h2>
          <label className="profile-check">
            <input type="checkbox" name="notifyOrders" checked={form.notifyOrders} onChange={handleChange} />
            Order and payment updates
          </label>
          <label className="profile-check">
            <input type="checkbox" name="notifyReviews" checked={form.notifyReviews} onChange={handleChange} />
            New reviews on my listings
          </label>
          <label className="profile-check">
            <input type="checkbox" name="notifyBulletins" checked={form.notifyBulletins} onChange={handleChange} />
            Community bulletin posts
          </label>

          <div className="form-actions">
            <button type="submit" className="btn btn-pill btn-dark">
              Save changes
            </button>
            {saved ? <span className="profile-saved">Settings saved (mock).</span> : null}
          </div>
        </form>

        <p className="profile-admin-hint">
          Admin tools: <Link to="/admin">Dashboard</Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
