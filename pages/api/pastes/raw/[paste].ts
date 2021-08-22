// Packages
import axios from 'axios';

// Types
import { NextApiRequest, NextApiResponse } from 'next';
import { PasteType, User } from 'types';

// Custom files
import supabaseClient from 'utils/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { data: pastes, error } = await supabaseClient
    .from<PasteType>('Pastes')
    .select('*')
    // @ts-ignore
    .eq('pasteId', req.query.paste);

  const paste = pastes[0];
  if (paste.private && paste.userId) {
    const { data: users } = await axios.get<Array<User>>(
      'https://api.clerk.dev/v1/users?limit=100',
      {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_API_KEY}`
        }
      }
    );
    const currentUser = users.find(user => user.id === paste.userId);
    return currentUser ? res.send(paste.code) : res.send('Private paste');
  }
  if (error || pastes.length === 0) return res.send('File not found');
  if (paste.private) return res.send('Private paste');

  res.send(paste.code);
}
