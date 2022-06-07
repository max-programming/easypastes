import { z } from 'zod';

const PasteUpdateSchema = z.object({
  pasteId: z.string(),
  title: z.string(),
  description: z.string(),

  code: z.string().transform(value => value.trim()),
  language: z
    .string()
    .default('none')
    .transform(value => value.trim()),

  _public: z.boolean().default(false),
  _private: z.boolean().default(false)
});

export default PasteUpdateSchema;
