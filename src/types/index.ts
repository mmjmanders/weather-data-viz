import { type InferType, object, string } from 'yup'
import dayjs from 'dayjs'

export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD'
export const checkEndDateAfterStartDate = (startDate?: string, endDate?: string) => {
  if (!startDate || !endDate) return true
  return (
    dayjs(startDate).isValid() &&
    dayjs(endDate).isValid() &&
    !dayjs(endDate).isBefore(dayjs(startDate))
  )
}

export const InputFormSchema = object({
  startDate: string()
    .required()
    .test('valid-dates', (value, ctx) => {
      if (!checkEndDateAfterStartDate(value, ctx.parent?.endDate))
        return ctx.createError({ path: 'startDate', message: 'End date must be after start date' })
      return true
    }),
  endDate: string()
    .required()
    .test('valid-dates', (value, ctx) => {
      if (!checkEndDateAfterStartDate(ctx.parent?.startDate, value))
        return ctx.createError({ path: 'startDate', message: 'End date must be after start date' })
      return true
    }),
  location: string().required().trim(),
})

export type InputForm = InferType<typeof InputFormSchema>
