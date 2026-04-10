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
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import Navbar from "./components/Navbar";
import ProductsListAdmin from "./pages/admin/products/ProductsList";
import AddProductAdmin from "./pages/admin/products/AddProduct";
import CategoriesAdmin from "./pages/admin/products/Categories";
import EditProductAdmin from "./pages/admin/products/EditProduct";
import ProductDetailsAdmin from "./pages/admin/products/ProductDetails";
import StockHistory from "./pages/admin/stock/StockHistory";
import StockList from "./pages/admin/stock/StockList";
import UpdateStock from "./pages/admin/stock/UpdateStock";
import Footer from "./components/Footer";
import FAQ from "./pages/public/Faq";
import RouteTester from "./RouteTester";
import Cart from "./pages/client/Cart";

function App() {
  return (
    <BrowserRouter>
    <Navbar />
    <RouteTester />
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
        <Route path="/About" element={<About />} />
        <Route path="/ProductDetailsAdmin" element={<ProductDetailsAdmin />} />
        <Route path="/EditProductAdmin" element={<EditProductAdmin />} />
        <Route path="/CategoriesAdmin" element={<CategoriesAdmin />} />
        <Route path="/AddProductAdmin" element={<AddProductAdmin />} />
        <Route path="/ProductsListAdmin" element={<ProductsListAdmin />} />
        <Route path="/StockHistory" element={<StockHistory />} />
        <Route path="/StockList" element={<StockList />} />
        <Route path="/UpdateStock" element={<UpdateStock />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/FAQ" element={<FAQ />} />
        <Route path="/Cart" element={<Cart />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;