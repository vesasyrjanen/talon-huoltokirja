import { z } from 'zod'

export const createHouseSchema = z.object({
  name: z.string().min(2, 'Anna talolle nimi'),
  addressLine1: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  buildingYear: z.string().optional(),
  buildingType: z.string().optional(),
  areaM2: z.string().optional(),
})
