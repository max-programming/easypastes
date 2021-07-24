import {
  Box,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  useToast
} from '@chakra-ui/react';
import { SignedIn, WithUser } from '@clerk/clerk-react';
import { useRouter } from 'next/router';
import { FiCopy, FiEdit, FiEdit2, FiMoreHorizontal } from 'react-icons/fi';
import { PasteType } from 'types';

interface Props {
  paste: PasteType;
}

const ActionsButton = ({ paste }: Props) => {
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
      <Tooltip hasArrow label="Options">
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<FiMoreHorizontal />}
            variant="outline"
            size="sm"
          />
          <MenuList>
            <MenuItem icon={<FiCopy />} onClick={copyCode}>
              Copy
            </MenuItem>
            <WithUser>
              {user => (
                <MenuItem
                  icon={<FiEdit2 />}
                  onClick={editCode}
                  hidden={user.id !== paste.userId}
                >
                  Edit
                </MenuItem>
              )}
            </WithUser>
          </MenuList>
        </Menu>
      </Tooltip>
    </Box>
  );
};

export default ActionsButton;
