const config = {
  title: 'Easy Pastes - Easiest Way to create and share code pastes',
  description: `Use Easy Pastes to create, store, share code snippets by simply pasting them with syntax highlight.`,
  additionalMetaTags: [
    {
      property: 'keywords',
      content: 'paste, easypastes, create, pastebin, git, github, gitlab'
    },
    {
      name: 'google-site-verification',
      content: 'NdkMJQSa7meePpnwqOlgUDjoKAj8_o6G2rYH-B-1Wwo'
    }
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/logo.png'
    },
    {
      rel: 'apple-touch-icon',
      href: '/logo.png',
      sizes: '100x100'
    }
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://easypastes.tk',
    title: 'Easy Pastes - Easiest Way to create and share code pastes',
    description: `Use Easy Pastes to create, store, share code snippets by simply pasting them with syntax highlight.`,
    images: [
      {
        url: 'https://easypastes.tk/logo.png',
        width: 100,
        height: 100,
        alt: 'Og Image Alt'
      }
    ],
    site_name: 'Easy Pastes',
    imageWidth: 1200,
    imageHeight: 1200
  },
  twitter: {
    handle: '@MaxProgramming1',
    cardType: 'summary'
  }
};

export default config;
