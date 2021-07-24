import {
	Container,
	Heading,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	Alert,
	CloseButton,
	Text
} from '@chakra-ui/react';
import {
	HiOutlineViewList,
	HiOutlineEye,
	HiOutlineLockClosed,
	HiOutlineLink
} from 'react-icons/hi';
import Layout from 'components/Layout';
import { GetServerSideProps } from 'next';
import { PasteType, User } from 'types';
import Paste from 'components/CodePastes/Paste';
import supabaseClient from 'utils/supabase';
import { SignedOut, WithUser } from '@clerk/clerk-react';
import axios from 'axios';
import useLocalStorage from 'use-local-storage';
import Link from 'next/link';

const links = [
	{
		url: '/',
		text: 'Home'
	},
	{
		url: '/pastes',
		text: 'Pastes'
	}
];

interface Props {
	pastes: PasteType[];
	fullName: string;
	id: string;
	username: string;
}

export const getServerSideProps: GetServerSideProps = async context => {
	const { data: users } = await axios.get<Array<User>>(
		'https://api.clerk.dev/v1/users?limit=100',
		{
			headers: { Authorization: `Bearer ${process.env.CLERK_API_KEY}` }
		}
	);
	const currentUser = users.find(user => {
		if (!user.username) return user.id === context.params?.username;
		return user.username === context.params?.username;
	});
	const { data: pastes, error } = await supabaseClient
		.from<PasteType>('Pastes')
		.select('*')
		// @ts-ignore
		.eq('userId', currentUser.id)
		.order('createdAt', { ascending: false });
	return {
		props: {
			pastes,
			fullName: `${currentUser.first_name} ${currentUser.last_name}`,
			id: currentUser.id,
			username: currentUser.username
		}
	};
};

export default function MyPastes({ pastes, fullName, id, username }: Props) {
	const [showAlert, setShowAlert] = useLocalStorage('username-alert', false);
	return (
		<Layout title={`${fullName} - Pastes`} links={links}>
			<Alert
				status="info"
				variant="left-accent"
				hidden={!showAlert || !!username}
			>
				Add username in&nbsp;
				<Link href="/user" passHref>
					<Text as="a" _hover={{ color: 'purple.200' }}>
						the settings
					</Text>
				</Link>
				&nbsp;for your custom profile URL
				<CloseButton
					onClick={() => setShowAlert(false)}
					position="absolute"
					right="8px"
					top="8px"
					title="Remove alert"
				/>
			</Alert>
			<Container maxW="container.xl" mt="6">
				<Heading textAlign="center" size="lg">
					Pastes by {fullName}
				</Heading>
				<WithUser>
					{user =>
						user.id === id ? (
							<Tabs colorScheme="purple" mt="6">
								<TabList>
									<Tab>
										<HiOutlineViewList /> &nbsp; All
									</Tab>
									<Tab>
										<HiOutlineEye /> &nbsp; Public
									</Tab>
									<Tab>
										<HiOutlineLockClosed /> &nbsp; Private
									</Tab>
									<Tab>
										<HiOutlineLink /> &nbsp; Unlisted
									</Tab>
								</TabList>
								<TabPanels>
									<TabPanel>
										{pastes.map(paste => (
											<Paste
												paste={paste}
												key={paste.id}
											/>
										))}
									</TabPanel>
									<TabPanel>
										{pastes
											.filter(p => p.public)
											.map(paste => (
												<Paste
													paste={paste}
													key={paste.id}
												/>
											))}
									</TabPanel>
									<TabPanel>
										{pastes
											.filter(p => p.private)
											.map(paste => (
												<Paste
													paste={paste}
													key={paste.id}
												/>
											))}
									</TabPanel>
									<TabPanel>
										{pastes
											.filter(
												p => !p.private && !p.public
											)
											.map(paste => (
												<Paste
													paste={paste}
													key={paste.id}
												/>
											))}
									</TabPanel>
								</TabPanels>
							</Tabs>
						) : (
							pastes
								.filter(p => p.public)
								.map(paste => (
									<Paste paste={paste} key={paste.id} />
								))
						)
					}
				</WithUser>
				<SignedOut>
					{pastes
						.filter(p => p.public)
						.map(paste => (
							<Paste paste={paste} key={paste.id} />
						))}
				</SignedOut>
			</Container>
		</Layout>
	);
}