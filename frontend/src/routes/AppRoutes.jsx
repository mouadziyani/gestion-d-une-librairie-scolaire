import {Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AuthForgotPassword from "../pages/auth/ForgotPassword";
import AuthResetPassword from "../pages/auth/ResetPassword";
import Dashboard from "../pages/admin/Dashboard";
import Home from "../pages/public/Home";
import Products from "../pages/public/Products";
import SpecialOrder from "../pages/public/special-order";
import ProductDetail from "../pages/public/ProductDetail";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";
import Navbar from "../components/Navbar";
import ProductsListAdmin from "../pages/admin/products/ProductsList";
import AddProductAdmin from "../pages/admin/products/AddProduct";
import CategoriesAdmin from "../pages/admin/products/Categories";
import EditProductAdmin from "../pages/admin/products/EditProduct";
import ProductDetailsAdmin from "../pages/admin/products/ProductDetails";
import StockHistory from "../pages/admin/stock/StockHistory";
import StockList from "../pages/admin/stock/StockList";
import UpdateStock from "../pages/admin/stock/UpdateStock";
import Footer from "../components/Footer";
import FAQ from "../pages/public/Faq";
import RouteTester from "../RouteTester";
import Cart from "../pages/client/Cart";
import NotFound from "../pages/errors/NotFound";
import ServerError from "../pages/errors/ServerError";
import Unauthorized from "../pages/errors/Unauthorized";
import GeneralSettings from "../pages/admin/settings/GeneralSettings";
import RolesPermissions from "../pages/admin/settings/RolesPermissions";
import SystemConfig from "../pages/admin/settings/SystemConfig";
import Notifications from "../pages/notifications/Notifications";
import Profile from "../pages/auth/Profile";
import Header from "../components/Header";
import InvoiceDetail from "../pages/client/invoices/InvoiceDetail";
import MyInvoices from "../pages/client/invoices/MyInvoices";
import Checkout from "../pages/client/Checkout";
import DashboardClient from "../pages/client/Dashboard";
import EditProfile from "../pages/client/EditProfile";
import Wishlist from "../pages/client/Wishlist";
import SchoolInvoiceDetail from "../pages/schools/InvoiceDetail";
import SchoolInvoices from "../pages/schools/SchoolInvoices";
import AdminInvoiceBySchool from "../pages/schools/InvoiceDetail";
import AdminInvoiceDetail from "../pages/admin/invoices/InvoiceDetail";
import AdminInvoiceList from "../pages/admin/invoices/InvoiceList";
import AdminInvoiceCreate from "../pages/admin/invoices/InvoiceCreate";

function AppRoutes() {
  return (
    <>
    <Navbar />
    <RouteTester />
      <Routes>

            {/* public Routes */}
        
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
        <Route path="/NotFound" element={<NotFound />} />
        <Route path="/ServerError" element={<ServerError />} />
        <Route path="/Unauthorized" element={<Unauthorized />} />
        <Route path="/SystemConfig" element={<SystemConfig />} />
        <Route path="/RolesPermissions" element={<RolesPermissions />} />
        <Route path="/GeneralSettings" element={<GeneralSettings />} />
        <Route path="/Notifications" element={<Notifications />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Header" element={<Header />} />
        <Route path="/InvoiceDetail" element={<InvoiceDetail />} />
        <Route path="/MyInvoices" element={<MyInvoices />} />
        <Route path="/Checkout" element={<Checkout />} />
        <Route path="/DashboardClient" element={<DashboardClient />} />
        <Route path="/EditProfile" element={<EditProfile />} />
        <Route path="/Wishlist" element={<Wishlist />} />
        <Route path="/SchoolInvoiceDetail" element={<SchoolInvoiceDetail />} />
        <Route path="/SchoolInvoices" element={<SchoolInvoices />} />
        <Route path="/AdminInvoiceBySchool" element={<AdminInvoiceBySchool  />} />
        <Route path="/AdminInvoiceCreate" element={<AdminInvoiceCreate  />} />
        <Route path="/AdminInvoiceDetail" element={<AdminInvoiceDetail />} />
        <Route path="/AdminInvoiceList" element={<AdminInvoiceList />} />


            {/* Private Routes */}

      </Routes>
      <Footer/>
    </>
  );
}

export default AppRoutes;