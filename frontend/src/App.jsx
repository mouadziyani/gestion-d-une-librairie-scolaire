import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AuthForgotPassword from "./pages/auth/ForgotPassword";
import AuthResetPassword from "./pages/auth/ResetPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<AuthForgotPassword />} />
        <Route path="/reset-password" element={<AuthResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;