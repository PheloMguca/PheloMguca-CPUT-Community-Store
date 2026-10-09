import { useState } from "react";
import AdminNav from "../../components/AdminNav";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../context/AuthContext";
import "./Admin.css";

export default function AdminSettings() {
  const { user, profile } = useAuth();

  const [name, setName] = useState(profile?.full_name ?? "");
  const [nameMsg, setNameMsg] = useState("");
  const [savingName, setSavingName] = useState(false);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [savingPass, setSavingPass] = useState(false);

  const handleNameSave = async (e) => {
    e.preventDefault();
    setNameMsg("");
    setSavingName(true);

    const { error } = await supabase.rpc("update_my_full_name", { p_name: name });

    setSavingName(false);
    setNameMsg(error ? "Could not save: " + error.message : "Name updated.");
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPassMsg("");

    if (password.length < 8) {
      setPassMsg("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setPassMsg("Passwords do not match.");
      return;
    }

    setSavingPass(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSavingPass(false);

    if (error) {
      setPassMsg("Could not change password: " + error.message);
    } else {
      setPassMsg("Password changed.");
      setPassword("");
      setConfirm("");
    }
  };

  return (
    <div className="admin-layout">
      <AdminNav />

      <main className="admin-content">
        <div className="admin-topbar">
          <div>
            <h1>Settings</h1>
            <p>Manage your administrator account.</p>
          </div>

          <div className="admin-profile">
            <div className="admin-avatar">{profile?.full_name?.[0] ?? "A"}</div>
            <div>
              <strong>{profile?.full_name ?? "Admin"}</strong>
              <span>Administrator</span>
            </div>
          </div>
        </div>

        <section className="admin-panel">
          <div className="panel-header">
            <div>
              <h2>Account Details</h2>
              <p>Your email is your sign-in and can't be changed here.</p>
            </div>
          </div>

          <form className="settings-form" onSubmit={handleNameSave}>
            <label>
              Email
              <input type="email" value={user?.email ?? ""} disabled />
            </label>

            <label>
              Full name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

            {nameMsg && <p className="settings-msg">{nameMsg}</p>}

            <button type="submit" className="btn btn-pill btn-dark" disabled={savingName}>
              {savingName ? "Saving..." : "Save name"}
            </button>
          </form>
        </section>

        <section className="admin-panel">
          <div className="panel-header">
            <div>
              <h2>Change Password</h2>
              <p>Use at least 8 characters.</p>
            </div>
          </div>

          <form className="settings-form" onSubmit={handlePasswordSave}>
            <label>
              New password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <label>
              Confirm new password
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </label>

            {passMsg && <p className="settings-msg">{passMsg}</p>}

            <button type="submit" className="btn btn-pill btn-dark" disabled={savingPass}>
              {savingPass ? "Updating..." : "Change password"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}