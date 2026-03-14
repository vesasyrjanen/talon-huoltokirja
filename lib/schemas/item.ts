import { z } from "zod";

export const itemSchema = z.object({
  houseId: z.string().uuid(),
  name: z.string().min(1, "Nimi on pakollinen."),
  category: z.string().optional().or(z.literal("")),
  brand: z.string().optional().or(z.literal("")),
  model: z.string().optional().or(z.literal("")),
  serialNumber: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  purchaseDate: z.string().optional().or(z.literal("")),
  purchasePrice: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  archived: z.boolean().optional().default(false),
});

export type ItemInput = z.infer<typeof itemSchema>;
