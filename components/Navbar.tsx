// Thanks to https://chakra-templates.dev/ for this 💗

// Packages
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';

// Icons
import { FaGithub, FaReadme } from 'react-icons/fa';
import { HiMenu, HiX } from 'react-icons/hi';

// Components
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Link,
  Collapse,
  Popover,
  PopoverTrigger,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure
} from '@chakra-ui/react';
import { SignedIn, SignedOut, UserButton, WithUser } from '@clerk/clerk-react';
import { SocialButton } from './Footer';

export default function WithSubnavigation() {
  const router = useRouter();
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <HiX /> : <HiMenu />}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>

        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <NextLink href="/" passHref>
            <Text
              as="a"
              textAlign={useBreakpointValue({
                base: 'center',
                md: 'left'
              })}
              fontFamily={'heading'}
              color={useColorModeValue('gray.800', 'white')}
            >
              <Image src="/logo.png" width={35} height={35} alt="logo" />
            </Text>
          </NextLink>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10} mt={1}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}
          fontFamily="Poppins"
        >
          <SocialButton
            label="GitHub repository"
            href="https://github.com/max-programming/easypastes"
          >
            <FaGithub />
          </SocialButton>

          <SocialButton
            label="About - Blog Post"
            href="https://blog.usman-s.me/introducing-easy-pastes-easiest-way-to-create-and-share-code-pastes"
          >
            <FaReadme />
          </SocialButton>

          <SignedIn>
            <UserButton />
          </SignedIn>

          <SignedOut>
            <NextLink href="/sign-in" passHref>
              <Button
                as={'a'}
                fontSize={'sm'}
                fontWeight={400}
                variant={'link'}
              >
                Sign In
              </Button>
            </NextLink>

            <NextLink href="/sign-up" passHref>
              <Button
                as="a"
                display={{ base: 'none', md: 'inline-flex' }}
                fontSize={'sm'}
                fontWeight={600}
                color={'white'}
                bg={'purple.600'}
                _hover={{
                  bg: 'purple.400'
                }}
              >
                Sign Up
              </Button>
            </NextLink>
          </SignedOut>
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');

  return (
    <Stack direction={'row'} spacing={4}>
      <WithUser>
        {user => (
          <Box fontFamily="Poppins">
            <Popover trigger={'hover'} placement={'bottom-start'}>
              <PopoverTrigger>
                <Link
                  as={NextLink}
                  p={2}
                  href={'/my-pastes'}
                  fontSize={'sm'}
                  fontWeight={500}
                  color={linkColor}
                  _hover={{
                    textDecoration: 'none',
                    color: linkHoverColor
                  }}
                >
                  My Pastes
                </Link>
              </PopoverTrigger>
            </Popover>
          </Box>
        )}
      </WithUser>
    </Stack>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}
      fontFamily="Poppins"
    >
      <WithUser>
        {user => (
          <MobileNavItem
            label="My Pastes"
            href={`/my-pastes`}
            // href={`/user/pastes/${!user.username ? user.id : user.username}`}
          />
        )}
      </WithUser>
    </Stack>
  );
};

const MobileNavItem = ({ label, href }: NavItem) => {
  const { isOpen } = useDisclosure();

  return (
    <Stack spacing={4}>
      <Flex
        py={2}
        as={Link}
        href={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none'
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}
        >
          {label}
        </Text>
      </Flex>
    </Stack>
  );
};

interface NavItem {
  label: string;
  href?: string;
}
