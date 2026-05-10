import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, LogOut, Menu, Minus, Plus, Search, ShoppingCart, Trash2, UserRound, X } from "lucide-react";
import logo from "@/assets/logo/library.png";
import { AuthContext } from "@/features/auth/authContext";
import { CART_CHANGED_EVENT, getCartItems, getCartTotals, removeCartItem, syncCartWithProducts, updateCartItem } from "@/features/client/services/cartService";
import { getCategories } from "@/shared/services/categoryService";
import { getUnreadNotificationCount } from "@/features/notifications/services/notificationService";
import { formatDh } from "@/data/catalog";
import { resolveMediaUrl } from "@/shared/utils/common/media";
import { useUiPreferences } from "@/shared/context/UIContext";

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
  const { i18n, language, t } = useUiPreferences();

  const isAuthenticated = !!user;
  const roleSlug = (user?.role?.slug || "").toLowerCase();
  const notificationsPath = roleSlug === "client" ? "/client/notifications" : "/notifications";

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      try {
        const data = await getCategories();
        if (active) {
          setCategories(Array.isArray(data) ? data : []);
        }
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
    let active = true;

    async function refreshCart() {
      if (!isAuthenticated) {
        if (active) {
          setCartItems([]);
        }
        return;
      }

      try {
        const syncedItems = await syncCartWithProducts();
        if (active) {
          setCartItems(syncedItems);
        }
      } catch {
        if (active) {
          setCartItems(getCartItems());
        }
      }
    }

    function syncCart(event) {
      if (!isAuthenticated) {
        setCartItems([]);
        return;
      }

      setCartItems(Array.isArray(event?.detail?.items) ? event.detail.items : getCartItems());
    }

    refreshCart();
    window.addEventListener(CART_CHANGED_EVENT, syncCart);
    window.addEventListener("storage", syncCart);

    return () => {
      active = false;
      window.removeEventListener(CART_CHANGED_EVENT, syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, [isAuthenticated]);

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
          <Link to="/" aria-label={t("navbar.goHome")}>
            <img src={logo} alt={t("common.brandName")} />
          </Link>
        </div>

        <form className="nav-search-form" onSubmit={handleSearchSubmit} role="search">
          <Search size={18} className="nav-search-icon" />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={t("navbar.searchPlaceholder")}
            aria-label={t("navbar.searchProducts")}
          />
        </form>

        <button
          type="button"
          className="nav-menu-toggle"
          onClick={() => setMobileMenuOpen((current) => !current)}
          aria-label={mobileMenuOpen ? t("navbar.closeMenu") : t("navbar.openMenu")}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="nav-actions">
          <div className="nav-preference-group" aria-label={t("common.language")}>
            <label className="nav-language-label" htmlFor="nav-language-select">
              <span className="language-icon" aria-hidden="true">{t("common.languageIcon")}</span>
            </label>
            <select
              id="nav-language-select"
              className="nav-language-select"
              value={language}
              onChange={(event) => i18n.changeLanguage(event.target.value)}
              aria-label={t("common.language")}
            >
              <option value="en">🇺🇸</option>
              <option value="fr">🇫🇷</option>
              <option value="ar">🇲🇦</option>
            </select>
          </div>

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
              {t("navbar.categories")}
              <ChevronDown size={14} />
            </button>

            <div className="nav-dropdown-menu nav-categories-menu">
              <Link to="/categories" onClick={closeMenus} className="nav-dropdown-item">
                {t("navbar.allCategories")}
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
                <span className="nav-dropdown-empty">{t("navbar.noCategories")}</span>
              )}
            </div>
          </div>

          <Link to="/pages" className="nav-action-button nav-pages-link" onClick={closeMenus}>
            {t("navbar.pages")}
          </Link>

          {isAuthenticated ? (
            <button
              type="button"
              className="nav-action-button nav-cart-trigger"
              onClick={handleCartToggle}
              aria-label={`${t("navbar.cartLabel")} (${cartTotals.itemCount})`}
              aria-expanded={cartOpen}
              aria-controls="cart-drawer"
            >
              <ShoppingCart size={16} />
              {cartTotals.itemCount > 0 ? (
                <span className="nav-cart-badge" aria-label={t("navbar.itemsInCart", { count: cartTotals.itemCount })}>
                  {cartTotals.itemCount > 9 ? "9+" : cartTotals.itemCount}
                </span>
              ) : null}
            </button>
          ) : null}

          {isAuthenticated ? (
            <Link to={notificationsPath} className="nav-action-button nav-notification-link" onClick={closeMenus}>
              <Bell size={16} />
              {t("navbar.notifications")}
              {unreadNotifications > 0 ? (
                <span className="nav-notification-badge" aria-label={t("navbar.unreadNotifications", { count: unreadNotifications })}>
                  {unreadNotifications > 9 ? "9+" : unreadNotifications}
                </span>
              ) : null}
            </Link>
          ) : null}

          <div
            className={`nav-dropdown nav-profile-dropdown ${profileOpen ? "open" : ""}`}
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
              {t("navbar.profile")}
              <ChevronDown size={14} />
            </button>

            <div className="nav-dropdown-menu nav-profile-menu">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" onClick={closeMenus} className="nav-dropdown-item">
                    {t("navbar.myProfile")}
                  </Link>
                  <button type="button" onClick={handleLogout} className="nav-dropdown-item nav-dropdown-button nav-logout-button">
                    <LogOut size={14} />
                    {t("common.logout")}
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={closeMenus} className="nav-dropdown-item">
                  {t("navbar.login")}
                </Link>
              )}
            </div>
          </div>

          <Link to="/about" className="nav-action-button" onClick={closeMenus}>
            {t("navbar.about")}
          </Link>
          <Link to="/contact" className="nav-action-button" onClick={closeMenus}>
            {t("navbar.contact")}
          </Link>
          <Link to="/faq" className="nav-action-button" onClick={closeMenus}>
            {t("navbar.support")}
          </Link>
        </div>
      </nav>

      {isAuthenticated && cartOpen ? (
        <button className="cart-drawer-backdrop" type="button" aria-label={t("common.close")} onClick={closeAllOverlays} />
      ) : null}

      {isAuthenticated ? (
        <aside id="cart-drawer" className={`cart-drawer ${cartOpen ? "open" : ""}`} aria-hidden={!cartOpen}>
          <div className="cart-drawer-header">
            <div>
              <span className="cart-drawer-kicker">{t("cart.title")}</span>
              <h2>{t("cart.selectedItems")}</h2>
            </div>
            <button type="button" className="cart-drawer-close" onClick={() => setCartOpen(false)} aria-label={t("common.close")}>
              <X size={20} />
            </button>
          </div>

          {cartItems.length ? (
            <>
              <div className="cart-drawer-list">
                {cartItems.map((item) => {
                  const imageSrc = resolveMediaUrl(item.image_url || item.img || item.image);
                  const stockLimitReached = Number(item.stock || 0) > 0 && Number(item.quantity || 0) >= Number(item.stock || 0);

                  return (
                    <article className="cart-drawer-item" key={item.id}>
                      {imageSrc ? <img src={imageSrc} alt={item.name} /> : <div className="cart-drawer-image-placeholder">{t("cart.noImage")}</div>}
                      <div className="cart-drawer-item-body">
                        <div className="cart-drawer-item-head">
                          <h3>{item.name}</h3>
                          <button type="button" onClick={() => handleCartRemove(item.id)} aria-label={`${t("common.delete")} ${item.name}`}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <span>{formatDh(Number(item.price || 0))}</span>
                        <div className="cart-drawer-qty">
                          <button type="button" onClick={() => handleCartQuantity(item.id, item.quantity - 1)} aria-label={`${t("common.previous")} ${item.name}`}>
                            <Minus size={14} />
                          </button>
                          <strong>{item.quantity}</strong>
                          <button
                            type="button"
                            onClick={() => handleCartQuantity(item.id, item.quantity + 1)}
                            disabled={stockLimitReached}
                            aria-label={`${t("common.next")} ${item.name}`}
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
                  <span>{t("cart.subtotal")}</span>
                  <strong>{formatDh(cartTotals.subtotal)}</strong>
                </div>
                <div>
                  <span>{t("cart.delivery")}</span>
                  <strong>{t("cart.free")}</strong>
                </div>
                <div className="cart-drawer-total">
                  <span>{t("cart.total")}</span>
                  <strong>{formatDh(cartTotals.total)}</strong>
                </div>
                <button type="button" className="cart-drawer-checkout" onClick={() => goToCart("/checkout")}>
                  {t("cart.checkout")}
                </button>
                <button type="button" className="cart-drawer-view" onClick={() => goToCart("/cart")}>
                  {t("cart.viewCart")}
                </button>
              </div>
            </>
          ) : (
            <div className="cart-drawer-empty">
              <ShoppingCart size={42} />
              <h3>{t("cart.emptyTitle")}</h3>
              <p>{t("cart.emptyDescription")}</p>
              <button type="button" onClick={() => goToCart("/products")}>
                {t("cart.browseProducts")}
              </button>
            </div>
          )}
        </aside>
      ) : null}
    </>
  );
}

export default Navbar;
