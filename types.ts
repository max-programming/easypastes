import { Language } from 'prism-react-renderer';

export interface PasteType {
	id: number;
	code: string;
	title: string;
	language: ILanguage;
	public: boolean;
	private: boolean;
	createdAt: string;
	userId: string | null;
	pasteId: string;
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
	| 'none';
