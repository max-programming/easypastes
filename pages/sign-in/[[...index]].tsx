import { Container } from '@chakra-ui/layout';
import { SignIn } from '@clerk/clerk-react';
import Layout from 'components/Layout';

export default function SignInPage() {
	return (
		<Layout title="Sign in">
			<Container mt="10">
				<SignIn path="/sign-in" routing="path" />
			</Container>
		</Layout>
	);
}
