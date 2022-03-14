import supabaseClient from 'lib/supabase';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function pasteId(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Fetch the paste from supabase
  const { data: pastes, error } = await supabaseClient
    .from('Pastes')
    .select('*')
    .eq('pasteId', req.query.paste);

  // Handle error or no pastes
  if (error || !pastes) {
    return res.status(400).json({ error });
  }

  // Send the paste as response
  res.json({ paste: pastes[0] });
}
