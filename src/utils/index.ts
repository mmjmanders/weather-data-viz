import dayjs from 'dayjs'

export const MINIMUM_DATE = '1940-01-01'
export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD'

export const endDateBeforeStartDate = (startDate: string, endDate: string) =>
  dayjs(endDate).isBefore(dayjs(startDate))

export const dateRangeIsAllowed = (startDate: string, endDate: string) =>
  dayjs(endDate).diff(dayjs(startDate), 'year', true) <= 1
