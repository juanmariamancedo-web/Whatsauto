import { configureStore } from "@reduxjs/toolkit";
import avatarReducer from "./avatar";
import themeReducer from "./theme"

const store = configureStore({
    reducer: {
        avatar: avatarReducer,
        theme: themeReducer
    }
})

export default store