import {
	Box,
	Heading,
	Link,
	UnorderedList,
	ListItem,
	Tag,
	Skeleton,
	SkeletonText,
	Stack
} from '@chakra-ui/react';
import { PasteType } from 'types';
import NextLink from 'next/link';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { zonedTimeToUtc } from 'date-fns-tz';

TimeAgo.addDefaultLocale(en);

interface Props {
	publicPastes: PasteType[];
}

const PublicPastes = ({ publicPastes }: Props) => {
	const timeAgo = new TimeAgo();
	return (
		<Box mt="20">
			<Heading as="h2" size="lg">
				Latest public pastes 🌐
			</Heading>
			<UnorderedList spacing="4" mt="4">
				{!publicPastes ? (
					<Stack>
						{[...Array(8)].map(v => (
							<ListItem key={v} fontSize="lg">
								<Skeleton h="25px" />
							</ListItem>
						))}
					</Stack>
				) : (
					publicPastes.map(paste => (
						<ListItem key={paste.id} fontSize="lg">
							{paste.title ? (
								<Link as={NextLink} href={`/pastes/${paste.pasteId}`}>
									<a>
										{paste.title} -{' '}
										<Tag variant="solid" colorScheme="purple">
											{paste.language} |{' '}
											{timeAgo.format(zonedTimeToUtc(paste.createdAt, 'gmt'))}
										</Tag>
									</a>
								</Link>
							) : (
								<Link as={NextLink} href={`/pastes/${paste.pasteId}`}>
									<a>
										Untitled -{' '}
										<Tag variant="solid" colorScheme="purple">
											{paste.language} |{' '}
											{timeAgo.format(zonedTimeToUtc(paste.createdAt, 'gmt'))}
										</Tag>
									</a>
								</Link>
							)}
						</ListItem>
					))
				)}
				{}
			</UnorderedList>
		</Box>
	);
};

export default PublicPastes;
