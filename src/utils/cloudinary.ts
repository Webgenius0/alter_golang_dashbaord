export function getOptimizedImageUrl(url: string, forcePng = false): string {
  if (!url) return url;
  
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    // If it's explicitly an SVG or we want to force PNG
    if (forcePng || url.toLowerCase().endsWith('.svg')) {
      // Add f_png transformation
      let optimized = url.replace('/upload/', '/upload/f_png/');
      // Also ensure the extension is .png
      if (optimized.toLowerCase().endsWith('.svg')) {
        optimized = optimized.substring(0, optimized.length - 4) + '.png';
      } else if (!optimized.match(/\.[a-zA-Z0-9]{3,4}$/)) {
        // No extension found, append .png
        optimized += '.png';
      }
      return optimized;
    }
    
    // For other images, use f_auto,q_auto if not already transformed
    if (!url.includes('/upload/f_')) {
      return url.replace('/upload/', '/upload/f_auto,q_auto/');
    }
  }
  
  return url;
}
