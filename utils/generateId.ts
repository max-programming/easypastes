import { nanoid } from 'nanoid';

// Define constants.
const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Base62 method.
const base62Encode = (n: number) => {
  let result = '';

  if (n === 0) {
    return '0';
  }

  while (n > 0) {
    result = DIGITS[n % DIGITS.length] + result;
    n = parseInt((n / DIGITS.length).toString(), 10);
  }

  return result;
};

// Generate using nanoid
const generateNanoid = () => nanoid(8);

// Export base62Encode and generateNanoid.
export { base62Encode, generateNanoid };
