import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Footer from "@/layouts/components/Footer";
import Navbar from "@/layouts/components/Navbar";
import PrivateRoute from "@/routes/PrivateRoute";
import RoleRoute from "@/routes/RoleRoute";
import Analytics from "@/features/admin/pages/Analytics";
import Dashboard from "@/features/admin/pages/Dashboard";
import AdminInvoiceBySchool from "@/features/admin/pages/invoices/InvoiceBySchool";
import AdminInvoiceCreate from "@/features/admin/pages/invoices/InvoiceCreate";
import AdminInvoiceDetail from "@/features/admin/pages/invoices/InvoiceDetail";
import AdminInvoiceList from "@/features/admin/pages/invoices/InvoiceList";
import AdminManageOrders from "@/features/admin/pages/orders/ManageOrders";
import AdminOrderDetails from "@/features/admin/pages/orders/OrderDetails";
import AdminOrdersList from "@/features/admin/pages/orders/OrdersList";
import AddProductAdmin from "@/features/admin/pages/products/AddProduct";
import CategoriesAdmin from "@/features/admin/pages/products/Categories";
import EditProductAdmin from "@/features/admin/pages/products/EditProduct";
import ProductDetailsAdmin from "@/features/admin/pages/products/ProductDetails";
import ProductsListAdmin from "@/features/admin/pages/products/ProductsList";
import AdminSalesReports from "@/features/admin/pages/reports/SalesReports";
import AdminStockReports from "@/features/admin/pages/reports/StockReports";
import AdminUsersReports from "@/features/admin/pages/reports/UsersReports";
import AdminAddSchool from "@/features/admin/pages/schools/AddSchool";
import AdminEditSchool from "@/features/admin/pages/schools/EditSchool";
import AdminSchoolDetails from "@/features/admin/pages/schools/SchoolDetails";
import AdminSchoolsList from "@/features/admin/pages/schools/SchoolsList";
import GeneralSettings from "@/features/admin/pages/settings/GeneralSettings";
import RolesPermissions from "@/features/admin/pages/settings/RolesPermissions";
import SystemConfig from "@/features/admin/pages/settings/SystemConfig";
import AdminSpecialOrderDetails from "@/features/admin/pages/special-orders/SpecialOrderDetails";
import AdminSpecialOrdersList from "@/features/admin/pages/special-orders/SpecialOrdersList";
import StockHistory from "@/features/admin/pages/stock/StockHistory";
import StockList from "@/features/admin/pages/stock/StockList";
import UpdateStock from "@/features/admin/pages/stock/UpdateStock";
import AdminAddSupplier from "@/features/admin/pages/suppliers/AddSupplier";
import AdminEditSupplier from "@/features/admin/pages/suppliers/EditSupplier";
import AdminSupplierDetails from "@/features/admin/pages/suppliers/SupplierDetails";
import AdminSuppliersList from "@/features/admin/pages/suppliers/SuppliersList";
import AdminCreateUser from "@/features/admin/pages/users/CreateUser";
import AdminEditUser from "@/features/admin/pages/users/EditUser";
import AdminUserDetails from "@/features/admin/pages/users/UserDetails";
import AdminUsersList from "@/features/admin/pages/users/UsersList";
import ForgotPassword from "@/features/auth/pages/ForgotPassword";
import Login from "@/features/auth/pages/Login";
import Profile from "@/features/auth/pages/Profile";
import Register from "@/features/auth/pages/Register";
import ResetPassword from "@/features/auth/pages/ResetPassword";
import Cart from "@/features/client/pages/Cart";
import Checkout from "@/features/client/pages/Checkout";
import DashboardClient from "@/features/client/pages/Dashboard";
import ClientNotifications from "@/features/client/pages/Notifications";
import ClientOrderDetail from "@/features/client/pages/OrderDetail";
import ClientOrders from "@/features/client/pages/Orders";
import ClientSpecialOrder from "@/features/client/pages/SpecialOrder";
import Wishlist from "@/features/client/pages/Wishlist";
import ClientInvoiceDetail from "@/features/client/pages/invoices/InvoiceDetail";
import MyInvoices from "@/features/client/pages/invoices/MyInvoices";
import NotFound from "@/features/errors/pages/NotFound";
import ServerError from "@/features/errors/pages/ServerError";
import Unauthorized from "@/features/errors/pages/Unauthorized";
import ModeratorDashboard from "@/features/moderator/pages/Dashboard";
import ModeratorProfile from "@/features/moderator/pages/Profile";
import ModeratorInvoiceDetail from "@/features/moderator/pages/invoices/InvoiceDetail";
import ModeratorInvoicesList from "@/features/moderator/pages/invoices/InvoiceList";
import ModeratorOrderDetails from "@/features/moderator/pages/orders/OrderDetails";
import ModeratorOrdersList from "@/features/moderator/pages/orders/OrdersList";
import ModeratorEditProduct from "@/features/moderator/pages/products/EditProduct";
import ModeratorProductDetails from "@/features/moderator/pages/products/ProductDetails";
import ModeratorProductsList from "@/features/moderator/pages/products/ProductsList";
import ModeratorReports from "@/features/moderator/pages/reports/BasicReports";
import ModeratorSchoolDetails from "@/features/moderator/pages/schools/SchoolDetails";
import ModeratorSchoolsList from "@/features/moderator/pages/schools/SchoolsList";
import ModeratorSpecialOrderDetails from "@/features/moderator/pages/special-orders/SpecialOrderDetails";
import ModeratorSpecialOrdersList from "@/features/moderator/pages/special-orders/SpecialOrdersList";
import ModeratorStockList from "@/features/moderator/pages/stock/StockList";
import ModeratorUpdateStock from "@/features/moderator/pages/stock/UpdateStock";
import Notifications from "@/features/notifications/pages/Notifications";
import About from "@/features/public/pages/About";
import Categories from "@/features/public/pages/Categories";
import Contact from "@/features/public/pages/Contact";
import FAQ from "@/features/public/pages/Faq";
import Home from "@/features/public/pages/Home";
import Pages from "@/features/public/pages/Pages";
import ProductDetail from "@/features/public/pages/ProductDetail";
import Products from "@/features/public/pages/Products";
import SpecialOrder from "@/features/public/pages/SpecialOrder";
import SchoolInvoiceDetail from "@/features/schools/pages/InvoiceDetail";
import SchoolInvoices from "@/features/schools/pages/SchoolInvoices";
import { loadSitePreferences } from "@/shared/services/sitePreferencesService";

