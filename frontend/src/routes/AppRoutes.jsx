import { Navigate, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import RoleRoute from "./RoleRoute";
import PrivateRoute from "./PrivateRoute";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AuthForgotPassword from "../pages/auth/ForgotPassword";
import AuthResetPassword from "../pages/auth/ResetPassword";
import Profile from "../pages/auth/Profile";

import Home from "../pages/public/Home";
import Products from "../pages/public/Products";
import Categories from "../pages/public/Categories";
import Pages from "../pages/public/Pages";
import SpecialOrder from "../pages/public/special-order";
import ProductDetail from "../pages/public/ProductDetail";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";
import FAQ from "../pages/public/Faq";

import NotFound from "../pages/errors/NotFound";
import ServerError from "../pages/errors/ServerError";
import Unauthorized from "../pages/errors/Unauthorized";

import Dashboard from "../pages/admin/Dashboard";
import Analytics from "../pages/admin/Analytics";
import ProductsListAdmin from "../pages/admin/products/ProductsList";
import AddProductAdmin from "../pages/admin/products/AddProduct";
import CategoriesAdmin from "../pages/admin/products/Categories";
import EditProductAdmin from "../pages/admin/products/EditProduct";
import ProductDetailsAdmin from "../pages/admin/products/ProductDetails";
import StockHistory from "../pages/admin/stock/StockHistory";
import StockList from "../pages/admin/stock/StockList";
import UpdateStock from "../pages/admin/stock/UpdateStock";
import GeneralSettings from "../pages/admin/settings/GeneralSettings";
import RolesPermissions from "../pages/admin/settings/RolesPermissions";
import SystemConfig from "../pages/admin/settings/SystemConfig";
import AdminInvoiceBySchool from "../pages/admin/invoices/InvoiceBySchool";
import AdminInvoiceCreate from "../pages/admin/invoices/InvoiceCreate";
import AdminInvoiceDetail from "../pages/admin/invoices/InvoiceDetail";
import AdminInvoiceList from "../pages/admin/invoices/InvoiceList";
import AdminUsersReports from "../pages/admin/reports/UsersReports";
import AdminStockReports from "../pages/admin/reports/StockReports";
import AdminSalesReports from "../pages/admin/reports/SalesReports";
import AdminUsersList from "../pages/admin/users/UsersList";
import AdminCreateUser from "../pages/admin/users/CreateUser";
import AdminEditUser from "../pages/admin/users/EditUser";
import AdminUserDetails from "../pages/admin/users/UserDetails";
import AdminSchoolsList from "../pages/admin/schools/SchoolsList";
import AdminAddSchool from "../pages/admin/schools/AddSchool";
import AdminEditSchool from "../pages/admin/schools/EditSchool";
import AdminSchoolDetails from "../pages/admin/schools/SchoolDetails";
import AdminSuppliersList from "../pages/admin/suppliers/SuppliersList";
import AdminAddSupplier from "../pages/admin/suppliers/AddSupplier";
import AdminEditSupplier from "../pages/admin/suppliers/EditSupplier";
import AdminSupplierDetails from "../pages/admin/suppliers/SupplierDetails";
import AdminOrdersList from "../pages/admin/orders/OrdersList";
import AdminManageOrders from "../pages/admin/orders/ManageOrders";
import AdminOrderDetails from "../pages/admin/orders/OrderDetails";
import AdminSpecialOrdersList from "../pages/admin/special-orders/SpecialOrdersList";
import AdminSpecialOrderDetails from "../pages/admin/special-orders/SpecialOrderDetails";

import Cart from "../pages/client/Cart";
import Checkout from "../pages/client/Checkout";
import DashboardClient from "../pages/client/Dashboard";
import Wishlist from "../pages/client/Wishlist";
import MyInvoices from "../pages/client/invoices/MyInvoices";
import ClientInvoiceDetail from "../pages/client/invoices/InvoiceDetail";
import Notifications from "../pages/notifications/Notifications";
import ClientOrders from "../pages/client/Orders";
import ClientOrderDetail from "../pages/client/OrderDetail";
import ClientSpecialOrder from "../pages/client/SpecialOrder";
import ClientNotifications from "../pages/client/Notifications";

import ModeratorDashboard from "../pages/moderator/Dashboard";
import ModeratorProfile from "../pages/moderator/Profile";
import ModeratorReports from "../pages/moderator/reports/BasicReports";
import ModeratorProductsList from "../pages/moderator/products/ProductsList";
import ModeratorProductDetails from "../pages/moderator/products/ProductDetails";
import ModeratorEditProduct from "../pages/moderator/products/EditProduct";
import ModeratorStockList from "../pages/moderator/stock/StockList";
import ModeratorUpdateStock from "../pages/moderator/stock/UpdateStock";
import ModeratorOrdersList from "../pages/moderator/orders/OrdersList";
import ModeratorOrderDetails from "../pages/moderator/orders/OrderDetails";
import ModeratorSchoolsList from "../pages/moderator/schools/SchoolsList";
import ModeratorSchoolDetails from "../pages/moderator/schools/SchoolDetails";
import ModeratorInvoicesList from "../pages/moderator/invoices/InvoiceList";
import ModeratorInvoiceDetail from "../pages/moderator/invoices/InvoiceDetail";
import ModeratorSpecialOrdersList from "../pages/moderator/special-orders/SpecialOrdersList";
import ModeratorSpecialOrderDetails from "../pages/moderator/special-orders/SpecialOrderDetails";

import SchoolInvoices from "../pages/schools/SchoolInvoices";
import SchoolInvoiceDetail from "../pages/schools/InvoiceDetail";
import { loadSitePreferences } from "../services/sitePreferencesService";

function AppRoutes() {
  useEffect(() => {
    loadSitePreferences();
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<AuthForgotPassword />} />
        <Route path="/reset-password" element={<AuthResetPassword />} />
        <Route path="/password-reset/:token" element={<AuthResetPassword />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/Categories" element={<Categories />} />
        <Route path="/pages" element={<Pages />} />
        <Route path="/Pages" element={<Pages />} />
        <Route path="/ProductDetail" element={<ProductDetail />} />
        <Route path="/special-order" element={<SpecialOrder />} />
        <Route path="/SpecialOrder" element={<SpecialOrder />} />
        <Route path="/About" element={<About />} />
        <Route path="/about" element={<About />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/FAQ" element={<FAQ />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/NotFound" element={<NotFound />} />
        <Route path="/ServerError" element={<ServerError />} />
        <Route path="/Unauthorized" element={<Unauthorized />} />

        {/* Private routes */}
        <Route path="/Profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/public/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

        {/* Client routes */}
        <Route path="/client/dashboard" element={<RoleRoute allowedRoles={["client"]}><DashboardClient /></RoleRoute>} />
        <Route path="/Cart" element={<RoleRoute allowedRoles={["client"]}><Cart /></RoleRoute>} />
        <Route path="/Checkout" element={<RoleRoute allowedRoles={["client"]}><Checkout /></RoleRoute>} />
        <Route path="/Wishlist" element={<RoleRoute allowedRoles={["client"]}><Wishlist /></RoleRoute>} />
        <Route path="/MyInvoices" element={<RoleRoute allowedRoles={["client"]}><MyInvoices /></RoleRoute>} />
        <Route path="/InvoiceDetail" element={<RoleRoute allowedRoles={["client"]}><ClientInvoiceDetail /></RoleRoute>} />
        <Route path="/Orders" element={<RoleRoute allowedRoles={["client"]}><ClientOrders /></RoleRoute>} />
        <Route path="/OrderDetail" element={<RoleRoute allowedRoles={["client"]}><ClientOrderDetail /></RoleRoute>} />
        <Route path="/Notifications" element={<RoleRoute allowedRoles={["client", "admin", "moderator"]}><Notifications /></RoleRoute>} />
        <Route path="/client/notifications" element={<RoleRoute allowedRoles={["client"]}><ClientNotifications /></RoleRoute>} />
        <Route path="/client/special-order" element={<RoleRoute allowedRoles={["client"]}><ClientSpecialOrder /></RoleRoute>} />

        {/* Admin routes */}
        <Route path="/dashboard" element={<RoleRoute allowedRoles={["admin"]}><Dashboard /></RoleRoute>} />
        <Route path="/admin/dashboard" element={<RoleRoute allowedRoles={["admin"]}><Dashboard /></RoleRoute>} />
        <Route path="/admin/analytics" element={<RoleRoute allowedRoles={["admin"]}><Analytics /></RoleRoute>} />
        <Route path="/ProductsListAdmin" element={<RoleRoute allowedRoles={["admin"]}><ProductsListAdmin /></RoleRoute>} />
        <Route path="/AddProductAdmin" element={<RoleRoute allowedRoles={["admin"]}><AddProductAdmin /></RoleRoute>} />
        <Route path="/CategoriesAdmin" element={<RoleRoute allowedRoles={["admin"]}><CategoriesAdmin /></RoleRoute>} />
        <Route path="/EditProductAdmin" element={<RoleRoute allowedRoles={["admin"]}><EditProductAdmin /></RoleRoute>} />
        <Route path="/ProductDetailsAdmin" element={<RoleRoute allowedRoles={["admin"]}><ProductDetailsAdmin /></RoleRoute>} />
        <Route path="/StockList" element={<RoleRoute allowedRoles={["admin"]}><StockList /></RoleRoute>} />
        <Route path="/UpdateStock" element={<RoleRoute allowedRoles={["admin"]}><UpdateStock /></RoleRoute>} />
        <Route path="/StockHistory" element={<RoleRoute allowedRoles={["admin"]}><StockHistory /></RoleRoute>} />
        <Route path="/SystemConfig" element={<RoleRoute allowedRoles={["admin"]}><SystemConfig /></RoleRoute>} />
        <Route path="/RolesPermissions" element={<RoleRoute allowedRoles={["admin"]}><RolesPermissions /></RoleRoute>} />
        <Route path="/GeneralSettings" element={<RoleRoute allowedRoles={["admin", "moderator"]}><GeneralSettings /></RoleRoute>} />
        <Route path="/AdminInvoiceBySchool" element={<RoleRoute allowedRoles={["admin"]}><AdminInvoiceBySchool /></RoleRoute>} />
        <Route path="/AdminInvoiceCreate" element={<Navigate to="/admin/invoices/create" replace />} />
        <Route path="/admin/invoices/create" element={<RoleRoute allowedRoles={["admin"]}><AdminInvoiceCreate /></RoleRoute>} />
        <Route path="/AdminInvoiceDetail" element={<RoleRoute allowedRoles={["admin"]}><AdminInvoiceDetail /></RoleRoute>} />
        <Route path="/AdminInvoiceList" element={<RoleRoute allowedRoles={["admin"]}><AdminInvoiceList /></RoleRoute>} />
        <Route path="/admin/users" element={<RoleRoute allowedRoles={["admin"]}><AdminUsersList /></RoleRoute>} />
        <Route path="/admin/users/create" element={<RoleRoute allowedRoles={["admin"]}><AdminCreateUser /></RoleRoute>} />
        <Route path="/admin/users/edit" element={<RoleRoute allowedRoles={["admin"]}><AdminEditUser /></RoleRoute>} />
        <Route path="/admin/users/details" element={<RoleRoute allowedRoles={["admin"]}><AdminUserDetails /></RoleRoute>} />
        <Route path="/admin/schools" element={<RoleRoute allowedRoles={["admin"]}><AdminSchoolsList /></RoleRoute>} />
        <Route path="/admin/schools/create" element={<RoleRoute allowedRoles={["admin"]}><AdminAddSchool /></RoleRoute>} />
        <Route path="/admin/schools/edit" element={<RoleRoute allowedRoles={["admin"]}><AdminEditSchool /></RoleRoute>} />
        <Route path="/admin/schools/details" element={<RoleRoute allowedRoles={["admin"]}><AdminSchoolDetails /></RoleRoute>} />
        <Route path="/admin/suppliers" element={<RoleRoute allowedRoles={["admin"]}><AdminSuppliersList /></RoleRoute>} />
        <Route path="/admin/suppliers/create" element={<RoleRoute allowedRoles={["admin"]}><AdminAddSupplier /></RoleRoute>} />
        <Route path="/admin/suppliers/edit" element={<RoleRoute allowedRoles={["admin"]}><AdminEditSupplier /></RoleRoute>} />
        <Route path="/admin/suppliers/details" element={<RoleRoute allowedRoles={["admin"]}><AdminSupplierDetails /></RoleRoute>} />
        <Route path="/admin/orders" element={<RoleRoute allowedRoles={["admin"]}><AdminOrdersList /></RoleRoute>} />
        <Route path="/admin/orders/manage" element={<RoleRoute allowedRoles={["admin"]}><AdminManageOrders /></RoleRoute>} />
        <Route path="/admin/orders/details" element={<RoleRoute allowedRoles={["admin"]}><AdminOrderDetails /></RoleRoute>} />
        <Route path="/admin/special-orders" element={<RoleRoute allowedRoles={["admin"]}><AdminSpecialOrdersList /></RoleRoute>} />
        <Route path="/admin/special-orders/details" element={<RoleRoute allowedRoles={["admin"]}><AdminSpecialOrderDetails /></RoleRoute>} />
        <Route path="/admin/reports/users" element={<RoleRoute allowedRoles={["admin"]}><AdminUsersReports /></RoleRoute>} />
        <Route path="/admin/reports/stock" element={<RoleRoute allowedRoles={["admin"]}><AdminStockReports /></RoleRoute>} />
        <Route path="/admin/reports/sales" element={<RoleRoute allowedRoles={["admin"]}><AdminSalesReports /></RoleRoute>} />

        {/* Moderator routes */}
        <Route path="/moderator/dashboard" element={<RoleRoute allowedRoles={["admin", "moderator"]}><ModeratorDashboard /></RoleRoute>} />
        <Route path="/moderator/profile" element={<RoleRoute allowedRoles={["admin", "moderator"]}><ModeratorProfile /></RoleRoute>} />
        <Route path="/moderator/reports" element={<RoleRoute allowedRoles={["admin", "moderator"]}><ModeratorReports /></RoleRoute>} />
        <Route path="/moderator/products" element={<RoleRoute allowedRoles={["admin", "moderator"]}><ModeratorProductsList /></RoleRoute>} />
        <Route path="/moderator/product-details" element={<RoleRoute allowedRoles={["admin", "moderator"]}><ModeratorProductDetails /></RoleRoute>} />
        <Route path="/moderator/edit-product" element={<RoleRoute allowedRoles={["admin", "moderator"]}><ModeratorEditProduct /></RoleRoute>} />
        <Route path="/moderator/stock" element={<RoleRoute allowedRoles={["admin", "moderator"]}><ModeratorStockList /></RoleRoute>} />
        <Route path="/moderator/update-stock" element={<RoleRoute allowedRoles={["admin", "moderator"]}><ModeratorUpdateStock /></RoleRoute>} />
        <Route path="/moderator/stock-history" element={<RoleRoute allowedRoles={["admin", "moderator"]}><StockHistory /></RoleRoute>} />
        <Route path="/moderator/orders" element={<RoleRoute allowedRoles={["admin", "moderator"]}><ModeratorOrdersList /></RoleRoute>} />
        <Route path="/moderator/order-details" element={<RoleRoute allowedRoles={["admin", "moderator"]}><ModeratorOrderDetails /></RoleRoute>} />
        <Route path="/moderator/schools" element={<RoleRoute allowedRoles={["admin", "moderator"]}><ModeratorSchoolsList /></RoleRoute>} />
        <Route path="/moderator/school-details" element={<RoleRoute allowedRoles={["admin", "moderator"]}><ModeratorSchoolDetails /></RoleRoute>} />
        <Route path="/moderator/invoices" element={<RoleRoute allowedRoles={["admin", "moderator"]}><ModeratorInvoicesList /></RoleRoute>} />
        <Route path="/moderator/invoice-detail" element={<RoleRoute allowedRoles={["admin", "moderator"]}><ModeratorInvoiceDetail /></RoleRoute>} />
        <Route path="/moderator/special-orders" element={<RoleRoute allowedRoles={["admin", "moderator"]}><ModeratorSpecialOrdersList /></RoleRoute>} />
        <Route path="/moderator/special-order-details" element={<RoleRoute allowedRoles={["admin", "moderator"]}><ModeratorSpecialOrderDetails /></RoleRoute>} />

        {/* School pages */}
        <Route path="/school/invoices" element={<RoleRoute allowedRoles={["admin"]}><SchoolInvoices /></RoleRoute>} />
        <Route path="/school/invoice-detail" element={<RoleRoute allowedRoles={["admin"]}><SchoolInvoiceDetail /></RoleRoute>} />
        <Route path="/SchoolInvoices" element={<RoleRoute allowedRoles={["admin"]}><SchoolInvoices /></RoleRoute>} />
        <Route path="/SchoolInvoiceDetail" element={<RoleRoute allowedRoles={["admin"]}><SchoolInvoiceDetail /></RoleRoute>} />

        {/* Fallbacks */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default AppRoutes;
