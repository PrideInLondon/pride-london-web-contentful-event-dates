import React, { useEffect, useMemo, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Button, Icon } from '@contentful/forma-36-react-components'
import ids from 'shortid'
import { PickerProps } from './Picker.types'
import { formatDate } from './Picker.utils'

export const Picker: React.FC<PickerProps> = ({ onDateChange, date, id, ...props }) => {
  const [eventDate, setDate] = useState<Date>(date || new Date())
  const [open, setOpen] = useState<boolean>(false)
  const ref = useRef<HTMLDivElement>(null)
  const dropdownId = useMemo(() => ids.generate(), [])

  const handleClick = (e: Event): void => {
    if (ref && ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(false)
      return
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [])

  return (
    <div ref={ref} {...props}>
      <div className="datepicker-wrapper">
        <input
          data-testid="datepicker-input"
          aria-hidden="true"
          type="text"
          value={formatDate(eventDate)}
          onFocus={() => setOpen(true)}
          onChange={() => {
            return
          }}
        />
        <Button
          buttonType="positive"
          aria-label={open ? 'Close datepicker' : 'Open datepicker'}
          aria-haspopup="true"
          aria-expanded={open}
          aria-controls={dropdownId}
          onClick={() => setOpen(!open)}
          data-testid="datepicker-button">
          <Icon icon={open ? 'ArrowUp' : 'ArrowDown'} color="white" />
        </Button>
      </div>

      {open && (
        <div aria-hidden={!open} id={dropdownId}>
          <DatePicker
            selected={eventDate}
            onChange={(pickedDate: Date) => {
              setDate(pickedDate)
              onDateChange(pickedDate, id)
            }}
            showTimeInput
            timeFormat="HH:mm"
            dateFormat="MMMM d, yyyy h:mm aa"
            inline
          />
        </div>
      )}
    </div>
  )
}
