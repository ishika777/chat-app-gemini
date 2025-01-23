import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  allProjects: [],
  project: null
}

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjects: (state, action) => {
      state.allProjects = action.payload;
    },
    setSingleProject: (state, action) => {
        state.project = action.payload;
    }
  },
})

export const { setProjects, setSingleProject } = projectSlice.actions

export default projectSlice.reducer