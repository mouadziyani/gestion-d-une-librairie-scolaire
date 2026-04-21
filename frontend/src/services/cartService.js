const CART_KEY = "library_bougdim_cart";
export const CART_CHANGED_EVENT = "library-bougdim:cart-changed";

function getProductImage(product) {
  return product.image_url || product.imageUrl || product.img || product.image || "";
}

function normalizeCartItem(item) {
  return {
    ...item,
    image_url: item.image_url || item.imageUrl || item.img || item.image || "",
    img: item.img || item.image_url || item.imageUrl || item.image || "",
    quantity: Math.max(1, Number(item.quantity || 1)),
    stock: Number(item.stock || 0),
  };
}

function readCart() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(normalizeCartItem) : [];
  } catch {
    return [];
  }
}

function writeCart(items) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(
    new CustomEvent(CART_CHANGED_EVENT, {
      detail: {
        items,
      },
    }),
  );
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
    const stock = Number(product.stock || cart[existingIndex].stock || 0);
    const requestedQuantity = cart[existingIndex].quantity + nextQuantity;

    cart[existingIndex] = {
      ...cart[existingIndex],
      cat: product.cat || product.category?.name || product.category || cart[existingIndex].cat || "",
      image_url: getProductImage(product) || cart[existingIndex].image_url || "",
      img: getProductImage(product) || cart[existingIndex].img || "",
      stock,
      quantity: stock > 0 ? Math.min(requestedQuantity, stock) : requestedQuantity,
    };
  } else {
    const stock = Number(product.stock || 0);

    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price || 0),
      cat: product.cat || product.category?.name || product.category || "",
      image_url: getProductImage(product),
      img: getProductImage(product),
      reference: product.reference || "",
      stock,
      status: product.status || "active",
      quantity: stock > 0 ? Math.min(nextQuantity, stock) : nextQuantity,
    });
  }

  writeCart(cart);
  return cart;
}

export function updateCartItem(productId, quantity) {
  const nextQuantity = Number(quantity);
  const cart = readCart();

  const nextCart = cart
    .map((item) => {
      if (Number(item.id) !== Number(productId)) {
        return item;
      }

      const stock = Number(item.stock || 0);
      const cappedQuantity = stock > 0 ? Math.min(nextQuantity, stock) : nextQuantity;

      return { ...item, quantity: cappedQuantity };
    })
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
