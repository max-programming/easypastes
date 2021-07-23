import {
	Button,
	Container,
	Input,
	useColorModeValue,
	theme,
	Flex
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { ILanguage, PasteType } from 'types';
import axios from 'axios';

// Components imports
import InputCode from 'components/CodePastes/InputCode';
import SelectLanguage from 'components/CodePastes/SelectLanguage';
import PublicPastes from 'components/CodePastes/PublicPastes';
import Visibility from 'components/CodePastes/Visibility';
import Layout from 'components/Layout';
import useSWR from 'swr';
import { v4 } from 'uuid';
import useLocalStorage from 'use-local-storage';

const links = [
	{
		url: '/',
		text: 'Home'
	}
];

export default function Pastes() {
	const { data, error } = useSWR('/api/pastes');
	const [code, setCode] = useState('');
	const [title, setTitle] = useState('');
	const [visibility, setVisibility] = useState('public');
	const [language, setLanguage] = useLocalStorage<ILanguage>(
		'language',
		'none'
	);
	const [loading, setLoading] = useState(false);

	const router = useRouter();

	const handleClick = async () => {
		if (code.trim() === '') return;

		setLoading(true);

		const res = await axios.post('/api/pastes/create', {
			code,
			language,
			title,
			_public: visibility === 'public',
			_private: visibility === 'private',
			userId: window.Clerk?.user?.id,
			pasteId: v4(),
			hasVanity: false
		});

		const { data, error } = res.data;

		if (data) {
			await router.push(`/pastes/${data[0].pasteId}`);
			setLoading(false);
		}
	};

	return (
		<>
			<Layout title="Code Pastes" links={links}>
				<Container maxW="container.xl" my="6">
					{/* Selecting the paste lang */}
					<SelectLanguage
						language={language}
						setLanguage={setLanguage}
					/>

					{/* Setting the title */}
					<Input
						placeholder="Title (optional)"
						value={title}
						onChange={e => setTitle(e.target.value)}
						focusBorderColor={useColorModeValue(
							theme.colors.purple[600],
							theme.colors.purple[200]
						)}
					/>

					{/* Visibility */}
					<Flex justify="center" align="center" my="3">
						<label style={{ marginRight: 8 }}>Visibility: </label>
						<Visibility
							visibility={visibility}
							setVisibility={setVisibility}
						/>
					</Flex>

					{/* Code for the paste */}
					<InputCode
						code={code}
						setCode={setCode}
						langauge={language}
					/>

					{/* Creating button */}
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
						Create
					</Button>
					<PublicPastes publicPastes={data} />
				</Container>
			</Layout>
		</>
	);
}
