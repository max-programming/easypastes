import { Input, InputProps } from '@chakra-ui/react';
import {
  ChangeEventHandler,
  Dispatch,
  KeyboardEventHandler,
  MouseEventHandler,
  SetStateAction,
  useState
} from 'react';
import { BaseEmoji, emojiIndex } from 'emoji-mart';
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
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<BaseEmoji[]>(
    []
  );
  const onChange: ChangeEventHandler<HTMLInputElement> = e => {
    setValue(e.currentTarget.value);
    console.log(value);
    if (!e.target.value.split(':')[1]) return;
    const emojiInput = e.target.value.split(':')[1];
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

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = async e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const selectedEmoji = filteredSuggestions[activeSuggestion];
      const afterColon = value.substring(value.indexOf(':'));
      setValue(
        value => `${value.replace(afterColon, '')}${selectedEmoji.native}`
      );
      setActiveSuggestion(0);
      setShowSuggestions(false);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (activeSuggestion === 0) return;
      setActiveSuggestion(activeSuggestion - 1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (activeSuggestion - 1 === filteredSuggestions.length) return;
      setActiveSuggestion(activeSuggestion + 1);
    } else if (e.key === 'Escape') {
      e.preventDefault();
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
