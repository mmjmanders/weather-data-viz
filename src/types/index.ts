import * as z from 'zod'
import { endDateBeforeStartDate, dateRangeIsAllowed } from '@/utils'

export const InputFormSchema = z
  .object({
    startDate: z.iso.date(),
    endDate: z.iso.date(),
    location: z.string().trim().min(1, { error: 'Location must not be empty' }),
  })
  .superRefine(({ startDate, endDate }, ctx) => {
    if (endDateBeforeStartDate(startDate, endDate)) {
      ctx.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'End date cannot be before start date',
      })
    } else if (!dateRangeIsAllowed(startDate, endDate)) {
      ctx.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'Date range must be at most one year',
      })
    }
  })
  .strip()

export type InputForm = z.infer<typeof InputFormSchema>

export const ReverseGeolocationSchema = z
  .object({
    place_id: z.string(),
    display_name: z.string(),
  })
  .strip()

export type ReverseGeolocation = z.infer<typeof ReverseGeolocationSchema>

export const GeolocationSchema = z
  .object({
    lat: z.coerce.number(),
    lon: z.coerce.number(),
  })
  .strip()

export type Geolocation = z.infer<typeof GeolocationSchema>
