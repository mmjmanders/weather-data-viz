import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import InputForm from '../InputForm.vue'
import dayjs from 'dayjs'
import { DEFAULT_DATE_FORMAT } from '@/types'
import { HTMLInputElement } from 'happy-dom'

describe('InputForm', () => {
  const yesterday = dayjs().subtract(1, 'day').format(DEFAULT_DATE_FORMAT)
  const twoDaysAgo = dayjs().subtract(2, 'day').format(DEFAULT_DATE_FORMAT)

  it('renders the form with all input fields', () => {
    const wrapper = mount(InputForm)

    expect(wrapper.find('label[for="startDate"]').text()).toBe('Start date')
    expect(wrapper.find('input#startDate').exists()).toBe(true)
    expect(wrapper.find('label[for="endDate"]').text()).toBe('End date')
    expect(wrapper.find('input#endDate').exists()).toBe(true)
    expect(wrapper.find('label[for="location"]').text()).toBe('Location')
    expect(wrapper.find('input#location').exists()).toBe(true)
  })

  it('sets initial values for start and end dates to yesterday', () => {
    const wrapper = mount(InputForm)

    const startDateInput = wrapper.find<HTMLInputElement>('input#startDate')
    const endDateInput = wrapper.find<HTMLInputElement>('input#endDate')

    expect(startDateInput.element.value).toBe(yesterday)
    expect(endDateInput.element.value).toBe(yesterday)
  })

  it('sets max date attribute to yesterday for date inputs', () => {
    const wrapper = mount(InputForm)

    const startDateInput = wrapper.find<HTMLInputElement>('input#startDate')
    const endDateInput = wrapper.find<HTMLInputElement>('input#endDate')

    expect(startDateInput.attributes('max')).toBe(yesterday)
    expect(endDateInput.attributes('max')).toBe(yesterday)
  })

  it('emits submit:data event with form values on valid submission', async () => {
    const wrapper = mount(InputForm)

    const startDateInput = wrapper.find('input#startDate')
    const endDateInput = wrapper.find('input#endDate')
    const locationInput = wrapper.find('input#location')

    await startDateInput.setValue(twoDaysAgo)
    await endDateInput.setValue(yesterday)
    await locationInput.setValue('New York')

    // Trigger input events to ensure vee-validate processes the changes
    await startDateInput.trigger('blur')
    await endDateInput.trigger('blur')
    await locationInput.trigger('blur')

    await wrapper.find('form').trigger('submit')

    // Wait for async validation and emission
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(wrapper.emitted('submit:data')).toBeTruthy()
    expect(wrapper.emitted('submit:data')![0]).toEqual([twoDaysAgo, yesterday, 'New York'])
  })

  it('updates input values when user types', async () => {
    const wrapper = mount(InputForm)

    const locationInput = wrapper.find<HTMLInputElement>('input#location')
    await locationInput.setValue('San Francisco')

    expect(locationInput.element.value).toBe('San Francisco')
  })

  it('binds field attributes from vee-validate', () => {
    const wrapper = mount(InputForm)

    const startDateInput = wrapper.find('input#startDate')
    const endDateInput = wrapper.find('input#endDate')
    const locationInput = wrapper.find('input#location')

    expect(startDateInput.attributes('name')).toBe('startDate')
    expect(endDateInput.attributes('name')).toBe('endDate')
    expect(locationInput.attributes('name')).toBe('location')
  })
})
