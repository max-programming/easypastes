import bcrypt from '@node-rs/bcrypt';

import { HASH_ROUNDS } from '../constants';

export function hash(text: string): string {
  return bcrypt.hashSync(text, HASH_ROUNDS);
}

export function verifyHash(text: string, hash: string): boolean {
  return bcrypt.compareSync(text, hash);
}
