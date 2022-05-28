import { useRouter } from 'next/router';

import { Button } from '@chakra-ui/react';
import { GetSessionTokenOptions } from '@clerk/types';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiArrowRight } from 'react-icons/fi';

import filterBadWords from 'utils/filterBadWords';
import { generateNanoid } from 'utils/generateId';
import supabaseClient from 'utils/supabase';

import { ILanguage, PasteType } from 'types';

type GetToken = (options?: GetSessionTokenOptions) => Promise<string>;

interface ButtonProps {
  code: string;
  language: string;
  title: string;
  description: string;
  visibility: string;
  url?: string;
  password?: string;
  isSignedIn: boolean;
  userId?: string;
  setIsUrlTaken: (v: boolean) => void;
  getToken?: GetToken;
}

const HomePage_CreateButton = ({
  code,
  language,
  title,
  description,
  visibility,
  url,
  password,
  isSignedIn,
  userId,
  setIsUrlTaken,
  getToken
}: ButtonProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    if (code.trim() === '') {
      return toast.error('Code cannot be blank.', {
        style: {
          fontFamily: 'Poppins'
        }
      });
    }
    try {
      setLoading(true);
      const token = await getToken({ template: 'supabase' });
      supabaseClient.auth.setAuth(token);
      let { data, error } = await supabaseClient
        .from<PasteType>('Pastes')
        .insert([
          {
            title: filterBadWords(title),
            description: filterBadWords(description),
            language: language as ILanguage,
            public: visibility === 'public',
            pastePassword: isSignedIn && password,
            pasteId: isSignedIn ? url : generateNanoid(),
            private: isSignedIn && visibility === 'private',
            userId: isSignedIn && userId,
            code
          }
        ]);

      if (data) {
        await router.push(`/pastes/${data[0].pasteId}`);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      if (error.response.status === 400) {
        setIsUrlTaken(true);
        toast.error(error.response.data.message, {
          style: {
            fontFamily: 'Poppins'
          }
        });
      }
    }
  };
  return (
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
      className={isSignedIn ? 'Signed in' : 'Signed out'}
    >
      Create
    </Button>
  );
};

export { HomePage_CreateButton };
