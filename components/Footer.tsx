// Thanks to https://chakra-templates.dev/ for this 💗
import {
  Box,
  chakra,
  Container,
  Stack,
  Text,
  VisuallyHidden
} from '@chakra-ui/react';
import { FaGithub, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { ReactNode } from 'react';

export const SocialButton = ({
  children,
  label,
  href
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <chakra.button
      bg="whiteAlpha.100"
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      target="_blank"
      _hover={{
        bg: 'whiteAlpha.200'
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export default function Footer() {
  return (
    <Box bg="gray.900" color="gray.200" fontFamily="Poppins">
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Text as="b">
          Made with 💗 by{' '}
          <a
            href="https://twitter.com/MaxProgramming1"
            target="_blank"
            rel="noreferrer"
          >
            @MaxProgramming1
          </a>{' '}
          and{' '}
          <a
            href="https://twitter.com/janaSunrise"
            target="_blank"
            rel="noreferrer"
          >
            @janaSunrise
          </a>
        </Text>
        <Stack direction={'row'} spacing={6}>
          <SocialButton
            label={'GitHub'}
            href="https://github.com/max-programming"
          >
            <FaGithub />
          </SocialButton>
          <SocialButton
            label={'Twitter'}
            href="https://twitter.com/MaxProgramming1"
          >
            <FaTwitter />
          </SocialButton>
          <SocialButton
            label={'YouTube'}
            href="https://youtube.com/MaxProgramming"
          >
            <FaYoutube />
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  );
}
