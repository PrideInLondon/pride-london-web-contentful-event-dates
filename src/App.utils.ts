import ids from 'shortid'
import isEqual from 'lodash.isequal'
import {
  Action,
  AppState,
  ContentfulAppState,
  EventDate,
  Payload,
  SerializedEventDate
} from './App.types'

export function addDays(date: Date, days: number): Date {
  const newDate = new Date()
  newDate.setTime(date.getTime())
  newDate.setDate(date.getDate() + days)
  return newDate
}

export function addMonths(date: Date, months: number): Date {
  const newDate = new Date()
  newDate.setMonth(date.getMonth() + months)
  newDate.setDate(date.getDate())
  return newDate
}

export function dateComparator(a: EventDate, b: EventDate) {
  return a.startDate.getTime() - b.startDate.getTime()
}

function createEventDate(state: AppState, payload: Payload): EventDate {
  switch (true) {
    case !!payload.days:
      return {
        id: ids.generate(),
        startDate: addDays(state.dates[state.dates.length - 1].startDate, payload.days as number),
        endDate: addDays(state.dates[state.dates.length - 1].endDate, payload.days as number)
      }
    case !!payload.months:
      return {
        id: ids.generate(),
        startDate: addMonths(
          state.dates[state.dates.length - 1].startDate,
          payload.months as number
        ),
        endDate: addMonths(state.dates[state.dates.length - 1].endDate, payload.months as number)
      }
    default:
      return {
        id: ids.generate(),
        startDate: state.dates[state.dates.length - 1].startDate,
        endDate: state.dates[state.dates.length - 1].endDate
      }
  }
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'CREATE':
      return {
        dates: [...state.dates, createEventDate(state, action.payload)].sort(dateComparator)
      }
    case 'UPDATE':
      return {
        dates: state.dates
          .map(event => {
            if (action.payload && event.id === action.payload.id) {
              return { ...event, ...action.payload }
            }
            return event
          })
          .sort(dateComparator)
      }
    case 'DELETE':
      return {
        dates: state.dates
          .filter(event => {
            if (action.payload) {
              return event.id !== action.payload.id
            }
            return true
          })
          .sort(dateComparator)
      }
    case 'SET':
      if (isEqual(state, action.payload)) {
        return state
      }
      return action.payload
    default:
      return state
  }
}

export function parseDates({ id, startDate, endDate }: SerializedEventDate): EventDate {
  return {
    id,
    startDate: new Date(startDate),
    endDate: new Date(endDate)
  }
}

export function serializeDates({ id, startDate, endDate }: EventDate): SerializedEventDate {
  return {
    id,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString()
  }
}

export function parseContentfulAppState(state: ContentfulAppState) {
  if (!state) {
    return { dates: [{ id: ids.generate(), startDate: new Date(), endDate: new Date() }] }
  }

  return {
    dates: state.dates.map(parseDates)
  }
}
