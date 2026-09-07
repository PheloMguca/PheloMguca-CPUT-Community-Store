import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import "./App.css";

// Placeholder for pages you haven't built yet — swap these out
// for Browse, Bulletin, Vendor as you build them.
function Placeholder({ label }) {
  return <div style={{ padding: 60, fontFamily: "sans-serif" }}>{label} page coming soon.</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Placeholder label="Browse" />} />
        <Route path="/bulletin" element={<Placeholder label="Community Bulletin" />} />
        <Route path="/vendor" element={<Placeholder label="Vendor Dashboard" />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
}
