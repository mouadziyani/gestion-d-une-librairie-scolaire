function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load image."));
    image.src = src;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }

      reject(new Error("Failed to process image."));
    }, type, quality);
  });
}

export async function optimizeImageUpload(file, options = {}) {
  const outputSize = options.outputSize || 1200;
  const targetMaxBytes = options.targetMaxBytes || 350 * 1024;
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(objectUrl);
    const cropSize = Math.min(image.width, image.height);
    const offsetX = Math.max(0, (image.width - cropSize) / 2);
    const offsetY = Math.max(0, (image.height - cropSize) / 2);
    const canvas = document.createElement("canvas");

    canvas.width = outputSize;
    canvas.height = outputSize;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Canvas is not supported in this browser.");
    }

    context.drawImage(image, offsetX, offsetY, cropSize, cropSize, 0, 0, outputSize, outputSize);

    const preferredType = file.type === "image/png" ? "image/png" : "image/jpeg";
    let quality = preferredType === "image/png" ? undefined : 0.9;
    let blob = await canvasToBlob(canvas, preferredType, quality);

    if (preferredType === "image/jpeg") {
      while (blob.size > targetMaxBytes && quality > 0.45) {
        quality -= 0.1;
        blob = await canvasToBlob(canvas, preferredType, quality);
      }
    }

    const extension = preferredType === "image/png" ? "png" : "jpg";
    const baseName = (file.name || "product-image").replace(/\.[^.]+$/, "");

    return new File([blob], `${baseName}-square.${extension}`, {
      type: preferredType,
      lastModified: Date.now(),
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
