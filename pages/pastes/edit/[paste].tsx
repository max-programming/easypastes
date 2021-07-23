// Own imports
import Layout from 'components/Layout';
import supabaseClient from 'utils/supabase';

// Other imports
import {
	Alert,
	AlertProps,
	Container,
	Heading,
	Button
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { PasteType } from 'types';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import InputCode from 'components/CodePastes/InputCode';
import { useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import SelectLanguage from 'components/CodePastes/SelectLanguage';
import { useRouter } from 'next/router';

// Define the links
const links = [
	{
		url: '/pastes',
		text: 'Pastes'
	}
];

// Custom types
interface Props {
	paste: PasteType;
}

const MotionAlert = motion<AlertProps>(Alert);

// Server side props override
export const getServerSideProps: GetServerSideProps = async context => {
	// @ts-ignore
	const { paste } = context.params;
	const { data: pastes, error } = await supabaseClient
		.from<PasteType>('Pastes')
		.select('*')
		// @ts-ignore
		.eq('pasteId', paste);

	console.error(error);

	if (error)
		return {
			notFound: true
		};
	return {
		props: { paste: pastes[0] }
	};
};

const InfoAlert = () => (
	<MotionAlert
		variant="left-accent"
		status="error"
		initial={{ translateY: -75 }}
		animate={{ translateY: 0 }}
	>
		This is a private paste
	</MotionAlert>
);

const PrivatePaste = ({ paste }: Props) => {
	const user = useUser();
	const [code, setCode] = useState(paste.code);
	const [language, setLanguage] = useState(paste.language);
	return user.id !== paste.userId ? (
		<InfoAlert />
	) : (
		<>
			{paste.title !== '' && (
				<Heading textAlign="center">{paste.title}</Heading>
			)}
			<SelectLanguage language={language} setLanguage={setLanguage} />
			<InputCode code={code} setCode={setCode} language={language} />
		</>
	);
};

// Paste component
const Paste = ({ paste }: Props) => {
	const [code, setCode] = useState(paste.code);
	const [language, setLanguage] = useState(paste.language);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const handleClick = async () => {
		setLoading(true);
		const { data, error } = await supabaseClient
			.from<PasteType>('Pastes')
			.update({ code, language })
			.eq('pasteId', paste.pasteId);
		if (!error) {
			router.push(`/pastes/${paste.pasteId}`);
			setLoading(false);
		}
	};
	return (
		<Layout title={paste.title || 'Paste'} links={links}>
			<Container maxW="full" my="6">
				{paste.private ? (
					<>
						<SignedIn>
							<PrivatePaste paste={paste} />
						</SignedIn>
						<SignedOut>
							<InfoAlert />
						</SignedOut>
					</>
				) : (
					<>
						{paste.title !== '' && (
							<Heading textAlign="center">{paste.title}</Heading>
						)}
						<SelectLanguage
							language={language}
							setLanguage={setLanguage}
						/>
						<InputCode
							code={code}
							setCode={setCode}
							language={language}
						/>
						<Button
							fontWeight="normal"
							my="4"
							colorScheme="purple"
							float="right"
							rightIcon={<FiArrowRight />}
							onClick={handleClick}
							isLoading={loading}
							spinnerPlacement="end"
							loadingText="Creating"
						>
							Save
						</Button>
					</>
				)}
			</Container>
		</Layout>
	);
};

export default Paste;
