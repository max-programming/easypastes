import { WithAuthProp, withAuth } from '@clerk/nextjs/api';
import { NextApiRequest, NextApiResponse } from 'next';
import PasteDeleteSchema from 'schema/pastes/delete';

import supabaseClient from 'lib/supabase';

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

  if (!req.session)
    return res.status(401).json({ message: 'User must be signed in.' });

  // Validate schema
  const { pasteId } = PasteDeleteSchema.parse(req.body);

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

  res.json({ data, error });
};

export default withAuth(handler);
