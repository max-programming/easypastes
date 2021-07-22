import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import nProgress from "nprogress";
import Router from "next/router";
import type { AppProps } from "next/app";
import "@fontsource/poppins/400.css";
import "styles/nprogress.css";

Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeComplete", nProgress.done);
Router.events.on("routeChangeError", nProgress.done);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <CSSReset />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
