import { WithAuthProp, withAuth } from '@clerk/nextjs/api';
import { NextApiRequest, NextApiResponse } from 'next';

import supabaseClient from 'lib/supabase';

import filterBadWords from 'utils/filterBadWords';

import { PasteType } from 'types';

const handler = async (
  req: WithAuthProp<NextApiRequest>,
  res: NextApiResponse
) => {
  // Allow only POST requests
  if (req.method !== 'POST') {
    res.status(400).json({ message: 'Only POST requests allowed.' });
    return;
  }

  // Get the records from body
  let { code, language, title, description, pasteId, _public, _private } =
    req.body;

  if (!req.auth)
    return res.status(400).json({ message: 'User must be signed in.' });

  if (code.trim() === '') {
    return res.status(400).json({ message: 'Code cannot be blank.' });
  }

  if (_public && _private) {
    return res
      .status(400)
      .json({ message: 'Paste cannot be public and private.' });
  }

  if (_private && !req.auth.userId) {
    return res
      .status(400)
      .json({ message: 'Sign in to create a private paste.' });
  }

  if (language.trim() === '') {
    language = 'none';
  }

  // Add them to supabase
  const { data, error } = await supabaseClient
    .from<PasteType>('Pastes')
    .update({
      code,
      language,
      title: filterBadWords(title),
      description: filterBadWords(description),
      public: _public,
      private: _private
    })
    .eq('pasteId', pasteId);

  // Debugging
  console.log(data);
  console.log(error);

  res.json({ data, error });
};

export default withAuth(handler);
