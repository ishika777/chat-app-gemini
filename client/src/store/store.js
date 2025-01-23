import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user-slice'
import projectReducer from './project-slice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    project: projectReducer
  },
})