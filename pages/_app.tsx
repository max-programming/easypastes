import Prism from 'prismjs';
import nProgress from 'nprogress';
import Router, { useRouter } from 'next/router';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import { useEffect } from 'react';
import { ClerkProvider } from '@clerk/clerk-react';
import type { AppProps } from 'next/app';
import '@fontsource/poppins/400.css';
import '@fontsource/fira-code/500.css';
import 'styles/nprogress.css';
import 'styles/globals.css';

Router.events.on('routeChangeStart', nProgress.start);
Router.events.on('routeChangeComplete', nProgress.done);
Router.events.on('routeChangeError', nProgress.done);

const clerkFrontendApi = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API;

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();
	useEffect(() => {
		(typeof global !== 'undefined' ? global : window).Prism = Prism;
		// @ts-ignore
		import('prismjs/components/prism-cobol');
		// @ts-ignore
		import('prismjs/components/prism-kotlin');
		// @ts-ignore
		import('prismjs/components/prism-basic');
		// @ts-ignore
		import('prismjs/components/prism-visual-basic');
		// @ts-ignore
		import('prismjs/components/prism-csharp');
		// @ts-ignore
		import('prismjs/components/prism-php');
		// @ts-ignore
		import('prismjs/components/prism-aspnet');
		// @ts-ignore
		import('prismjs/components/prism-rust');
	}, []);
	return (
		<ClerkProvider
			frontendApi={clerkFrontendApi}
			navigate={to => router.push(to)}
		>
			<ChakraProvider>
				<CSSReset />
				<Component {...pageProps} />
			</ChakraProvider>
		</ClerkProvider>
	);
}

export default MyApp;
