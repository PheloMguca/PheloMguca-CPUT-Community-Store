import { BrowserRouter, Routes, Route } from "react-router-dom";

// Standard Pages
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import BrowseListings from "./pages/BrowseListings";
import MyListings from "./pages/MyListings";
import AddListing from "./pages/AddListing";
import EditListing from "./pages/EditListing";
import Profile from "./pages/Profile";
import Reviews from "./pages/Reviews";

// Orders Pages
import ShoppingCart from "./pages/Orders/ShoppingCart";
import Checkout from "./pages/Orders/Checkout";
import ItemDetail from "./pages/Orders/ItemDetail";
import Payment from "./pages/Orders/Payment";
import PaymentConfirmation from "./pages/Orders/PaymentConfirmation";

// Bulletin Pages (Root of src/)
import Bulletin from "./pages/Bulletin";
import Createbulletinpost from "./pages/Createbulletinpost";

// Vendor & Admin Pages
import VendorDashboard from "./pages/vendor/VendorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import FlaggedListings from "./pages/admin/FlaggedListings";

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Core Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/browse" element={<BrowseListings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reviews" element={<Reviews />} />

        {/* Orders Routes */}
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/item/:id" element={<ItemDetail />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-confirmation" element={<PaymentConfirmation />} />

        {/* Bulletin Routes */}
        <Route path="/bulletin" element={<Bulletin />} />
        <Route path="/bulletin/create" element={<Createbulletinpost />} />

        {/* Vendor Routes */}
        <Route path="/vendor" element={<VendorDashboard />} />
        <Route path="/vendor/my-listings" element={<MyListings />} />
        <Route path="/vendor/add-listing" element={<AddListing />} />
        <Route path="/vendor/edit-listing/:id" element={<EditListing />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/flagged" element={<FlaggedListings />} />
      </Routes>
    </BrowserRouter>
  );
}