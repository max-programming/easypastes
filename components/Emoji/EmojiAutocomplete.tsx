import {
  Box,
  List,
  ListItem,
  theme,
  useColorModeValue
} from '@chakra-ui/react';
import { MouseEventHandler } from 'react';

interface Props {
  showSuggestions: boolean;
  filteredSuggestions: string[];
  activeSuggestion: number;
  onClick: MouseEventHandler<HTMLLIElement>;
}

export default function EmojiAutocomplete({
  showSuggestions,
  filteredSuggestions,
  activeSuggestion,
  onClick
}: Props) {
  const listBg = useColorModeValue('white', '#2D3748');
  const listItemBg = useColorModeValue(
    [theme.colors.purple[500], 'white'],
    [theme.colors.purple[200], '#2D3748']
  );
  const hoverColor = useColorModeValue(
    theme.colors.purple[500],
    theme.colors.purple[200]
  );
  const hoverText = useColorModeValue('white', 'black');
  const activeColor = useColorModeValue(
    theme.colors.purple[600],
    theme.colors.purple[300]
  );
  const activeText = useColorModeValue('white', 'black');
  const textColor = useColorModeValue(['white', 'black'], ['black', 'white']);
  return (
    <>
      <Box
        pb={4}
        mb={4}
        display={showSuggestions ? 'block' : 'none'}
        position="absolute"
        top={12}
        m="inherit"
        zIndex={2}
      >
        <List
          bg={listBg}
          borderRadius="4px"
          border={showSuggestions && '1px solid rgba(0,0,0,0.1)'}
          boxShadow="6px 5px 8px rgba(0,0,0,0.02)"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <ListItem
              key={suggestion}
              px={2}
              py={1}
              borderBottom="1px solid rgba(0,0,0,0.01)"
              userSelect="none"
              transition="all 0.2s ease"
              onClick={onClick}
              bg={index === activeSuggestion ? listItemBg[0] : listItemBg[1]}
              color={index === activeSuggestion ? textColor[0] : textColor[1]}
              _hover={{ background: hoverColor, color: hoverText }}
              _active={{ background: activeColor, color: activeText }}
            >
              {suggestion}
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );
}
