import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { PasteType } from 'types';
import supabaseClient from 'utils/supabase';
import { generateNanoid } from 'utils/generateId';
import filterBadWords from 'utils/filterBadWords';
import { WithSessionProp, withSession } from '@clerk/nextjs/api';

// Variables
const salt = bcrypt.genSaltSync(10);

const handler = async (
  req: WithSessionProp<NextApiRequest>,
  res: NextApiResponse
) => {
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
    // userId,
    pasteId,
    pastePassword,
    _public,
    _private
  } = req.body;

  let userId: string;
  if (req.session) userId = req.session.userId;

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

    pasteId = filterBadWords(pasteId);
  } else {
    pasteId = generateNanoid(12);
  }

  if (hasPassword) {
    pastePassword = bcrypt.hashSync(pastePassword, salt);
  }

  // Add them to supabase
  let { data, error } = await supabaseClient.from<PasteType>('Pastes').insert([
    {
      title: filterBadWords(title),
      description: filterBadWords(description),
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

export default withSession(handler);
