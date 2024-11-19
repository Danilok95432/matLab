import { configureStore } from '@reduxjs/toolkit'
import resolutionReducer from './resolution'

export const store = configureStore({
  reducer: {
    resolution: resolutionReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
