import { RequireAuthProp, requireAuth } from '@clerk/nextjs/api';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(
  req: RequireAuthProp<NextApiRequest>,
  res: NextApiResponse
) {
  res.json({ uid: req.session.userId });
}

export default requireAuth(handler);
