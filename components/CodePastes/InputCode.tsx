import { Box } from '@chakra-ui/react';
import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import nightOwl from 'prism-react-renderer/themes/nightOwl';
import Editor from 'react-simple-code-editor';
import { Dispatch, SetStateAction } from 'react';
import { ILanguage } from 'types';

interface Props {
	code: string;
	setCode: Dispatch<SetStateAction<string>>;
	language?: ILanguage;
}

const InputCode = ({ code, setCode, language }: Props) => {
	const handleValueChange = (code: string) => setCode(code);
	const highlight = (code: string) => (
		<Highlight
			{...defaultProps}
			theme={nightOwl}
			code={code}
			// @ts-ignore
			language={language || 'diff'}
		>
			{({ tokens, getLineProps, getTokenProps }) => (
				<>
					{tokens.map((line, i) => (
						<Box {...getLineProps({ line, key: i })} key={i}>
							{line.map((token, key) => (
								<Box as="span" {...getTokenProps({ token, key })} key={key} />
							))}
						</Box>
					))}
				</>
			)}
		</Highlight>
	);
	return (
		<Box mt="4">
			<Editor
				value={code}
				onValueChange={handleValueChange}
				highlight={highlight}
				padding={10}
				placeholder="Paste code/text here"
				required
				// @ts-ignore
				style={{
					fontFamily: 'Fira Code',
					boxSizing: 'border-box',
					minHeight: 250,
					...nightOwl.plain
				}}
			/>
		</Box>
	);
};

export default InputCode;
