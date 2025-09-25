import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "./slices/themeSlice";
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector


export const store = configureStore({
  reducer: {
    theme: themeSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch