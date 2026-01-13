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
