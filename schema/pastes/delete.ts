import { z } from 'zod';

const PasteDeleteSchema = z.object({
  pasteId: z.string()
});

export default PasteDeleteSchema;
