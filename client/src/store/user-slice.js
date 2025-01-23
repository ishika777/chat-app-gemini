import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  allUsers: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setAllUsers: (state, action) => {
        state.allUsers = action.payload
    }
  },
})

export const { setUser, setAllUsers } = userSlice.actions

export default userSlice.reducer