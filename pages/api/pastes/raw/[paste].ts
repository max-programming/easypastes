import { WithAuthProp, withAuth } from '@clerk/nextjs/api';
import { NextApiRequest, NextApiResponse } from 'next';

import supabaseClient from 'lib/supabase';

import { PasteType } from 'types';

async function handler(
  req: WithAuthProp<NextApiRequest>,
  res: NextApiResponse
) {
  const { data: pastes, error } = await supabaseClient
    .from<PasteType>('Pastes')
    .select('*')
    // @ts-ignore
    .eq('pasteId', req.query.paste);

  // Handle error and empty pastes
  if (error || pastes.length === 0) return res.send('File not found');

  // Get the first paste
  const paste = pastes[0];

  // Handle private paste
  if (paste.private) {
    if (!req.session || req.session.userId !== paste.userId)
      return res.status(401).send('Private Paste');

    res.send(paste.code);
  }

  res.send(paste.code);
}

export default withAuth(handler);
