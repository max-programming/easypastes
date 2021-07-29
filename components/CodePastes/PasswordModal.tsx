/* eslint-disable react/no-children-prop */
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  UseDisclosureProps,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement
} from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';
import { HiOutlineKey, HiOutlineLockClosed } from 'react-icons/hi';
import { useState } from 'react';

interface Props {
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
}

const PasswordModal = ({
  isOpen,
  onClose,
  password,
  setPassword
}: UseDisclosureProps & Props) => {
  const [show, setShow] = useState(false);
  const lockPaste = () => {
    onClose();
  };
  const togglePassword = () => setShow(!show);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Set paste password</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Set a password to protect your paste.
          <InputGroup mt="3">
            <InputLeftElement
              pointerEvents="none"
              children={<HiOutlineKey color="gray.300" />}
            />
            <Input
              focusBorderColor="purple.200"
              placeholder="Password"
              pr="4.5rem"
              type={show ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={togglePassword}>
                {show ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" colorScheme="purple" mr="3" onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="purple"
            leftIcon={<HiOutlineLockClosed />}
            onClick={lockPaste}
          >
            Lock
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PasswordModal;
