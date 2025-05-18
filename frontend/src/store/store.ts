import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import serverReducer from "./serverSlice";
const store=configureStore({
    reducer:{
        user:userReducer,
        server:serverReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;