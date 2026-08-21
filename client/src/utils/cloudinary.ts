/**
 * Optimizes a Cloudinary image URL by injecting quality, format, and width parameters.
 * If the URL is not a Cloudinary URL, it returns the original URL.
 * 
 * @param url The original Cloudinary URL
 * @param width The target width to scale the image to (defaults to 200)
 */
export const optimizeCloudinaryUrl = (url: string, width = 200): string => {
  if (!url) return "";
  if (url.includes("res.cloudinary.com")) {
    // If it already has transformation parameters, just return it
    if (url.includes("/upload/f_auto")) return url;
    return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
  }
  return url;
};
