import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
    name: "theme",
    initialState: {theme: "ligth"},
    reducers: {
      toggleTheme(state){
        if(state.theme == "light"){
            state.theme = "dark"
        }else{
            state.theme = "light"
        }
      },
      changeTheme(state, action: {payload: "light" | "dark"}){
        state.theme = action.payload
      }
    }
  })

export const {toggleTheme, changeTheme } = themeSlice.actions
export default themeSlice.reducer