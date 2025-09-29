import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "./slices/themeSlice";
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux'

// ----------------------------------------------------
// Typed Redux Hooks
// ----------------------------------------------------
// Instead of importing `useDispatch` and `useSelector` everywhere,
// we export typed versions that are aware of our store types.
//
// - useAppDispatch → typed version of dispatch()
// - useAppSelector → typed version of useSelector()
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// ----------------------------------------------------
// Store Configuration
// ----------------------------------------------------
// Combine all slices (reducers) into a single Redux store.
// Here we only have one slice: `themeSlice`.
export const store = configureStore({
  reducer: {
    theme: themeSlice,
  },
})

// ----------------------------------------------------
// Type Helpers
// ----------------------------------------------------
// RootState → global state type (inferred from store.getState)
// AppDispatch → dispatch function type (inferred from store.dispatch)
//
// These are used to strongly type components and hooks.
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
