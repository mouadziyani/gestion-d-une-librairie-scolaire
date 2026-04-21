const WISHLIST_KEY = "library_bougdim_wishlist";

function readWishlist() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(WISHLIST_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeWishlist(items) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  }
}

export function getWishlistItems() {
  return readWishlist();
}

export function saveWishlistItems(items) {
  writeWishlist(items);
  return items;
}

export function isInWishlist(productId) {
  return readWishlist().some((item) => Number(item.id) === Number(productId));
}

export function addToWishlist(product) {
  const wishlist = readWishlist();

  if (wishlist.some((item) => Number(item.id) === Number(product.id))) {
    return wishlist;
  }

  const nextWishlist = [
    ...wishlist,
    {
      id: product.id,
      name: product.name,
      price: Number(product.price || 0),
      cat: product.cat || product.category?.name || product.category || "",
      image_url: product.image_url || product.imageUrl || product.img || product.image || "",
      img: product.img || product.image_url || product.imageUrl || product.image || "",
      reference: product.reference || "",
      stock: Number(product.stock || 0),
      status: product.status || "active",
    },
  ];

  writeWishlist(nextWishlist);
  return nextWishlist;
}

export function removeFromWishlist(productId) {
  const nextWishlist = readWishlist().filter((item) => Number(item.id) !== Number(productId));
  writeWishlist(nextWishlist);
  return nextWishlist;
}
