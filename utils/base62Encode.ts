let digits = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
let result = '';

const base62Encode = (n: number) => {
  if (n === 0) {
    return '0';
  }

  while (n > 0) {
    result = digits[n % digits.length] + result;
    n = parseInt((n / digits.length).toString(), 10);
  }

  return result;
};

export default base62Encode;
