import { NextApiRequest, NextApiResponse } from 'next';
import supabaseClient from 'utils/supabase';

export default async function pasteId(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// Fetch the paste from supabase
	const { data: pastes, error } = await supabaseClient
		.from('Pastes')
		.select('*')
		.eq('id', req.query.paste);

	// Debug logging
	console.log(pastes);

	// Handle error or no pastes
	if (error || !pastes) {
		return res.send(error);
	}

	// Send the paste as response
	res.send(pastes[0]);
}
