import { NextApiRequest, NextApiResponse } from 'next';
import { PasteType } from 'types';
import supabaseClient from 'utils/supabase';
import base62Encode from 'utils/encode';
import filterBadWords from 'utils/filterBadWords';

// Variables
const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const generateRandomString = (numLetters: number) => {
  let id = '';
  let charsLen = chars.length;

  for (let i = 0; i <= numLetters; i++) {
    id += chars.charAt(Math.floor(Math.random() * charsLen));
  }

  return id;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Allow only POST requests
  if (req.method !== 'POST') {
    res.status(400).json({ message: 'Only POST requests allowed.' });
    return;
  }

  /// Get the records from body
  let {
    title,
    code,
    language,
    userId,
    pasteId,
    pastePassword,
    _public,
    _private
  } = req.body;

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

  // Vanity variable
  let hasVanity = false;

  // Check if it has vanity
  if (pasteId && pasteId.trim() !== '') {
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
        .json({ message: 'Custom URL taken. Please try something else.' });

    pasteId = filterBadWords(pasteId);
  } else {
    const { data, error, count } = await supabaseClient
      .from<PasteType>('Pastes')
      .select('*', { count: 'exact' });

    pasteId = base62Encode(count!);

    let id = '';

    if (pasteId.length < 2) {
      id = generateRandomString(3);
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
  res.json({ data, error });
};

export default handler;
