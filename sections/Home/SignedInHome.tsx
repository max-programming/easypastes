import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { Button, useDisclosure } from '@chakra-ui/react';
import { useAuth } from '@clerk/nextjs';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiArrowRight } from 'react-icons/fi';
import { HiOutlineLockClosed } from 'react-icons/hi';

import supabaseClient from 'lib/supabase';

import filterBadWords from 'utils/filterBadWords';
import { generateNanoid } from 'utils/generateId';

import { ILanguage, PasteType, SetState } from 'types';

const PasswordModalDynamic = dynamic(
  () => import('components/Modal/PasswordModal')
);

interface Props {
  code: string;
  title: string;
  description: string;
  url: string;
  password: string;
  visibility: string;
  language: ILanguage;
  setIsUrlTaken: SetState<boolean>;
  setPassword: SetState<string>;
}

export default function SignedInHome(props: Props) {
  const router = useRouter();

  const { getToken, userId } = useAuth();

  const [loading, setLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleClick = async () => {
    if (props.code.trim() === '') {
      return toast.error('Code cannot be blank.');
    }

    try {
      setLoading(true);

      const token = await getToken({ template: 'supabase' });
      supabaseClient.auth.setAuth(token);

      let { data, error } = await supabaseClient
        .from<PasteType>('Pastes')
        .insert([
          {
            title: filterBadWords(props.title),
            description: filterBadWords(props.description),
            language: props.language,
            pasteId: props.url || generateNanoid(),
            public: props.visibility === 'public',
            private: props.visibility === 'private',
            pastePassword: props.password,
            userId,
            code: props.code
          }
        ]);
      console.log({ addedItem: data });

      if (data) {
        await router.push(`/pastes/${data[0].pasteId}`);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);

      if (error.response.status === 400) {
        props.setIsUrlTaken(true);
        toast.error(error.response.data.message, {
          style: {
            fontFamily: 'Poppins'
          }
        });
      }
    }
  };

  return (
    <div>
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
      {/* <SignedInButton
              code={code}
              language={language}
              title={title}
              description={description}
              visibility={visibility}
              password={password}
              url={url ?? generateNanoid()}
              setIsUrlTaken={setIsUrlTaken}
            /> */}
      <Button
        leftIcon={<HiOutlineLockClosed />}
        colorScheme="purple"
        variant="outline"
        float="right"
        mt="4"
        mr="3"
        onClick={onOpen}
      >
        Set password
      </Button>
      <PasswordModalDynamic
        password={props.password}
        setPassword={props.setPassword}
        isOpen={isOpen}
        onClose={onClose}
      />
    </div>
  );
}
