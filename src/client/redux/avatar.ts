import { createSlice } from "@reduxjs/toolkit";

const avatarSlice = createSlice({
    name: "avatar",
    initialState: {style: "", seed: ""},
    reducers: {
      changeStyle(state, action: {payload: string}){
        state.style = action.payload
      },
      changeSeed(state, action: {payload: string}){
        state.seed = action.payload
      }
    }
  })

export const {changeStyle, changeSeed} = avatarSlice.actions
export default avatarSlice.reducer