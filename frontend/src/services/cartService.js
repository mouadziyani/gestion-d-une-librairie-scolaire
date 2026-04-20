const CART_KEY = "library_bougdim_cart";

function readCart() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(items) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function getCartItems() {
  return readCart();
}

export function saveCartItems(items) {
  writeCart(items);
  return items;
}

export function addToCart(product, quantity = 1) {
  const nextQuantity = Math.max(1, Number(quantity || 1));
  const cart = readCart();
  const existingIndex = cart.findIndex((item) => Number(item.id) === Number(product.id));

  if (existingIndex >= 0) {
    cart[existingIndex] = {
      ...cart[existingIndex],
      quantity: cart[existingIndex].quantity + nextQuantity,
    };
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price || 0),
      cat: product.cat || product.category || "",
      img: product.img || product.image || "",
      reference: product.reference || "",
      stock: Number(product.stock || 0),
      status: product.status || "active",
      quantity: nextQuantity,
    });
  }

  writeCart(cart);
  return cart;
}

export function updateCartItem(productId, quantity) {
  const nextQuantity = Number(quantity);
  const cart = readCart();

  const nextCart = cart
    .map((item) => (Number(item.id) === Number(productId) ? { ...item, quantity: nextQuantity } : item))
    .filter((item) => item.quantity > 0);

  writeCart(nextCart);
  return nextCart;
}

export function removeCartItem(productId) {
  const cart = readCart().filter((item) => Number(item.id) !== Number(productId));
  writeCart(cart);
  return cart;
}

export function clearCart() {
  writeCart([]);
  return [];
}

export function getCartTotals(items = readCart()) {
  const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
  return {
    subtotal,
    delivery: items.length ? 0 : 0,
    total: subtotal,
    itemCount: items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
  };
}

