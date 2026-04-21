import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, Minus, Plus, ShoppingCart, Trash2, LogOut, Menu, Search, UserRound, X } from "lucide-react";
import logo from "../assets/logo/library.png";
import { AuthContext } from "../context/AuthContext";
import { CART_CHANGED_EVENT, getCartItems, getCartTotals, removeCartItem, updateCartItem } from "../services/cartService";
import { getCategories } from "../services/categoryService";
import { getUnreadNotificationCount } from "../services/notificationService";
import { formatDh } from "../data/catalog";
import { resolveMediaUrl } from "../utils/media";

const fallbackCartImage = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=220";

function Navbar() {
  const [categories, setCategories] = useState([]);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, setPreferencesTick] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState(() => getCartItems());
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);

  const isAuthenticated = !!user;
  const roleSlug = (user?.role?.slug || "").toLowerCase();
  const notificationsPath = roleSlug === "client" ? "/client/notifications" : "/Notifications";

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      try {
        const data = await getCategories();
        if (!active) {
          return;
        }

        setCategories(Array.isArray(data) ? data : []);
      } catch {
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
    setCartOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function syncCart(event) {
      setCartItems(Array.isArray(event?.detail?.items) ? event.detail.items : getCartItems());
    }

    syncCart();
    window.addEventListener(CART_CHANGED_EVENT, syncCart);
    window.addEventListener("storage", syncCart);

    return () => {
      window.removeEventListener(CART_CHANGED_EVENT, syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  useEffect(() => {
    function handlePreferencesChange() {
      setPreferencesTick((value) => value + 1);
    }

    window.addEventListener("bougdim:site-preferences-changed", handlePreferencesChange);

    return () => {
      window.removeEventListener("bougdim:site-preferences-changed", handlePreferencesChange);
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadUnreadNotifications() {
      if (!isAuthenticated) {
        setUnreadNotifications(0);
        return;
      }

      try {
        const count = await getUnreadNotificationCount();
        if (active) {
          setUnreadNotifications(count);
        }
      } catch {
        if (active) {
          setUnreadNotifications(0);
        }
      }
    }

    loadUnreadNotifications();

    const intervalId = window.setInterval(loadUnreadNotifications, 30000);

    function handleNotificationsChanged() {
      loadUnreadNotifications();
    }

    window.addEventListener("bougdim:notifications-changed", handleNotificationsChanged);

    return () => {
      active = false;
      window.clearInterval(intervalId);
      window.removeEventListener("bougdim:notifications-changed", handleNotificationsChanged);
    };
  }, [isAuthenticated, location.pathname, roleSlug]);

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

  function closeAllOverlays() {
    closeMenus();
    setCartOpen(false);
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

  const cartTotals = getCartTotals(cartItems);

  function handleCartToggle() {
    setCartOpen((current) => !current);
    setCategoriesOpen(false);
    setProfileOpen(false);
  }

  function handleCartQuantity(productId, quantity) {
    setCartItems(updateCartItem(productId, quantity));
  }

  function handleCartRemove(productId) {
    setCartItems(removeCartItem(productId));
  }

  function goToCart(path) {
    setCartOpen(false);
    setMobileMenuOpen(false);
    navigate(path);
  }

  return (
    <>
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

          <button
            type="button"
            className="nav-action-button nav-cart-trigger"
            onClick={handleCartToggle}
            aria-label={`Open cart with ${cartTotals.itemCount} items`}
            aria-expanded={cartOpen}
            aria-controls="cart-drawer"
          >
            <ShoppingCart size={16} />
            Cart
            {cartTotals.itemCount > 0 ? (
              <span className="nav-cart-badge" aria-label={`${cartTotals.itemCount} items in cart`}>
                {cartTotals.itemCount > 9 ? "9+" : cartTotals.itemCount}
              </span>
            ) : null}
          </button>

        {isAuthenticated ? (
          <Link to={notificationsPath} className="nav-action-button nav-notification-link" onClick={closeMenus}>
            <Bell size={16} />
            Notifications
            {unreadNotifications > 0 ? (
              <span className="nav-notification-badge" aria-label={`${unreadNotifications} unread notifications`}>
                {unreadNotifications > 9 ? "9+" : unreadNotifications}
              </span>
            ) : null}
          </Link>
        ) : null}

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

      {cartOpen ? <button className="cart-drawer-backdrop" type="button" aria-label="Close cart" onClick={closeAllOverlays} /> : null}

      <aside id="cart-drawer" className={`cart-drawer ${cartOpen ? "open" : ""}`} aria-hidden={!cartOpen}>
        <div className="cart-drawer-header">
          <div>
            <span className="cart-drawer-kicker">Shopping cart</span>
            <h2>Selected items</h2>
          </div>
          <button type="button" className="cart-drawer-close" onClick={() => setCartOpen(false)} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {cartItems.length ? (
          <>
            <div className="cart-drawer-list">
              {cartItems.map((item) => {
                const imageSrc = resolveMediaUrl(item.image_url || item.img || item.image) || fallbackCartImage;
                const stockLimitReached = Number(item.stock || 0) > 0 && Number(item.quantity || 0) >= Number(item.stock || 0);

                return (
                  <article className="cart-drawer-item" key={item.id}>
                    <img src={imageSrc} alt={item.name} />
                    <div className="cart-drawer-item-body">
                      <div className="cart-drawer-item-head">
                        <h3>{item.name}</h3>
                        <button type="button" onClick={() => handleCartRemove(item.id)} aria-label={`Remove ${item.name}`}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <span>{formatDh(Number(item.price || 0))}</span>
                      <div className="cart-drawer-qty">
                        <button type="button" onClick={() => handleCartQuantity(item.id, item.quantity - 1)} aria-label={`Decrease ${item.name}`}>
                          <Minus size={14} />
                        </button>
                        <strong>{item.quantity}</strong>
                        <button
                          type="button"
                          onClick={() => handleCartQuantity(item.id, item.quantity + 1)}
                          disabled={stockLimitReached}
                          aria-label={`Increase ${item.name}`}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="cart-drawer-summary">
              <div>
                <span>Subtotal</span>
                <strong>{formatDh(cartTotals.subtotal)}</strong>
              </div>
              <div>
                <span>Delivery</span>
                <strong>FREE</strong>
              </div>
              <div className="cart-drawer-total">
                <span>Total</span>
                <strong>{formatDh(cartTotals.total)}</strong>
              </div>
              <button type="button" className="cart-drawer-checkout" onClick={() => goToCart("/Checkout")}>
                Checkout
              </button>
              <button type="button" className="cart-drawer-view" onClick={() => goToCart("/Cart")}>
                View full cart
              </button>
            </div>
          </>
        ) : (
          <div className="cart-drawer-empty">
            <ShoppingCart size={42} />
            <h3>Your cart is empty.</h3>
            <p>Add products from the catalogue and they will show up here.</p>
            <button type="button" onClick={() => goToCart("/products")}>
              Browse products
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

export default Navbar;
