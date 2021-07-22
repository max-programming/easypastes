import { extendTheme, ThemeConfig } from "@chakra-ui/react";

// Define theme config
const config: ThemeConfig = {
  initialColorMode: "dark",
};

// Create the theme
const theme = extendTheme({ config, fonts: { heading: "Poppins" } });

export default theme;
