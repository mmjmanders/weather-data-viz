import * as z from 'zod'

export const InputFormSchema = z
  .object({
    startDate: z.iso.date(),
    endDate: z.iso.date(),
    location: z.string().trim().min(1, { error: 'Location must not be empty' }),
  })
  .strip()

export type InputForm = z.infer<typeof InputFormSchema>
