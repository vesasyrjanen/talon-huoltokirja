import { z } from 'zod'

export const documentMetaSchema = z.object({
  title: z.string().min(2, 'Anna dokumentille nimi'),
  category: z.enum(['manual', 'drawing', 'report', 'photo', 'receipt', 'other']),
  description: z.string().optional(),
})
