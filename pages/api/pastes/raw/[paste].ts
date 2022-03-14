import { WithSessionProp, withSession } from '@clerk/nextjs/api';
import { NextApiRequest, NextApiResponse } from 'next';

import supabaseClient from 'utils/supabase';

import { PasteType } from 'types';

async function handler(
  req: WithSessionProp<NextApiRequest>,
  res: NextApiResponse
) {
  const { data: pastes, error } = await supabaseClient
    .from<PasteType>('Pastes')
    .select('*')
    // @ts-ignore
    .eq('pasteId', req.query.paste);

  if (error || pastes.length === 0) return res.send('File not found');
  const paste = pastes[0];
  if (paste.private) {
    if (!req.session || req.session.userId !== paste.userId)
      return res.status(401).send('Private Paste');
    res.send(paste.code);
  }

  res.send(paste.code);
}

export default withSession(handler);
