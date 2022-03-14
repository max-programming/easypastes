import { WithSessionProp, withSession } from '@clerk/nextjs/api';
import { NextApiRequest, NextApiResponse } from 'next';

import supabaseClient from 'utils/supabase';

import { PasteType } from 'types';

const handler = async (
  req: WithSessionProp<NextApiRequest>,
  res: NextApiResponse
) => {
  // Allow only POST requests
  if (req.method !== 'POST') {
    res.status(400).json({ message: 'Only POST requests allowed.' });
    return;
  }

  // Get the record from body
  const { pasteId } = req.body;

  if (!req.session)
    return res.status(401).json({ message: 'User must be signed in.' });

  const {
    data: [paste]
  } = await supabaseClient
    .from<PasteType>('Pastes')
    .select('userId')
    .eq('pasteId', pasteId);

  if (paste.userId !== req.session.userId)
    return res.status(401).json({ message: "You can't delete this paste." });

  // Delete from supabase
  const { data, error } = await supabaseClient
    .from<PasteType>('Pastes')
    .delete()
    .eq('pasteId', pasteId);

  // Debugging
  console.log(data);
  console.log(error);

  // Send back the responses.
  res.json({ data, error });
};

export default withSession(handler);
