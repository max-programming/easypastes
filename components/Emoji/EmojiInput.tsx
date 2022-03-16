import { Input, InputProps } from '@chakra-ui/react';
import { BaseEmoji, emojiIndex } from 'emoji-mart';
import {
  ChangeEventHandler,
  Dispatch,
  KeyboardEventHandler,
  MouseEventHandler,
  SetStateAction,
  useState
} from 'react';

import EmojiAutocomplete from './EmojiAutocomplete';

interface Props {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}

export default function EmojiInput({
  value,
  setValue,
  ...inputProps
}: Props & InputProps) {
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<BaseEmoji[]>(
    []
  );
  const onChange: ChangeEventHandler<HTMLInputElement> = ev => {
    setValue(ev.currentTarget.value);
    console.log(value);

    if (!ev.target.value.split(':')[1]) return;

    const emojiInput = ev.target.value.split(':')[1];
    console.log({ emojiInput });

    if (emojiInput.startsWith(' ') || emojiInput.endsWith(' ')) {
      setShowSuggestions(false);
      return;
    }

    const results = emojiIndex.search(emojiInput) as BaseEmoji[];
    setFilteredSuggestions(results.slice(0, 10));
    setShowSuggestions(true);
    console.log({ results });
  };

  const onClick: MouseEventHandler<HTMLLIElement> = async e => {
    const afterColon = value.substring(value.indexOf(':'));
    const [selectedEmoji] = emojiIndex.search(
      e.currentTarget.innerText.slice(4, -2)
    ) as BaseEmoji[];

    setValue(
      value => `${value.replace(afterColon, '')}${selectedEmoji.native}`
    );
    setFilteredSuggestions([]);
    setShowSuggestions(false);
    setActiveSuggestion(0);
  };

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = async ev => {
    if (ev.key === 'Enter') {
      ev.preventDefault();

      const selectedEmoji = filteredSuggestions[activeSuggestion];
      const afterColon = value.substring(value.indexOf(':'));

      setValue(
        value => `${value.replace(afterColon, '')}${selectedEmoji.native}`
      );
      setActiveSuggestion(0);
      setShowSuggestions(false);
    } else if (ev.key === 'ArrowUp') {
      ev.preventDefault();

      if (activeSuggestion === 0) return;

      setActiveSuggestion(activeSuggestion - 1);
    } else if (ev.key === 'ArrowDown') {
      ev.preventDefault();

      if (activeSuggestion - 1 === filteredSuggestions.length) return;
      if (activeSuggestion === 9) return;

      setActiveSuggestion(activeSuggestion + 1);
    } else if (ev.key === 'Escape') {
      ev.preventDefault();

      setShowSuggestions(false);
    }
  };
  return (
    <>
      <Input
        onChange={onChange}
        value={value}
        onKeyDown={onKeyDown}
        {...inputProps}
      />
      <EmojiAutocomplete
        showSuggestions={showSuggestions}
        filteredSuggestions={filteredSuggestions.map(
          e => `${e.native} ${e.colons}`
        )}
        activeSuggestion={activeSuggestion}
        onClick={onClick}
      />
    </>
  );
}