function AppRoutes() {
  useEffect(() => {
    loadSitePreferences();
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/password-reset/:token" element={<ResetPassword />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/pages" element={<Pages />} />
        <Route path="/product-detail" element={<ProductDetail />} />
        <Route path="/special-order" element={<SpecialOrder />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="/server-error" element={<ServerError />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/public/profile" element={<Navigate to="/profile" replace />} />

        <Route path="/client/dashboard" element={<RoleRoute allowedRoles={["client"]}><DashboardClient /></RoleRoute>} />
        <Route path="/cart" element={<RoleRoute allowedRoles={["client"]}><Cart /></RoleRoute>} />
        <Route path="/checkout" element={<RoleRoute allowedRoles={["client"]}><Checkout /></RoleRoute>} />
        <Route path="/wishlist" element={<RoleRoute allowedRoles={["client"]}><Wishlist /></RoleRoute>} />
        <Route path="/my-invoices" element={<RoleRoute allowedRoles={["client"]}><MyInvoices /></RoleRoute>} />
        <Route path="/invoice-detail" element={<RoleRoute allowedRoles={["client"]}><ClientInvoiceDetail /></RoleRoute>} />
        <Route path="/orders" element={<RoleRoute allowedRoles={["client"]}><ClientOrders /></RoleRoute>} />
        <Route path="/order-detail" element={<RoleRoute allowedRoles={["client"]}><ClientOrderDetail /></RoleRoute>} />
        <Route path="/notifications" element={<RoleRoute allowedRoles={["client", "admin", "moderator"]}><Notifications /></RoleRoute>} />
        <Route path="/client/notifications" element={<RoleRoute allowedRoles={["client"]}><ClientNotifications /></RoleRoute>} />
        <Route path="/client/special-order" element={<RoleRoute allowedRoles={["client"]}><ClientSpecialOrder /></RoleRoute>} />

        <Route path="/dashboard" element={<RoleRoute allowedRoles={["admin"]}><Dashboard /></RoleRoute>} />
        <Route path="/admin/dashboard" element={<RoleRoute allowedRoles={["admin"]}><Dashboard /></RoleRoute>} />
        <Route path="/admin/analytics" element={<RoleRoute allowedRoles={["admin"]}><Analytics /></RoleRoute>} />
        <Route path="/admin/products" element={<RoleRoute allowedRoles={["admin"]}><ProductsListAdmin /></RoleRoute>} />
        <Route path="/admin/products/create" element={<RoleRoute allowedRoles={["admin"]}><AddProductAdmin /></RoleRoute>} />
        <Route path="/admin/categories" element={<RoleRoute allowedRoles={["admin"]}><CategoriesAdmin /></RoleRoute>} />
        <Route path="/admin/products/edit" element={<RoleRoute allowedRoles={["admin"]}><EditProductAdmin /></RoleRoute>} />
        <Route path="/admin/products/details" element={<RoleRoute allowedRoles={["admin"]}><ProductDetailsAdmin /></RoleRoute>} />
        <Route path="/admin/stock" element={<RoleRoute allowedRoles={["admin"]}><StockList /></RoleRoute>} />
        <Route path="/admin/stock/update" element={<RoleRoute allowedRoles={["admin"]}><UpdateStock /></RoleRoute>} />
        <Route path="/admin/stock/history" element={<RoleRoute allowedRoles={["admin"]}><StockHistory /></RoleRoute>} />
        <Route path="/admin/settings/system" element={<RoleRoute allowedRoles={["admin"]}><SystemConfig /></RoleRoute>} />
        <Route path="/admin/settings/roles" element={<RoleRoute allowedRoles={["admin"]}><RolesPermissions /></RoleRoute>} />
        <Route path="/admin/settings/general" element={<RoleRoute allowedRoles={["admin", "moderator"]}><GeneralSettings /></RoleRoute>} />
        <Route path="/admin/invoices/by-school" element={<RoleRoute allowedRoles={["admin"]}><AdminInvoiceBySchool /></RoleRoute>} />
        <Route path="/admin/invoices/create" element={<RoleRoute allowedRoles={["admin"]}><AdminInvoiceCreate /></RoleRoute>} />
        <Route path="/admin/invoices/details" element={<RoleRoute allowedRoles={["admin"]}><AdminInvoiceDetail /></RoleRoute>} />
        <Route path="/admin/invoices" element={<RoleRoute allowedRoles={["admin"]}><AdminInvoiceList /></RoleRoute>} />
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

        <Route path="/school/invoices" element={<RoleRoute allowedRoles={["admin"]}><SchoolInvoices /></RoleRoute>} />
        <Route path="/school/invoice-detail" element={<RoleRoute allowedRoles={["admin"]}><SchoolInvoiceDetail /></RoleRoute>} />

        <Route path="/Categories" element={<Navigate to="/categories" replace />} />
        <Route path="/Pages" element={<Navigate to="/pages" replace />} />
        <Route path="/ProductDetail" element={<Navigate to="/product-detail" replace />} />
        <Route path="/SpecialOrder" element={<Navigate to="/special-order" replace />} />
        <Route path="/About" element={<Navigate to="/about" replace />} />
        <Route path="/Contact" element={<Navigate to="/contact" replace />} />
        <Route path="/FAQ" element={<Navigate to="/faq" replace />} />
        <Route path="/NotFound" element={<Navigate to="/not-found" replace />} />
        <Route path="/ServerError" element={<Navigate to="/server-error" replace />} />
        <Route path="/Unauthorized" element={<Navigate to="/unauthorized" replace />} />
        <Route path="/Profile" element={<Navigate to="/profile" replace />} />
        <Route path="/Cart" element={<Navigate to="/cart" replace />} />
        <Route path="/Checkout" element={<Navigate to="/checkout" replace />} />
        <Route path="/Wishlist" element={<Navigate to="/wishlist" replace />} />
        <Route path="/MyInvoices" element={<Navigate to="/my-invoices" replace />} />
        <Route path="/InvoiceDetail" element={<Navigate to="/invoice-detail" replace />} />
        <Route path="/Orders" element={<Navigate to="/orders" replace />} />
        <Route path="/OrderDetail" element={<Navigate to="/order-detail" replace />} />
        <Route path="/Notifications" element={<Navigate to="/notifications" replace />} />
        <Route path="/ProductsListAdmin" element={<Navigate to="/admin/products" replace />} />
        <Route path="/AddProductAdmin" element={<Navigate to="/admin/products/create" replace />} />
        <Route path="/CategoriesAdmin" element={<Navigate to="/admin/categories" replace />} />
        <Route path="/EditProductAdmin" element={<Navigate to="/admin/products/edit" replace />} />
        <Route path="/ProductDetailsAdmin" element={<Navigate to="/admin/products/details" replace />} />
        <Route path="/StockList" element={<Navigate to="/admin/stock" replace />} />
        <Route path="/UpdateStock" element={<Navigate to="/admin/stock/update" replace />} />
        <Route path="/StockHistory" element={<Navigate to="/admin/stock/history" replace />} />
        <Route path="/SystemConfig" element={<Navigate to="/admin/settings/system" replace />} />
        <Route path="/RolesPermissions" element={<Navigate to="/admin/settings/roles" replace />} />
        <Route path="/GeneralSettings" element={<Navigate to="/admin/settings/general" replace />} />
        <Route path="/AdminInvoiceBySchool" element={<Navigate to="/admin/invoices/by-school" replace />} />
        <Route path="/AdminInvoiceCreate" element={<Navigate to="/admin/invoices/create" replace />} />
        <Route path="/AdminInvoiceDetail" element={<Navigate to="/admin/invoices/details" replace />} />
        <Route path="/AdminInvoiceList" element={<Navigate to="/admin/invoices" replace />} />
        <Route path="/SchoolInvoices" element={<Navigate to="/school/invoices" replace />} />
        <Route path="/SchoolInvoiceDetail" element={<Navigate to="/school/invoice-detail" replace />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default AppRoutes;
