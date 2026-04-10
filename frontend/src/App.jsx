import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AuthForgotPassword from "./pages/auth/ForgotPassword";
import AuthResetPassword from "./pages/auth/ResetPassword";
import Dashboard from "./pages/admin/Dashboard";
import Home from "./pages/public/Home";
import Products from "./pages/public/Products";
import SpecialOrder from "./pages/public/special-order";
import ProductDetail from "./pages/public/ProductDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<AuthForgotPassword />} />
        <Route path="/reset-password" element={<AuthResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/ProductDetail" element={<ProductDetail />} />
        <Route path="/SpecialOrder" element={<SpecialOrder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;