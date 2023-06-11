import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import filterSlice from "./filterSlice";

export default configureStore({
    reducer: {
        auth: authSlice,
        filter: filterSlice
    },
})