import { NextApiRequest, NextApiResponse } from 'next';
import { PasteType } from 'types';
import supabaseClient from 'utils/supabase';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Allow only POST requests
  if (req.method !== 'POST') {
    res.status(400).json({ message: 'Only POST requests allowed.' });
    return;
  }

  // Get the records from body
  const { pasteId, userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'Cannot delete anyonymous paste' });
  }

  // Add them to supabase
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

export default handler;
