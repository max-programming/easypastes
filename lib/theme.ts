import { ThemeConfig, extendTheme } from '@chakra-ui/react';

// Define theme config
const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false
};

// Create the theme
const theme = extendTheme({ config, fonts: { heading: 'Poppins' } });

export default theme;
