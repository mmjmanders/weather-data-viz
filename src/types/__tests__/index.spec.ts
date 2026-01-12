import { describe, it, expect } from 'vitest'
import { checkEndDateAfterStartDate } from '@/types'

describe('checkEndDateAfterStartDate', () => {
  it.each([
    { startDate: undefined, endDate: undefined, expected: true, description: 'both undefined' },
    {
      startDate: '2023-01-01',
      endDate: undefined,
      expected: true,
      description: 'endDate undefined',
    },
    {
      startDate: undefined,
      endDate: '2023-01-01',
      expected: true,
      description: 'startDate undefined',
    },
    {
      startDate: '2023-01-01',
      endDate: '2023-01-02',
      expected: true,
      description: 'endDate after startDate',
    },
    {
      startDate: '2023-01-01',
      endDate: '2023-01-01',
      expected: true,
      description: 'endDate same as startDate',
    },
    {
      startDate: '2023-01-02',
      endDate: '2023-01-01',
      expected: false,
      description: 'endDate before startDate',
    },
    {
      startDate: 'invalid-date',
      endDate: '2023-01-01',
      expected: false,
      description: 'invalid startDate',
    },
    {
      startDate: '2023-01-01',
      endDate: 'invalid-date',
      expected: false,
      description: 'invalid endDate',
    },
    {
      startDate: 'invalid-date',
      endDate: 'invalid-date',
      expected: false,
      description: 'both dates invalid',
    },
  ])(
    'should return $expected when $description ($startDate, $endDate)',
    ({ startDate, endDate, expected }) => {
      expect(checkEndDateAfterStartDate(startDate, endDate)).toBe(expected)
    },
  )
})
