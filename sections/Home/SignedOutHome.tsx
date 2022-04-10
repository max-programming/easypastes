import { useRouter } from 'next/router';

import { Button } from '@chakra-ui/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiArrowRight } from 'react-icons/fi';

import supabaseClient from 'lib/supabase';

import filterBadWords from 'utils/filterBadWords';
import { generateNanoid } from 'utils/generateId';

import { ILanguage, PasteType, SetState } from 'types';

interface Props {
  code: string;
  title: string;
  description: string;
  visibility: string;
  language: ILanguage;
  setIsUrlTaken: SetState<boolean>;
}

export default function SignedOutHome(props: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    if (props.code.trim() === '') {
      return toast.error('Code cannot be blank.');
    }
    try {
      setLoading(true);

      let { data, error } = await supabaseClient
        .from<PasteType>('Pastes')
        .insert([
          {
            title: filterBadWords(props.title),
            description: filterBadWords(props.description),
            language: props.language,
            pasteId: generateNanoid(),
            public: props.visibility === 'public',
            code: props.code
          }
        ]);

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
    </div>
  );
}
