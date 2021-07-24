// Own imports
import Layout from 'components/Layout';
import DisplayCode from 'components/CodePastes/DisplayCode';
import supabaseClient from 'utils/supabase';

// Other imports
import { Alert, AlertProps, Container, Heading } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { PasteType, User } from 'types';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import axios from 'axios';

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
	currentUser: string;
}

const MotionAlert = motion<AlertProps>(Alert);

// Server side props override
export const getServerSideProps: GetServerSideProps = async context => {
	let currentUser: string;
	// @ts-ignore
	const { paste } = context.params;
	const { data: pastes, error } = await supabaseClient
		.from<PasteType>('Pastes')
		.select('*')
		// @ts-ignore
		.eq('pasteId', paste);
	const currentPaste = pastes[0];
	if (currentPaste.userId !== '') {
		const { data: users } = await axios.get<Array<User>>(
			'https://api.clerk.dev/v1/users?limit=100',
			{
				headers: {
					Authorization: `Bearer ${process.env.CLERK_API_KEY}`
				}
			}
		);
		const user = users.find(user => user.id === currentPaste.userId);
		currentUser = `${user.first_name} ${user.last_name}`;
	} else {
		currentUser = 'Anonymous';
	}

	console.error(error);

	if (error)
		return {
			notFound: true
		};
	return {
		props: { paste: currentPaste, currentUser }
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

const PrivatePaste = ({ paste, currentUser }: Props) => {
	const user = useUser();
	return user.id !== paste.userId ? (
		<InfoAlert />
	) : (
		<>
			{paste.title !== '' && (
				<Heading textAlign="center">{paste.title}</Heading>
			)}
			<DisplayCode paste={paste} language={paste.language} />
		</>
	);
};

// Paste component
const Paste = ({ paste, currentUser }: Props) => {
	return (
		<Layout title={paste.title || 'Paste'} links={links}>
			<Container maxW="full" my="6">
				{paste.private ? (
					<>
						<SignedIn>
							<PrivatePaste
								paste={paste}
								currentUser={currentUser}
							/>
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
						<Heading textAlign="center" size="md" mt="2">
							{currentUser}
						</Heading>
						<DisplayCode paste={paste} language={paste.language} />
					</>
				)}
			</Container>
		</Layout>
	);
};

export default Paste;
