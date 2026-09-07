import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

import "./Auth.css";

export default function Auth() {
  const [mode, setMode] = useState("signin"); // "signin" | "create"
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Wire this up to your auth API/backend once it's ready.
    console.log(mode === "signin" ? "Signing in with" : "Creating account with", form);
  };

  return (
    <div className="page">
      <Header />

      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-tabs">
            <button
              type="button"
              className={mode === "signin" ? "auth-tab active" : "auth-tab"}
              onClick={() => setMode("signin")}
            >
              Sign In
            </button>
            <button
              type="button"
              className={mode === "create" ? "auth-tab active" : "auth-tab"}
              onClick={() => setMode("create")}
            >
              Create Account
            </button>
          </div>

          {mode === "signin" ? (
            <>
              <h1 className="auth-heading">Welcome Back</h1>
              <form onSubmit={handleSubmit} className="auth-form">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />

                <button type="submit" className="auth-submit">
                  Sign in
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="auth-heading">Hello, Join The Community.</h1>
              <form onSubmit={handleSubmit} className="auth-form">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="create-email">Email</label>
                <input
                  id="create-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="create-password">Password</label>
                <input
                  id="create-password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />

                <button type="submit" className="auth-submit">
                  Create account
                </button>
              </form>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
