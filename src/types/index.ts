import * as z from 'zod'

export const InputFormSchema = z
  .object({
    startDate: z.iso.date(),
    endDate: z.iso.date(),
    location: z.string().trim().min(1, { error: 'Location must not be empty' }),
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
