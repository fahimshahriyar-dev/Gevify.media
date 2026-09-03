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

/**
 * Detects whether the given URL points to a video uploaded to Cloudinary
 * (distinguished from a Cloudinary image by the `/video/upload/` segment).
 */
export const isCloudinaryVideoUrl = (url?: string | null): boolean => {
  if (!url) return false;
  return url.includes("res.cloudinary.com") && url.includes("/video/upload/");
};

/**
 * Derives a poster/thumbnail image URL from a Cloudinary video URL by forcing
 * a JPEG frame extraction (f_jpg) on the video's resource path. Unlike the
 * image-resource trick, delivering through the /video/upload/ endpoint reliably
 * returns a still frame regardless of the uploaded file's extension.
 */
export const getCloudinaryVideoThumbnail = (
  url?: string | null,
  width = 640,
): string => {
  if (!url || !isCloudinaryVideoUrl(url)) return "";
  return url.replace(
    "/video/upload/",
    `/video/upload/f_jpg,w_${width},q_auto/`,
  );
};
