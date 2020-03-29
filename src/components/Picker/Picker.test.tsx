import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import { Picker } from './Picker'
import { formatDate } from './Picker.utils'
import '@testing-library/jest-dom'

const props = {
  onDateChange: jest.fn(),
  date: new Date(),
  id: 'test123'
}

it('should should toggle the datepicker when clicking the button', () => {
  const { getByTestId, getByLabelText, queryByLabelText } = render(<Picker {...props} />)
  fireEvent.click(getByTestId('datepicker-button'))
  expect(getByLabelText('Previous Month')).toBeInTheDocument()
  fireEvent.click(getByTestId('datepicker-button'))
  expect(queryByLabelText('Previous Month')).not.toBeInTheDocument()
})

it('should set the date when one is selected', async () => {
  const date = new Date()
  date.setDate(1)

  const { getByTestId, getAllByRole } = render(<Picker {...props} />)

  fireEvent.click(getByTestId('datepicker-button'))
  fireEvent.click(getAllByRole('option')[0])

  expect((getByTestId('datepicker-input') as HTMLInputElement).value).toEqual(formatDate(date))
})
