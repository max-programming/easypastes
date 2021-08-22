// Packages
import bcrypt from 'bcryptjs';

// Types
import { NextApiRequest, NextApiResponse } from 'next';
import { PasteType } from 'types';

// Custom files
import base62Encode from 'utils/base62Encode';
import generateRandomString from 'utils/genRandomString';
import swearFilter from 'utils/swearFilter';
import supabaseClient from 'utils/supabase';

// Variables
const salt = bcrypt.genSaltSync(10);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Allow only POST requests
  if (req.method !== 'POST') {
    res.status(400).json({ message: 'Only POST requests allowed.' });
    return;
  }

  /// Get the records from body
  let {
    title,
    description,
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

  // Assign the public and private values to keep the paste unlisted by default, unless explicitly specified
  if (!_public) {
    _public = false;
  }

  if (!_private) {
    _private = false;
  }

  if (language.trim() === '') {
    language = 'none';
  }

  // Variables
  let hasVanity = false;
  let hasPassword = false;

  // Check if it has vanity
  if (pasteId && pasteId.trim() !== '') {
    hasVanity = true;
  }

  // Check if password exists
  if (pastePassword && pastePassword.trim() !== '') {
    hasPassword = true;
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

    pasteId = swearFilter(pasteId);
  } else {
    const { data, error, count } = await supabaseClient
      .from<PasteType>('Pastes')
      .select('*', { count: 'exact' });

    pasteId = base62Encode(count!);
    pasteId = pasteId.length <= 2 ? pasteId += generateRandomString(3): pasteId;
  }

  if (hasPassword) {
    pastePassword = bcrypt.hashSync(pastePassword, salt);
  }

  // Add them to supabase
  const { data, error } = await supabaseClient
    .from<PasteType>('Pastes')
    .insert([
      {
        title: swearFilter(title),
        description: swearFilter(description),
        code,
        language,
        userId,
        pasteId,
        pastePassword,
        public: _public,
        private: _private
      }
    ]);

  // Send back the responses.
  res.json({ data, error });
};

export default handler;
