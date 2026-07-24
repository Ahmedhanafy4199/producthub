/**
 * Formatter utilities for prices, ratings, and text truncation
 */

/**
 * Format a number as USD currency
 */
export const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

/**
 * Calculate the discounted price
 */
export const getDiscountedPrice = (price, discountPercentage) =>
  price - (price * discountPercentage) / 100;

/**
 * Truncate long text with ellipsis
 */
export const truncateText = (text, maxLength = 80) =>
  text?.length > maxLength ? text.slice(0, maxLength) + '...' : text;

/**
 * Return star rating array (filled / half / empty) for display
 */
export const getStarRating = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) stars.push('full');
    else if (i - rating < 1) stars.push('half');
    else stars.push('empty');
  }
  return stars;
};

/**
 * Capitalize the first letter of a string
 */
export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
