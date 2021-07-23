import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import nightOwl from 'prism-react-renderer/themes/nightOwl';
import { Box } from '@chakra-ui/react';
import CopyButton from './CopyButton';
import ActionsButton from './ActionsButton';
import { ILanguage, PasteType } from 'types';

interface Props {
	paste: PasteType;
	language?: ILanguage;
}

const DisplayCode = ({ paste, language }: Props) => {
	return (
		<Box mt="8" position="relative">
			{/* <CopyButton code={code} /> */}
			<ActionsButton code={paste.code} id={paste.pasteId} />
			<Highlight
				{...defaultProps}
				code={paste.code.trim()}
				// @ts-ignore
				language={language || 'diff'}
				theme={nightOwl}
			>
				{({
					className,
					style,
					tokens,
					getLineProps,
					getTokenProps
				}) => (
					<Box
						as="pre"
						className={className}
						style={style}
						textAlign="left"
						m="1em 0"
						p="0.5em"
						overflow="auto"
						fontFamily="Fira Code"
					>
						{tokens.map((line, i) => (
							<Box
								key={i}
								display="table-row"
								{...getLineProps({ line, key: i })}
							>
								<Box
									as="span"
									display="table-cell"
									textAlign="right"
									pr="1em"
									userSelect="none"
									opacity="0.5"
								>
									{i + 1}
								</Box>
								<Box as="span" display="table-cell">
									{line.map((token, key) => (
										<Box
											as="span"
											key={key}
											{...getTokenProps({ token, key })}
										/>
									))}
								</Box>
							</Box>
						))}
					</Box>
				)}
			</Highlight>
		</Box>
	);
};

export default DisplayCode;
