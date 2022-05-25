export const URL = process.env.PRODUCTION_URL || 'localhost:3000';

// Hashing rounds
export const HASH_ROUNDS = 12;

// Zustand
export type ZustandSetType<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>),
  replace?: boolean
) => void;

// Paste languages
export const languages = [
  'aspnet',
  'php',
  'csharp',
  'visual-basic',
  'markup',
  'bash',
  'basic',
  'clike',
  'c',
  'cobol',
  'cpp',
  'css',
  'css-extras',
  'javascript',
  'jsx',
  'js-extras',
  'kotlin',
  'coffeescript',
  'diff',
  'git',
  'go',
  'graphql',
  'handlebars',
  'json',
  'less',
  'makefile',
  'markdown',
  'objectivec',
  'ocaml',
  'python',
  'reason',
  'scss',
  'sql',
  'stylus',
  'tsx',
  'typescript',
  'wasm',
  'yaml',
  'rust',
  'java',
  'none',
  'scala'
];
