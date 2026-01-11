import { z } from 'zod'
import dayjs from 'dayjs'

export const InputFormSchema = z
  .object({
    startDate: z.string().date(),
    endDate: z.string().date(),
    location: z.string().refine((val) => val?.trim()?.length !== 0),
  })
  .refine(
    ({ startDate, endDate }) =>
      dayjs(endDate).isAfter(startDate) || dayjs(startDate).isSame(endDate),
  )

export type InputForm = z.infer<typeof InputFormSchema>
