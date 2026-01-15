import dayjs from 'dayjs'

export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD'

export const endDateBeforeStartDate = (startDate: string, endDate: string) =>
  dayjs(endDate).isBefore(dayjs(startDate))

export const dateRangeIsAllowed = (startDate: string, endDate: string) =>
  dayjs(endDate).diff(dayjs(startDate), 'year', true) <= 1
