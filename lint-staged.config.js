module.exports = {
  '*.{js,jsx,ts,tsx}': ['eslint'],
  '*.{js,jsx,ts,tsx,json,md}': ['prettier --write'],
  '**/*.ts?(x)': () => 'npx tsc --noEmit --pretty'
};
