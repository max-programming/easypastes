import { z } from 'zod';

const PasteCreateSchema = z.object({
  title: z.string(),
  description: z.string(),
  code: z.string(),
  language: z.string().default('none'),
  pasteId: z.string(),
  pastePassword: z.string().optional(),
  _public: z.boolean().default(false),
  _private: z.boolean().default(false)
});

export default PasteCreateSchema;
