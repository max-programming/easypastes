import Filter from 'bad-words';

// Make a global filter object instead of instantiating a new one everytime
const filter = new Filter();

export default function swearFilter(text: string | undefined): string {
  if (text === '' || !text) return;

  text = text
    .split('')
    .filter(c => c.charCodeAt(0) !== 8203)
    .join('');

  return filter.clean(text);
}
