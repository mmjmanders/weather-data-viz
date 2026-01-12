import { describe, it, expect } from 'vitest'
import { checkEndDateAfterStartDate, InputFormSchema } from '@/types'

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

describe('InputFormSchema', () => {
  it('should validate a valid input', async () => {
    const validInput = {
      startDate: '2023-01-01',
      endDate: '2023-01-02',
      location: 'London',
    }
    await expect(InputFormSchema.validate(validInput)).resolves.toEqual(validInput)
  })

  it('should fail if required fields are missing', async () => {
    const invalidInput = {}
    await expect(InputFormSchema.validate(invalidInput)).rejects.toThrow()
  })

  it('should fail if location is empty or only whitespace', async () => {
    const invalidInput = {
      startDate: '2023-01-01',
      endDate: '2023-01-02',
      location: '  ',
    }
    await expect(InputFormSchema.validate(invalidInput)).rejects.toThrow()
  })

  it('should fail if endDate is before startDate', async () => {
    const invalidInput = {
      startDate: '2023-01-02',
      endDate: '2023-01-01',
      location: 'London',
    }
    await expect(InputFormSchema.validate(invalidInput)).rejects.toThrow(
      'End date must be after start date',
    )
  })

  it('should fail if dates are invalid', async () => {
    const invalidInput = {
      startDate: 'invalid',
      endDate: '2023-01-01',
      location: 'London',
    }
    await expect(InputFormSchema.validate(invalidInput)).rejects.toThrow()
  })
})
