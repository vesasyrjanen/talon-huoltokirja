import { z } from 'zod'

export const maintenanceSchema = z.object({
  title: z.string().min(2, 'Anna huollolle otsikko'),
  eventType: z.enum(['maintenance', 'repair', 'inspection', 'service', 'other']),
  performedOn: z.string().min(1, 'Anna päivämäärä'),
  costAmount: z.string().optional(),
  contractorName: z.string().optional(),
  description: z.string().optional(),
  nextDueDate: z.string().optional(),
})
