import { NextApiRequest, NextApiResponse } from 'next';
import { PasteType } from 'types';
import supabaseClient from 'utils/supabase';
import base62Encode from 'utils/encode';
import filterBadWords from 'utils/filterBadWords';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const chars =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // Allow only POST requests
  if (req.method !== 'POST') {
    res.status(400).send({ message: 'Only POST requests allowed.' });
    return;
  }

  /// Get the records from body
  let { title, code, language, userId, pasteId, _public, _private } = req.body;

  // Vanity variable
  let hasVanity = false;

  // Check if it has vanity
  if (pasteId.trim() !== '') {
    hasVanity = true;
  }

  // If it has vanity, Verify if it's not taken.
  if (hasVanity) {
    const { data, error } = await supabaseClient
      .from<PasteType>('Pastes')
      .select('*')
      .eq('pasteId', pasteId);

    // Is vanity taken?
    if (data.length !== 0)
      return res
        .status(400)
        .send({ message: 'Custom URL taken. Please try something else.' });

    pasteId = filterBadWords(pasteId);
  } else {
    const { data, error, count } = await supabaseClient
      .from<PasteType>('Pastes')
      .select('*', { count: 'exact' });

    pasteId = base62Encode(count!);

    let id = '';
    let charsLen = chars.length;

    if (pasteId.length < 2) {
      for (let i = 0; i <= 3; i++) {
        id += chars.charAt(Math.floor(Math.random() * charsLen));
      }
    }

    pasteId += id;
  }

  // Add them to supabase
  const { data, error } = await supabaseClient
    .from<PasteType>('Pastes')
    .insert([
      {
        title: filterBadWords(title),
        code,
        language,
        userId,
        pasteId,
        public: _public,
        private: _private
      }
    ]);

  // Send back the responses.
  res.status(200).json({ data, error });
};

export default handler;
