import * as z from 'zod'
import { endDateBeforeStartDate, dateRangeIsAllowed } from '@/utils'
import dayjs from 'dayjs'

export const InputFormSchema = z
  .object({
    startDate: z.iso.date(),
    endDate: z.iso.date(),
    location: z.nullish(z.string()),
    useLocationApi: z.boolean().default(false),
  })
  .superRefine(({ startDate, endDate, location, useLocationApi }, ctx) => {
    if (!useLocationApi && !location?.trim()?.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['location'],
        message: 'Location must be entered',
      })
    }
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
    place_id: z.nullish(z.string()),
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

export const HistoricalWeatherDailyUnitsSchema = z.object({
  time: z.string(),
  temperature_2m_mean: z.string(),
  sunshine_duration: z.string(),
  precipitation_sum: z.string(),
})

export const HistoricalWeatherDailySchema = z.object({
  time: z.array(z.iso.date()),
  temperature_2m_mean: z.array(z.nullish(z.number())),
  sunshine_duration: z.array(z.nullish(z.number())),
  precipitation_sum: z.array(z.nullish(z.number())),
})

export const HistoricalWeatherSchema = z
  .object({
    daily_units: HistoricalWeatherDailyUnitsSchema,
    daily: HistoricalWeatherDailySchema,
  })
  .strip()
  .transform(({ daily, daily_units }) => ({
    daily: {
      time: daily.time.map((time) => dayjs(time).toDate()),
      temperature_2m_mean: daily.temperature_2m_mean.map((temperature) => temperature ?? 0),
      sunshine_duration: daily.sunshine_duration.map((duration) => {
        const seconds = duration ?? 0
        return seconds / 3600
      }),
      precipitation_sum: daily.precipitation_sum.map((precipitation) => precipitation ?? 0),
    },
    daily_units,
  }))

export type HistoricalWeatherDailyUnits = z.infer<typeof HistoricalWeatherDailyUnitsSchema>
export type HistoricalWeatherDaily = z.infer<typeof HistoricalWeatherDailySchema>
export type HistoricalWeather = z.infer<typeof HistoricalWeatherSchema>
