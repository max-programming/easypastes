import Filter from 'bad-words';

export default function filterBadWords(text: string): string {
  if (text === '') return;
  text = text
    .split('')
    .filter(c => c.charCodeAt(0) !== 8203)
    .join('');
  const filter = new Filter();
  return filter.clean(text);
}
