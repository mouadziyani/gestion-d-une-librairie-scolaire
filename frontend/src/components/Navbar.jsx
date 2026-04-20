import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Menu, Search, UserRound, X } from "lucide-react";
import logo from "../assets/logo/library.png";
import { AuthContext } from "../context/AuthContext";
import { getCategories } from "../services/categoryService";

function Navbar() {
  const [categories, setCategories] = useState([]);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, setPreferencesTick] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);

  const isAuthenticated = !!user;

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      try {
        const data = await getCategories();
        if (!active) {
          return;
        }

        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        if (active) {
          setCategories([]);
        }
      }
    }

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setCategoriesOpen(false);
    setProfileOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handlePreferencesChange() {
      setPreferencesTick((value) => value + 1);
    }

    window.addEventListener("bougdim:site-preferences-changed", handlePreferencesChange);

    return () => {
      window.removeEventListener("bougdim:site-preferences-changed", handlePreferencesChange);
    };
  }, []);

  async function handleLogout() {
    try {
      await logout();
    } finally {
      setProfileOpen(false);
      setMobileMenuOpen(false);
      navigate("/");
    }
  }

  function closeMenus() {
    setCategoriesOpen(false);
    setProfileOpen(false);
    setMobileMenuOpen(false);
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    const query = searchTerm.trim();

    if (query) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
    } else {
      navigate("/products");
    }

    closeMenus();
  }

  return (
    <nav className={`main-nav ${mobileMenuOpen ? "mobile-open" : ""}`}>
      <div className="nav-logo">
        <Link to="/" aria-label="Go to home">
          <img src={logo} alt="Library BOUGDIM" />
        </Link>
      </div>

      <form className="nav-search-form" onSubmit={handleSearchSubmit} role="search">
        <Search size={18} className="nav-search-icon" />
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search books, supplies, references..."
          aria-label="Search products"
        />
      </form>

      <button
        type="button"
        className="nav-menu-toggle"
        onClick={() => setMobileMenuOpen((current) => !current)}
        aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={mobileMenuOpen}
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className="nav-actions">
        <div
          className={`nav-dropdown ${categoriesOpen ? "open" : ""}`}
          onMouseEnter={() => setCategoriesOpen(true)}
          onMouseLeave={() => setCategoriesOpen(false)}
        >
          <button
            type="button"
            className="nav-action-button"
            onClick={() => setCategoriesOpen((current) => !current)}
            aria-haspopup="menu"
            aria-expanded={categoriesOpen}
          >
            Categories
            <ChevronDown size={14} />
          </button>

          <div className="nav-dropdown-menu nav-categories-menu">
            <Link to="/categories" onClick={closeMenus} className="nav-dropdown-item">
              All Categories
            </Link>
            {categories.length ? (
              categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${encodeURIComponent(category.slug || category.name || category.id)}`}
                  onClick={closeMenus}
                  className="nav-dropdown-item"
                >
                  {category.name}
                </Link>
              ))
            ) : (
              <span className="nav-dropdown-empty">No categories found</span>
            )}
          </div>
        </div>

        <Link to="/pages" className="nav-action-button nav-pages-link" onClick={closeMenus}>
          Pages
        </Link>

        <div
          className={`nav-dropdown ${profileOpen ? "open" : ""}`}
          onMouseEnter={() => setProfileOpen(true)}
          onMouseLeave={() => setProfileOpen(false)}
        >
          <button
            type="button"
            className="nav-action-button"
            onClick={() => setProfileOpen((current) => !current)}
            aria-haspopup="menu"
            aria-expanded={profileOpen}
          >
            <UserRound size={16} />
            Profile
            <ChevronDown size={14} />
          </button>

          <div className="nav-dropdown-menu nav-profile-menu">
            {isAuthenticated ? (
              <>
                <Link to="/Profile" onClick={closeMenus} className="nav-dropdown-item">
                  My Profile
                </Link>
                <button type="button" onClick={handleLogout} className="nav-dropdown-item nav-dropdown-button">
                  <LogOut size={14} />
                  Log out
                </button>
              </>
            ) : (
              <Link to="/login" onClick={closeMenus} className="nav-dropdown-item">
                Login
              </Link>
            )}
          </div>
        </div>

        <Link to="/about" className="nav-text-link" onClick={closeMenus}>
          About
        </Link>
        <Link to="/contact" className="nav-text-link" onClick={closeMenus}>
          Contact
        </Link>
        <Link to="/faq" className="nav-text-link" onClick={closeMenus}>
          Support
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
