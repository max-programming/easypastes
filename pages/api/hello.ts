import { requireSession, RequireSessionProp } from '@clerk/nextjs/api';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(
  req: RequireSessionProp<NextApiRequest>,
  res: NextApiResponse
) {
  res.json({ uid: req.session.userId });
}

export default requireSession(handler);
