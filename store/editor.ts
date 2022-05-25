import create from 'zustand';
import { persist } from 'zustand/middleware';

import { ZustandSetType } from '../constants';

interface EditorState {
  ligatures: boolean;
  indentation: 'spaces' | 'tabs';
  indentSize: number;
  wrapping: boolean;
}

const editorStore = (set: ZustandSetType<EditorState>) => ({
  ligatures: true,
  indentation: 'spaces',
  indentSize: 4,
  wrapping: true
});

export const useEditorStore = create(
  persist(editorStore, { name: 'editor-store' })
);
