import { Language } from 'prism-react-renderer';
import { Dispatch, SetStateAction } from 'react';

export interface PasteType {
  id: number;
  code: string;
  title: string;
  description: string;
  language: ILanguage;
  public: boolean;
  private: boolean;
  createdAt: string;
  userId: string | null;
  pasteId: string;
  pastePassword: string | null;
  hasVanity: boolean;
}

export interface User {
  id: string;
  object: string;
  username: string;
  first_name: string;
  last_name: string;
  gender: string;
  birthday: string;
  private_metadata: any;
  created_at: number;
  updated_at: number;
  created_at_ms: number;
  updated_at_ms: number;
  profile_image_url: string;
}

export type ILanguage =
  | Language
  | 'cobol'
  | 'basic'
  | 'kotlin'
  | 'csharp'
  | 'visual-basic'
  | 'php'
  | 'aspnet'
  | 'rust'
  | 'java'
  | 'none';

export type SetState<T> = Dispatch<SetStateAction<T>>;
