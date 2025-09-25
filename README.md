# iGate Data Explorer

A modern data explorer built with React, TypeScript, Vite, Redux, React Query, and ECharts.

---

## Architecture Decisions

- **Component Structure:**  
  The app is organized into `components/` (reusable UI), `hooks/` (custom logic), `lib/` (utilities), `pages/` (page-level components), and `store/` (Redux state). This separation keeps logic modular and maintainable.

- **Custom Hooks:**  
  Filtering, sorting, pagination, and virtualization logic are encapsulated in custom hooks for reusability and clarity.

- **TypeScript:**  
  Used throughout for type safety and better developer experience.

- **Tailwind CSS:**  
  Enables rapid, consistent styling and easy dark mode support.

---

## Redux vs React Query Usage

- **Redux:**  
  Used only for global UI state, specifically theme (light/dark mode). Theme is a cross-cutting concern that needs to be accessed and updated from anywhere in the app, making Redux a good fit.

- **React Query:**  
  Handles all data fetching, caching, and synchronization with the backend. React Query is ideal for server state because it manages loading, error, and refetching logic out of the box, reducing boilerplate and improving reliability.

- **Why not Redux for everything?**  
  Redux is best for client state that is shared across components. React Query is optimized for server state (data from APIs), so using both lets each tool do what it does best.

---

## Performance & UX Strategies

- **Virtualization:**  
  The data table only renders visible rows, dramatically improving performance with large datasets.

- **Memoization:**  
  Filtering and sorting are memoized to avoid unnecessary recalculations.

- **Resource Tracking:**  
  The app warns users if a dataset is very large, helping prevent browser slowdowns.

- **Offline Support:**  
  Data is cached locally using LocalForage, and the app detects offline status to provide a seamless experience.

- **Accessibility:**  
  Keyboard navigation and ARIA attributes are considered, especially for interactive elements like drag-and-drop.

---

## Challenges Faced & Solutions

- **Efficiently Rendering Large Tables:**  
  Rendering thousands of rows caused performance issues. Solved by implementing virtualization, so only visible rows are rendered.

- **Managing Global vs. Server State:**  
  Initially considered Redux for all state, but found React Query better for API data. Refactored to use Redux only for theme and React Query for data fetching.

- **Drag-and-Drop Column Reordering:**  
  Ensuring smooth UX and accessibility was tricky. Used React refs to track the dragged column and handled events carefully to avoid bugs.

- **Offline Data Handling:**  
  Needed to ensure users could still use the app offline. Integrated LocalForage for caching and built a custom hook to detect and handle offline status.

- **Dark/Light Theme Persistence:**  
  Ensured the theme persisted across reloads and matched system preferences by syncing Redux state with localStorage and applying the theme to the `<html>` element.

---

## Getting Started

1. **Install dependencies:**  
   `npm install`

2. **Run the app:**  
   `npm run dev`

3. **Build for production:**  
   `npm run build`

