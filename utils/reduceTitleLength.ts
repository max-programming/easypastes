import { PasteType } from 'types';

export default function reduceTitleLength(
  paste: PasteType
): PasteType & { longTitle: string } {
  let longTitle = '';

  if (!paste.title || !(paste.title.length >= 30))
    return { ...paste, longTitle };

  longTitle = paste.title;

  paste.title = paste.title.slice(0, 30) + '...';

  return { ...paste, longTitle };
}
