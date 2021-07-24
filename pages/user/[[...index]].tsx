import { UserProfile } from '@clerk/clerk-react';
import { Container } from '@chakra-ui/layout';
import Layout from 'components/Layout';

export default function UserProfilePage() {
	return (
		<Layout title="User Profile">
			<Container mt="10" maxW="full" maxH="full">
				<UserProfile path="/user" routing="path" />
			</Container>
		</Layout>
	);
}
