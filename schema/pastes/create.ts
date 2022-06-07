import { z } from 'zod';

const PasteCreateSchema = z.object({
  title: z.string(),
  description: z.string(),

  code: z.string().transform(value => value.trim()),
  language: z
    .string()
    .default('none')
    .transform(value => value.trim()),

  pasteId: z.string().transform(value => value.trim()),
  pastePassword: z
    .string()
    .optional()
    .transform(value => {
      if (value && value.trim() !== '') {
        return value.trim();
      } else {
        return undefined;
      }
    }),

  _public: z.boolean().default(false),
  _private: z.boolean().default(false)
});

export default PasteCreateSchema;
