iGate Data Explorer

A modern data exploration tool built with React, TypeScript, Vite, Redux, React Query, and ECharts. It offers an intuitive interface for exploring datasets with advanced features such as sorting, filtering, pagination, and column reordering.

Table of Contents

-> Architecture Decisions

-> React Design Patterns

-> Redux vs React Query Usage

-> Performance & UX Strategies

-> Challenges Faced & Solutions

-> Getting Started

-> Folder Structure

-> Tech Stack

-> Contributing

Architecture Decisions
Component Structure

The app follows a modular architecture to maintain clarity and scalability. Here's the breakdown of the structure:

components/: Reusable UI components like buttons, table rows, filters, etc.

hooks/: Custom hooks that encapsulate the logic for filtering, sorting, pagination, and virtualization, making them reusable across different components.

lib/: Utility functions and external integrations like API utilities and local storage management.

pages/: Page-level components representing the different views (like the data table view, chart view, etc.).

store/: Contains the Redux store and related slices for managing the global state, particularly the theme (light/dark mode).

By dividing the app this way, each concern (UI, state, data, and logic) is clearly separated, leading to a more maintainable and scalable codebase.

Custom Hooks

The app makes heavy use of custom hooks to encapsulate and abstract logic related to:

Filtering: Provides a reusable way to filter datasets based on user input.

Sorting: Allows sorting of datasets by different columns, either in ascending or descending order.

Pagination: Manages data page state and ensures efficient rendering of large datasets.

Virtualization: Only renders rows that are visible in the viewport, optimizing performance when working with large datasets.

These hooks help to keep the code DRY (Don’t Repeat Yourself) and promote reusability across components.

TypeScript

The entire application is written in TypeScript to ensure type safety. TypeScript helps catch potential errors at compile time and improves developer experience through better autocompletion and documentation.

Tailwind CSS

The app uses Tailwind CSS for styling, allowing for quick and consistent design. Tailwind’s utility-first approach enables responsive design, easy customization, and dark mode support without writing complex CSS.

React Design Patterns

This project follows several React design patterns to ensure the code is maintainable, scalable, and reusable. Here are the key patterns employed:

1. Single Responsibility Principle (SRP)

One of the core principles followed in this application is the Single Responsibility Principle (SRP), which states that a class (or component, in this case) should have only one reason to change, meaning that it should only have one job or responsibility.

In practice:

Components are designed to handle a single concern. For example:

DataTable component: Handles displaying the data table and managing the sorting and column reordering functionality.

Filters component: Handles filtering the dataset and passing the filtered data to the parent component.

Pagination component: Manages pagination without dealing with the table display or filtering logic.

By adhering to SRP, each component is focused and easier to test, debug, and maintain.

2. Presentational vs. Container Components (Smart vs. Dumb Components)

This application follows the presentational/container component pattern, which separates the concerns of UI (presentation) and logic (data fetching, state management).

Presentational Components: These components are responsible for rendering UI and receiving data and actions via props. They don’t have any logic about how the data is fetched or processed. Examples include TableHeader, TableRow, and FilterButton.

Container Components: These components manage state and logic (such as data fetching, filtering, sorting, etc.). They pass data down to presentational components as props. Examples include DataTable and DataView.

This separation improves reusability, as presentational components can be reused in different contexts without being tied to the logic behind them.

3. Custom Hooks for Logic Reusability

Custom hooks are used extensively throughout the app to encapsulate reusable logic related to the core features (filtering, sorting, pagination, etc.). This approach adheres to the DRY (Don’t Repeat Yourself) principle.

For example:

useFilters: A custom hook that handles the filtering logic and state.

usePagination: A custom hook for managing pagination and the state related to page numbers and rows per page.

useVirtualization: A custom hook for calculating and managing the rendering of visible rows in the table.

By using custom hooks, the logic is extracted and isolated, making it reusable across components and easier to maintain.

4. Component Composition

