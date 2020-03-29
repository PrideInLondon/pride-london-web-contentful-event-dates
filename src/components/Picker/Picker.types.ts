export interface PickerProps {
  onDateChange: (date: Date, id: string) => void
  date: Date
  id: string
}
