import Filter from 'bad-words';

export default function filterBadWords(text: string): string {
  if (text.trim() === '') return;
  const filter = new Filter();
  return filter.clean(text);
}
