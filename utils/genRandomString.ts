const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const generateRandomString = (numLetters: number) => {
  let id = '';
  let charsLen = chars.length;

  for (let i = 0; i <= numLetters; i++) {
    id += chars.charAt(Math.floor(Math.random() * charsLen));
  }

  return id;
};

export default generateRandomString;
