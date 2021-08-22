// Types
import { NextApiRequest, NextApiResponse } from 'next';
import { PasteType } from 'types';

// Custom files
import swearFilter from 'utils/swearFilter';
import supabaseClient from 'utils/supabase';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Allow only POST requests
  if (req.method !== 'POST') {
    res.status(400).json({ message: 'Only POST requests allowed.' });
    return;
  }

  // Get the records from body
  let {
    code,
    language,
    title,
    description,
    pasteId,
    userId,
    _public,
    _private
  } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'Cannot delete anonymous paste' });
  }

  if (code.trim() === '') {
    return res.status(400).json({ message: 'Code cannot be blank.' });
  }

  if (_public && _private) {
    return res
      .status(400)
      .json({ message: 'Paste cannot be public and private.' });
  }

  if (_private && !userId) {
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
      title: swearFilter(title),
      description: swearFilter(description),
      public: _public,
      private: _private
    })
    .eq('pasteId', pasteId);

  // Debugging
  console.log(data);
  console.log(error);

  // Send back the responses.
  res.json({ data, error });
};

export default handler;
