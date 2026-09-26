import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import Home from "./pages/Home"; 
import Auth from "./pages/Auth"; 
import BrowseListings from "./pages/BrowseListings"; 
import MyListings from "./pages/MyListings"; 
import AddListing from "./pages/AddListing"; 
import EditListing from "./pages/EditListing"; 
import VendorDashboard from "./pages/vendor/VendorDashboard"; 
import Reviews from "./pages/Reviews"; 
import Profile from "./pages/Profile"; 
import AdminDashboard from "./pages/admin/AdminDashboard"; 
import ManageUsers from "./pages/admin/ManageUsers"; 
import FlaggedListings from "./pages/admin/FlaggedListings"; 
import Checkout from "./pages/Orders/Checkout"; 
import Payment from "./pages/Orders/Payment"; 
import PaymentConfirmation from "./pages/Orders/PaymentConfirmation"; 
import ItemDetail from "./pages/Orders/Itemdetail"; 
import ShoppingCart from "./pages/Orders/ShoppingCart"; 
 
import "./App.css"; 
 
 
function Placeholder({ label }) { 
  return (
    <div style={{ padding: 60, fontFamily: "sans-serif" }}>
      {label} page coming soon.
    </div>
  ); 
} 
 
export default function App() { 
  return ( 
    <BrowserRouter> 
      <Routes> 
        <Route path="/" element={<Home />} /> 
        <Route path="/auth" element={<Auth />} /> 
 
        <Route path="/browse" element={<BrowseListings />} /> 
        <Route path="/vendor" element={<VendorDashboard />} /> 
        <Route path="/vendor/my-listings" element={<MyListings />} /> 
        <Route path="/vendor/add-listing" element={<AddListing />} /> 
        <Route path="/vendor/edit-listing/:id" element={<EditListing />} /> 
 
        <Route path="/reviews" element={<Reviews />} /> 
        <Route path="/profile" element={<Profile />} /> 
        <Route path="/admin" element={<AdminDashboard />} /> 
        <Route path="/admin/users" element={<ManageUsers />} /> 
        <Route path="/admin/flagged" element={<FlaggedListings />} /> 
 
        <Route
          path="/bulletin"
          element={<Placeholder label="Community Bulletin" />}
        /> 

        {/* Orders / Shopping */}
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/item/:id" element={<ItemDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route
          path="/payment-confirmation"
          element={<PaymentConfirmation />}
        />
      </Routes> 
    </BrowserRouter> 
  ); 
}