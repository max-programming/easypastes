// Own imports
import Layout from 'components/Layout';
import DisplayCode from 'components/CodePastes/DisplayCode';
import supabaseClient from 'utils/supabase';

// Other imports
import { Alert, AlertProps, Container, Heading } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { PasteType } from 'types';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

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
	return user.id !== paste.userId ? (
		<InfoAlert />
	) : (
		<>
			{paste.title !== '' && (
				<Heading textAlign="center">{paste.title}</Heading>
			)}
			<DisplayCode code={paste.code} language={paste.language} />
		</>
	);
};

// Paste component
const Paste = ({ paste }: Props) => {
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
						<DisplayCode
							code={paste.code}
							language={paste.language}
						/>
					</>
				)}
			</Container>
		</Layout>
	);
};

export default Paste;
