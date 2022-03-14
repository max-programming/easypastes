import { Box, Select, theme, useColorModeValue } from '@chakra-ui/react';
import { ChangeEventHandler, Dispatch, SetStateAction } from 'react';

import { ILanguage } from 'types';

import { languages } from '../../constants';

interface Props {
  language: ILanguage;
  setLanguage: Dispatch<SetStateAction<ILanguage>>;
}

const SelectLanguage = ({ language, setLanguage }: Props) => {
  const handleChange: ChangeEventHandler<HTMLSelectElement> = e => {
    // @ts-ignore
    setLanguage(e.target.value);
  };
  return (
    <Box mb="4">
      <label htmlFor="select-language">Select a language</label>
      <Select
        value={language}
        id="select-language"
        onChange={handleChange}
        fontSize="sm"
        focusBorderColor={useColorModeValue(
          theme.colors.purple[600],
          theme.colors.purple[200]
        )}
      >
        {languages.sort().map(lang => (
          <option value={lang} key={lang}>
            {lang}
          </option>
        ))}
      </Select>
    </Box>
  );
};

export default SelectLanguage;
