import create from 'zustand';
import { persist } from 'zustand/middleware';

import { ZustandSetType } from '../constants';

type Indentation = 'spaces' | 'tabs';

interface EditorState {
  ligatures: boolean;
  indentation: Indentation;
  indentSize: number;
  wrapping: boolean;

  toggleLigatures: () => void;
  toggleWrapping: () => void;
  setIndentation: (indentation: Indentation) => void;
  setIndentSize: (indentSize: number) => void;
}

const editorStore = (set: ZustandSetType<EditorState>) => ({
  ligatures: true,
  indentation: 'spaces',
  indentSize: 4,
  wrapping: true,

  toggleLigatures: () =>
    set((state: EditorState) => ({ ...state, ligatures: !state.ligatures })),

  toggleWrapping: () =>
    set((state: EditorState) => ({ ...state, wrapping: !state.wrapping })),

  setIndentation: (indentation: 'spaces' | 'tabs') =>
    set((state: EditorState) => ({ ...state, indentation })),

  setIndentSize: (indentSize: number) =>
    set((state: EditorState) => ({ ...state, indentSize }))
});

export const useEditorStore = create(
  persist(editorStore, { name: 'editor-store' })
);
