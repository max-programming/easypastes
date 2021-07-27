import { NextApiRequest, NextApiResponse } from 'next';
import { PasteType } from 'types';
import supabaseClient from 'utils/supabase';
import filterBadWords from 'utils/filterBadWords';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Allow only POST requests
  if (req.method !== 'POST') {
    res.status(400).send({ message: 'Only POST requests allowed.' });
    return;
  }

  // Get the records from body
  let { code, language, title, pasteId, userId, _public, _private } = req.body;

  if (!userId) return res.status(400).send("Can't delete anonymous paste");
  if (code.trim() === '') return res.status(400).send('Code cannot be blank.');
  if (_public && _private)
    return res.status(400).send('Paste cannot be public and private.');
  if (_private && !userId)
    return res.status(400).send('Sign in to create a private paste.');
  if (language.trim() === '') language = 'none';

  // Add them to supabase
  const { data, error } = await supabaseClient
    .from<PasteType>('Pastes')
    .update({
      code,
      language,
      title: filterBadWords(title),
      public: _public,
      private: _private
    })
    .eq('pasteId', pasteId);

  // Debugging
  console.log(data);
  console.log(error);

  // Send back the responses.
  res.status(200).json({ data, error });
};

export default handler;
