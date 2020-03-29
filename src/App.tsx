import React, { useCallback, useEffect, useLayoutEffect, useMemo, useReducer } from 'react'
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@contentful/forma-36-react-components'
import { Picker } from './components/Picker/Picker'
import '@contentful/forma-36-react-components/dist/styles.css'
import '@contentful/forma-36-tokens/dist/css/index.css'
import '@contentful/forma-36-fcss/dist/styles.css'
import './index.scss'
import { AppProps, AppState, ContentfulAppState, EventDate } from './App.types'
import { parseContentfulAppState, reducer, serializeDates } from './App.utils'

export const App: React.FC<AppProps> = ({ sdk }) => {
  const initialState = useMemo((): AppState => parseContentfulAppState(sdk.field.getValue()), [
    sdk.field
  ])

  const [state, dispatch] = useReducer(reducer, initialState)

  const onChange = useCallback(
    async (state: AppState) => {
      if (state) {
        await sdk.field.setValue({ dates: state.dates.map(serializeDates) })
      } else {
        await sdk.field.removeValue()
      }
    },
    [sdk.field]
  )

  useEffect(() => {
    onChange(state)
  }, [onChange, state])

  useEffect(() => {
    const detachExternalChangeHandler = sdk.field.onValueChanged((value: ContentfulAppState) => {
      dispatch({ type: 'SET', payload: parseContentfulAppState(value) })
    })

    return () => {
      if (detachExternalChangeHandler) {
        detachExternalChangeHandler()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useLayoutEffect(() => {
    sdk.window.startAutoResizer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Table className="f36-margin-bottom--s">
        <TableHead>
          <TableRow>
            <TableCell>Start Date/Time</TableCell>
            <TableCell>End Date/Time</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {state.dates.map((date: EventDate) => (
            <TableRow key={date.id} data-testid="event-row">
              <TableCell>
                <Picker
                  data-testid="start-picker"
                  onDateChange={(startDate, id) =>
                    dispatch({ type: 'UPDATE', payload: { id, startDate } })
                  }
                  date={date.startDate}
                  id={date.id}
                />
              </TableCell>
              <TableCell>
                <Picker
                  data-testid="end-picker"
                  onDateChange={(endDate, id) =>
                    dispatch({ type: 'UPDATE', payload: { id, endDate } })
                  }
                  date={date.endDate}
                  id={date.id}
                />
              </TableCell>
              <TableCell>
                <Button
                  disabled={state.dates.length <= 1}
                  onClick={() => {
                    if (state.dates.length > 1) {
                      dispatch({ type: 'DELETE', payload: { id: date.id } })
                    }
                  }}>
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        data-testid="same-day"
        className="f36-margin-right--s"
        onClick={() => {
          dispatch({ type: 'CREATE', payload: 0 })
        }}>
        Add for same day
      </Button>
      <Button
        data-testid="next-day"
        className="f36-margin-right--s"
        onClick={() => {
          dispatch({ type: 'CREATE', payload: 1 })
        }}>
        Add for next day
      </Button>
      <Button
        data-testid="next-week"
        onClick={() => {
          dispatch({ type: 'CREATE', payload: 7 })
        }}>
        Add for next week
      </Button>
    </>
  )
}
