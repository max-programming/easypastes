import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  UseDisclosureProps,
  Text,
  Center,
  Divider,
  Box,
  IconButton,
  useMediaQuery,
  useColorModeValue,
  Tooltip
} from '@chakra-ui/react';
import ClipLoader from 'react-spinners/ClipLoader';
import useSWR from 'swr';
import { PasteType } from 'types';
import formatTimeAgo from 'utils/formatTimeAgo';
import DisplayCode from './DisplayCode';
import supabaseClient from 'utils/supabase';
import Link from 'next/link';
import { HiExternalLink } from 'react-icons/hi';

const fetchPaste = async (key: string): Promise<PasteType> => {
  const { data, error } = await supabaseClient
    .from<PasteType>('Pastes')
    .select('*')
    .filter('pasteId', 'eq', key);

  if (error || !data) return;
  const paste = data[0];
  return paste;
};

const PasteModal = ({
  isOpen,
  onClose,
  pasteId
}: UseDisclosureProps & { pasteId: string }) => {
  const [matches] = useMediaQuery('(max-width: 500px)');
  const spinnerColor = useColorModeValue('black', 'white');
  const { data: paste } = useSWR(pasteId, fetchPaste);

  return (
    <Box mx="5">
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        size={matches ? 'xs' : '3xl'}
      >
        <ModalOverlay />
        <ModalContent>
          {!paste ? (
            <Center p="15">
              <ClipLoader color={spinnerColor} />
            </Center>
          ) : (
            <>
              <ModalHeader fontSize={['lg', '2xl']}>
                <Link href={`/pastes/${paste.pasteId}`}>
                  <a target="_blank">
                    {paste.title}
                    <Tooltip hasArrow label="Open in new tab" fontSize="sm">
                      <IconButton
                        variant="ghost"
                        aria-label="Open in new tab"
                        fontSize="20px"
                        ml={5}
                        icon={<HiExternalLink />}
                      />
                    </Tooltip>
                  </a>
                </Link>
              </ModalHeader>
              <ModalCloseButton />

              <Divider />
              <ModalBody position="relative" my="3">
                <Text p="2">{paste.description || 'No Description'}</Text>

                <Text p="2" fontSize="lg">
                  Created <strong>{formatTimeAgo(paste.createdAt)}</strong>
                </Text>

                <DisplayCode paste={paste} language={paste.language} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PasteModal;