Instead of relying on large, monolithic components, the app is designed using component composition. Smaller components are composed to create larger, more complex UIs.

For example:

The DataTable component is composed of:

TableHeader: Displays the column headers.

TableBody: Renders rows of data.

Pagination: Manages navigation through pages.

This keeps components decoupled and modular, making them easier to modify, test, and reuse.

5. Declarative UI

React's declarative nature is fully embraced. Components render based on their state and props, and React handles the DOM updates accordingly. This makes the codebase simpler to reason about and more predictable.

For example:

The table dynamically renders rows based on the data passed via props (pageRows).

The sortKey and sortDir state control how the columns are sorted, and the UI is updated accordingly when these states change.

Redux vs React Query Usage
Redux

Purpose: Redux is used exclusively for global UI state management. Specifically, it’s used for managing the theme (light/dark mode), which is a global state shared across all pages of the app.

Why Redux?: Redux is a good fit for client-side state like theme preferences that need to be accessed and updated from any component within the app.

React Query

Purpose: React Query handles server-side state, including fetching, caching, and synchronizing data with the backend. It’s ideal for handling data fetched from APIs.

Why React Query?: React Query provides powerful features like caching, automatic background refetching, and error handling with minimal setup. It’s optimized for handling asynchronous data and server state, which is a better fit than Redux for API interactions.

Why Not Redux for Everything?

While Redux is a powerful tool for managing client-side state, it’s less efficient and more complex when it comes to handling server-side state (like fetching, caching, and synchronizing data). React Query is built specifically to handle server state efficiently, which is why it’s used for all API interactions in this app.

Performance & UX Strategies
Virtualization

The data table leverages virtualization to optimize performance, especially with large datasets. By only rendering the rows visible in the viewport (plus a few buffer rows), the app can handle thousands of rows without performance degradation.

Memoization

Operations like filtering and sorting are memoized to avoid unnecessary recalculations. This ensures that if the data doesn’t change, the table won’t be re-rendered unnecessarily, leading to improved performance.

Resource Tracking

To prevent browser slowdowns when dealing with large datasets, the app monitors the size of the dataset and provides a warning if it exceeds a threshold. This helps users avoid performance issues, especially on less powerful devices.

Offline Support

The app uses LocalForage to cache data locally and works seamlessly in offline mode. When a user goes offline, they can still interact with cached data, and once they’re back online, the app will synchronize with the backend.

Accessibility

Accessibility is prioritized throughout the app:

Keyboard navigation: The app supports full keyboard navigation, especially for interactive elements like tables, buttons, and form fields.

ARIA attributes: Proper ARIA attributes are used to ensure the app is accessible to users with disabilities, including screen reader support.

Drag-and-drop: Keyboard support is added for column reordering to ensure users can reorder columns using only the keyboard.

Challenges Faced & Solutions
Efficiently Rendering Large Tables

Rendering thousands of rows led to performance bottlenecks. This was solved by implementing virtualization, rendering only the rows that are visible in the viewport, significantly improving performance for large datasets.

Managing Global vs. Server State

Initially, Redux was used for all state, including both client-side UI state and server-side data. However, it became clear that React Query was a better fit for handling API data. The architecture was refactored to use Redux for managing global UI state (like theme) and React Query for handling API data.

Drag-and-Drop Column Reordering

Implementing a drag-and-drop feature for column reordering posed challenges, especially around accessibility and smooth interaction. The solution involved:

Using React refs to track the dragged column.

Adding keyboard support for drag-and-drop functionality.

Handling visual feedback to improve the UX.

Offline Data Handling

Offline support was necessary for users who might need to access data without an internet connection. The solution involved integrating LocalForage for caching data locally and building custom hooks to detect and handle offline status.

Dark/Light Theme Persistence

To ensure the theme persisted across page reloads, Redux state was synced with localStorage, and the theme was applied directly to the <html> element to maintain consistency.