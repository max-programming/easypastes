import Filter from 'bad-words';

export default function filterBadWords(text: string): string {
  const filter = new Filter();
  return filter.clean(text);
}
