import { NextApiRequest, NextApiResponse } from 'next';
import { PasteType } from 'types';
import supabaseClient from 'utils/supabase';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Allow only POST requests
  if (req.method !== 'POST') {
    res.status(400).send({ message: 'Only POST requests allowed.' });
    return;
  }

  // Get the records from body
  const { pasteId } = req.body;

  // Add them to supabase
  const { data, error } = await supabaseClient
    .from<PasteType>('Pastes')
    .delete()
    .eq('pasteId', pasteId);

  // Debugging
  console.log(data);
  console.log(error);

  // Send back the responses.
  res.status(200).json({ data, error });
};

export default handler;
