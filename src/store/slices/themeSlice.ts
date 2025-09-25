import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
export type ThemeMode = 'light' | 'dark'

const THEME_STORAGE_KEY = 'data-explorer-theme'

function getInitialTheme(): ThemeMode {
    if (typeof window === 'undefined') return 'light'
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null
    if (stored === 'light' || stored === 'dark') return stored
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  }

export interface ThemeState {
    mode: ThemeMode
  }
  
  const initialState: ThemeState = {
    mode: getInitialTheme(),
  }
export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
        state.mode = action.payload
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(THEME_STORAGE_KEY, state.mode)
            applyDocumentTheme(state.mode)
          }
    },
    toggleTheme: (state) => {
        state.mode = state.mode === 'light' ? 'dark' : 'light'
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(THEME_STORAGE_KEY, state.mode)
            applyDocumentTheme(state.mode)
          }
    }
  },
})

export const { setTheme, toggleTheme } = themeSlice.actions
export default themeSlice.reducer

export function applyDocumentTheme(mode: ThemeMode) {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    if (mode === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }