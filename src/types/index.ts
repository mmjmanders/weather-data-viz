import * as z from 'zod'

export const InputFormSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  location: z.string().trim(),
})

export type InputForm = z.Infer<typeof InputFormSchema>
