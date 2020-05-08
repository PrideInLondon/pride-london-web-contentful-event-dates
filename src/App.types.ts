import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk'

export interface EventDate {
  id: string
  startDate: Date
  endDate: Date
}

export interface AppProps {
  sdk: FieldExtensionSDK
}

export type Payload = {
  days?: number
  months?: number
}

export type Action =
  | { type: 'CREATE'; payload: Payload }
  | { type: 'UPDATE'; payload: Partial<EventDate> }
  | { type: 'DELETE'; payload: Partial<EventDate> }
  | { type: 'SET'; payload: AppState }

export type AppState = {
  dates: EventDate[]
}

export interface SerializedEventDate {
  id: string
  startDate: string
  endDate: string
}

export type ContentfulAppState = { dates: SerializedEventDate[] } | null
