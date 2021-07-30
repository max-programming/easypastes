import Prism from 'prism-react-renderer/prism';

export default function importLangs() {
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
  // @ts-ignore
  import('prismjs/components/prism-java');
}
