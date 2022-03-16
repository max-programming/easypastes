import bcrypt from 'bcryptjs';

import { HASH_ROUNDS } from '../constants';

const salt = bcrypt.genSaltSync(HASH_ROUNDS);

export function hash(text: string): string {
  return bcrypt.hashSync(text, salt);
}

export function verifyHash(text: string, hash: string): boolean {
  return bcrypt.compareSync(text, hash);
}
