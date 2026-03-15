import { configureStore } from "@reduxjs/toolkit/react";
import tableReducer from "./table-slice";

export const store = configureStore({
    reducer: {
        table: tableReducer
    }
});

// 类型推断 
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
