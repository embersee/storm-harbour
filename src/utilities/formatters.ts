/**
 * Converts a string to a URL-friendly slug
 * @param text The text to convert to a slug
 * @returns A lowercase string with spaces converted to hyphens and special characters removed
 * @example
 * slugify('Hello World!') // returns 'hello-world'
 * slugify('Product Name (Special Edition)') // returns 'product-name-special-edition'
 */
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

/**
 * Capitalizes the first letter of each word in a string
 * @param text The text to capitalize
 * @returns The text with the first letter of each word capitalized
 * @example
 * titleCase('hello world') // returns 'Hello World'
 */
export const titleCase = (text: string): string => {
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Truncates a string to a specified length and adds ellipsis if truncated
 * @param text The text to truncate
 * @param length The maximum length of the returned string (including ellipsis)
 * @returns The truncated string
 * @example
 * truncate('This is a long text', 10) // returns 'This is...'
 */
export const truncate = (text: string, length: number): string => {
  if (text.length <= length) return text
  return text.slice(0, length - 3) + '...'
}

/**
 * Strips all HTML tags from a string
 * @param html The HTML string to clean
 * @returns The text content without HTML tags
 * @example
 * stripHtml('<p>Hello <strong>World</strong></p>') // returns 'Hello World'
 */
export const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '')
}

/**
 * Formats a number as a price string with currency symbol
 * @param amount The number to format
 * @param currency The currency code (default: 'USD')
 * @param locale The locale to use for formatting (default: 'en-US')
 * @returns Formatted price string
 * @example
 * formatPrice(29.99) // returns '$29.99'
 * formatPrice(29.99, 'EUR', 'de-DE') // returns '29,99 €'
 */
export const formatPrice = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US',
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount)
}
