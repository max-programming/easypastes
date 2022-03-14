import type { NextApiResponse } from 'next';

export default function restrictHttpMethods(
  currentMethod: string,
  allowedMethods: string[],
  res: NextApiResponse
): {
  error: boolean;
} {
  if (!allowedMethods.includes(currentMethod)) {
    return { error: false };
  } else {
    let message = `Only ${allowedMethods.join(', ')} requests allowed.`;

    res.status(400).json({ message });

    return { error: true };
  }
}
