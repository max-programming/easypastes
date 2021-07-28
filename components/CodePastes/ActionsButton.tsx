import {
  Box,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalCloseButton,
  Button,
  useToast,
  useDisclosure,
  UseDisclosureProps
} from '@chakra-ui/react';
import { WithUser } from '@clerk/clerk-react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FiCopy, FiEdit2, FiMoreHorizontal, FiTrash2 } from 'react-icons/fi';
import { PasteType } from 'types';

interface Props {
  paste: PasteType;
}

const DeleteModal = ({
  isOpen,
  onClose,
  paste
}: UseDisclosureProps & { paste: PasteType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const deletePaste = async () => {
    setIsLoading(true);
    await axios.post('/api/pastes/delete', {
      pasteId: paste.pasteId,
      userId: paste.userId
    });
    await router.push('/');
    setIsLoading(false);
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Paste</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to delete this paste? This action is
          irreversible
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            variant="ghost"
            colorScheme="red"
            leftIcon={<FiTrash2 />}
            onClick={deletePaste}
            isLoading={isLoading}
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const ActionsButton = ({ paste }: Props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const toast = useToast();
  const router = useRouter();

  const copyCode = () => {
    // Rewrite this for cross-browser support
    navigator.clipboard.writeText(paste.code);
    toast({ title: 'Copied', status: 'success', isClosable: true });
  };
  const editCode = () => {
    router.push(`/pastes/edit/${paste.pasteId}`);
  };
  return (
    <Box position="absolute" right="1" top="1" zIndex="20">
      <DeleteModal isOpen={isOpen} onClose={onClose} paste={paste} />
      <Tooltip hasArrow label="Options">
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<FiMoreHorizontal />}
            variant="ghost"
            colorScheme="purple"
            size="lg"
          />
          <MenuList>
            <MenuItem icon={<FiCopy />} onClick={copyCode}>
              Copy
            </MenuItem>
            <WithUser>
              {user => (
                <>
                  <MenuItem
                    icon={<FiEdit2 />}
                    onClick={editCode}
                    hidden={user.id !== paste.userId}
                  >
                    Edit
                  </MenuItem>
                  <MenuItem
                    icon={<FiTrash2 />}
                    onClick={onOpen}
                    hidden={user.id !== paste.userId}
                    color="red.400"
                  >
                    Delete
                  </MenuItem>
                </>
              )}
            </WithUser>
          </MenuList>
        </Menu>
      </Tooltip>
    </Box>
  );
};

export default ActionsButton;
