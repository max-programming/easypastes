import { Emoji } from 'types';

export default function searchEmoji(emojis: Array<Emoji>, query: string) {
  const filteredEmojis = emojis.filter(
    emoji => emoji.slug.toLowerCase().indexOf(query.toLowerCase()) > -1
  );
  return filteredEmojis;
}
