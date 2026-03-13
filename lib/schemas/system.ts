import { z } from 'zod'

export const systemSchema = z.object({
  category: z.enum([
    'heating',
    'water',
    'electrical',
    'ventilation',
    'drainage',
    'roof',
    'fireplace',
    'security',
    'other',
  ]),
  name: z.string().min(2, 'Anna järjestelmälle nimi'),
  locationText: z.string().optional(),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  description: z.string().optional(),
  criticalInEmergency: z.boolean().optional(),
  installDate: z.string().optional(),
  lastServiceDate: z.string().optional(),
  nextServiceDate: z.string().optional(),
  defaultServiceIntervalDays: z.string().optional(),
  serviceIntervalNote: z.string().optional(),
})
