export const MAX_AVATAR_BYTES = 6 * 1024 * 1024;
export const AVATAR_OUTPUT_SIZE = 512;

export class ImageProcessingError extends Error {}

/**
 * Reads a user-selected image and returns a square-ish JPEG data URL that is
 * small enough to persist locally without blowing the storage quota.
 */
export async function fileToAvatarDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new ImageProcessingError("Please choose an image file (JPG, PNG or WebP).");
  }
  if (file.size > MAX_AVATAR_BYTES) {
    throw new ImageProcessingError("That image is larger than 6 MB. Try a smaller one.");
  }

  const dataUrl = await readAsDataUrl(file);
  const image = await loadImage(dataUrl);
  const scale = Math.min(1, AVATAR_OUTPUT_SIZE / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new ImageProcessingError("This browser can't process the image. Try another file.");

  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", 0.85);
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new ImageProcessingError("We couldn't read that file."));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new ImageProcessingError("We couldn't open that image."));
    image.src = src;
  });
}
