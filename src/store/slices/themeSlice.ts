import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// ---------------------------------------------
// Theme Types
// ---------------------------------------------
export type ThemeMode = "light" | "dark";

// Key used for localStorage persistence
const THEME_STORAGE_KEY = "data-explorer-theme";

// ---------------------------------------------
// Initial Theme Detection
// ---------------------------------------------
// Decides which theme to use at app start:
// 1. If running on server → default to "light"
// 2. If a theme was stored in localStorage → use it
// 3. Otherwise, fall back to system preference (prefers-color-scheme)
function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";

  const stored = window.localStorage.getItem(
    THEME_STORAGE_KEY
  ) as ThemeMode | null;
  if (stored === "light" || stored === "dark") return stored;

  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  return prefersDark ? "dark" : "light";
}

// ---------------------------------------------
// Theme Slice State
// ---------------------------------------------
export interface ThemeState {
  mode: ThemeMode;
  watchlist: number[];  // New watchlist array
}

// Initial state uses the detected theme and empty watchlist
const initialState: ThemeState = {
  mode: getInitialTheme(),
  watchlist: [],  // Initialize empty watchlist
};

// ---------------------------------------------
// Theme Slice
// ---------------------------------------------
// Provides two reducers:
// - setTheme: force set a specific theme
// - toggleTheme: switch between light/dark
// - toggleWatchlist: add/remove items from the watchlist
export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    // Force-set theme (light or dark)
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(THEME_STORAGE_KEY, state.mode);
        applyDocumentTheme(state.mode); // apply immediately to <html>
      }
    },

    // Add or remove items from watchlist
    toggleWatchlist: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (state.watchlist.includes(id)) {
        state.watchlist = state.watchlist.filter((item) => item !== id);
      } else {
        state.watchlist.push(id);
      }
    },

    // Toggle between light/dark
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      if (typeof window !== "undefined") {
        window.localStorage.setItem(THEME_STORAGE_KEY, state.mode);
        applyDocumentTheme(state.mode);
      }
    },
  },
});

// Export actions for use in components
export const { setTheme, toggleTheme, toggleWatchlist } = themeSlice.actions;

// Export reducer for store setup
export default themeSlice.reducer;

// ---------------------------------------------
// applyDocumentTheme
// ---------------------------------------------
// Utility to apply the theme by toggling a "dark"
// class on the <html> element (Tailwind convention).
export function applyDocumentTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (mode === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}
