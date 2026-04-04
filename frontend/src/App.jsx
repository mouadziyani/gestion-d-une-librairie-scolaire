import React from "react";
import Nav from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

function App() {
  return (
    <div>
      <Nav />
      <hr />
      <h1>Welcome to Librairie BOUGDIM</h1>
      <hr />
      <Login />
      <hr />
      <Register />
      <hr />
      <Footer />
    </div>

  );
}

export default App;