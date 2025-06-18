# St. Android's Missal & Breviary - Next Generation Architecture

## 1. Introduction

This document outlines the software architecture for the St. Android's Missal & Breviary application (codename "Sanctissimissa"). The application aims to provide a comprehensive digital missal and breviary for the Extraordinary Form of the Roman Rite, accessible on both native mobile platforms (initially Android) and the Web (as a Progressive Web App - PWA). The architecture is designed to be modular, platform-agnostic at its core, and extensible for future enhancements.

## 2. Core Architecture

The heart of the application is a platform-agnostic core that contains the business logic, data definitions, and state management. This ensures consistency and reusability across different platforms.

*   **Services**:
    *   **Calendar Service (`calendar.ts`)**: Responsible for all liturgical date calculations, including movable feasts (e.g., Easter, Pentecost), determining liturgical seasons, ranks of feasts, and applicable commemorations. It provides the liturgical context for any given day.
    *   **Text Service (`texts.ts`)**: Manages the retrieval and processing of liturgical texts. This includes prayers for Mass (Ordo Missae, Propers, Commons), and texts for the Divine Office. It will handle bilingual (Latin/English) content and formatting rules (e.g., rubrics, responses).
    *   **Data Manager (`data-manager.ts`)**: Acts as a central coordinator for all application data. It will manage access to liturgical data, user settings, and cached content. This service will interact with platform-specific storage adapters.

*   **State Management (`/store`)**:
    *   **Redux (`@reduxjs/toolkit`)**: A predictable state container will be used to manage the application's global state. This includes UI state, user settings, current liturgical day information, and loaded texts.
    *   **Slices**: State will be organized into logical slices (e.g., `settings-slice.ts`, `calendar-slice.ts`, `texts-slice.ts`) to manage specific parts of the application state.
    *   **Thunks/Effects**: Asynchronous operations, such as data fetching or saving preferences, will be handled using Redux Thunks or similar middleware.

*   **Type Definitions (`/types`)**:
    *   **Liturgical Types (`liturgical.ts`)**: Defines core data structures for liturgical information, such as `LiturgicalDay`, `LiturgicalSeason`, `BilingualText`, and enumerations for liturgical colors, ranks, etc.
    *   **Service Types (`services.ts`)**: Defines interfaces for core services (`IStorageService`, `IFileSystem`, etc.), ensuring a consistent API for platform-specific implementations.

## 3. Platform Adapters (`/platforms`)

To bridge the platform-agnostic core with platform-specific capabilities, a set of adapters will be implemented. These adapters provide a consistent interface to the core services while abstracting the underlying native or web technologies.

*   **Storage Adapter (`storage-adapter.ts`)**:
    *   **Native**: Implemented using `react-native-sqlite-storage` to interact with an SQLite database for persistent storage of liturgical data, user preferences, and potentially offline content.
    *   **Web**: Implemented using `IndexedDB` to provide similar database capabilities in the browser environment.

*   **File System Adapter (`file-system-adapter.ts`)**:
    *   **Native**: Implemented using `react-native-fs` for accessing and managing files on the native device (e.g., for pre-packaged data, user backups).
    *   **Web**: Implemented using the browser's File API and potentially `LocalStorage` for simpler key-value storage, to handle downloaded liturgical data or assets.

*   **Device Info Adapter (`device-info-adapter.ts`)**:
    *   **Native**: Implemented using `react-native-device-info` to gather device-specific information if needed (e.g., OS version, screen dimensions for analytics or specific UI adjustments).
    *   **Web**: Implemented using browser APIs (e.g., `navigator.userAgent`, screen properties) to get equivalent information.

## 4. UI Layer (`/components`, `/screens`, `/navigation`)

The UI layer is responsible for presenting information to the user and handling user interactions. It will be built using React and React Native components.

*   **Core UI Components (`/components`)**:
    *   Reusable, presentational components forming the building blocks of the UI.
    *   Examples: `LiturgicalText.tsx` (for displaying bilingual Latin/English text with rubrics), `AccordionSection.tsx` (for collapsible content), `SearchBar.tsx`.

*   **Navigation (`/navigation`)**:
    *   **React Navigation**: Used for managing navigation between different screens of the application.
    *   **Tab Navigation**: Main sections like Home, Mass, Office, and Settings will be accessible via a bottom tab bar.
    *   **Stack Navigation**: Within each main section, stack navigators will manage navigation to detail screens or sub-sections.

*   **Screen Components (`/screens`)**:
    *   Container components representing individual screens of the application.
    *   Examples: `HomeScreen.tsx` (dashboard, current day's information), `MassScreen.tsx` (displaying texts for Mass), `OfficeScreen.tsx` (displaying texts for Divine Office hours), `SettingsScreen.tsx`, `AboutScreen.tsx`.

*   **Responsive Design (`/hooks/use-responsive.ts`)**:
    *   The application will be designed to adapt to various screen sizes and orientations on both native and web platforms.
    *   **Hooks**: Custom hooks like `use-responsive.ts` will help in adjusting layouts and components based on screen dimensions.
    *   **Adaptive Layouts**: Flexible grid systems, adaptive typography, and responsive spacing will be used to ensure a good user experience across devices, including foldable device considerations.

## 5. Data Management

Effective data management is crucial for performance and offline capabilities.

*   **Central Data Coordinator (`DataManager`)**: As mentioned in Core Architecture, the `DataManager` service will be the central point for all data operations. It will orchestrate data fetching, caching, and updates.

*   **Data Sources and Storage**:
    *   **Liturgical Data Files/Logic**: Core liturgical data (calendars, rubrics, base texts) will likely be packaged with the application or derived through algorithmic logic within the Calendar and Text services.
    *   **Native Storage**: SQLite (via `react-native-sqlite-storage`) will be the primary storage for structured data on native platforms.
    *   **Web Storage**: IndexedDB will serve a similar role for the PWA, allowing for robust offline data storage.

*   **Caching and Preloading Strategies**:
    *   The `DataManager` will implement caching mechanisms to store frequently accessed liturgical texts and calendar information.
    *   Preloading strategies will be employed to fetch and cache data for upcoming days or commonly used sections to improve perceived performance and offline usability.

## 6. Web-Specific Features (`/platforms/web`, `service-worker.js`)

The web version will be a Progressive Web App (PWA) with features enhancing its app-like experience.

*   **PWA Capabilities**:
    *   The application will include a `manifest.json` file, defining app metadata, icons, and display properties.
*   **Service Workers (`service-worker.js`)**:
    *   A service worker will be implemented to enable robust offline support by caching application assets and data.
    *   It will handle network requests, serving cached content when offline and potentially implementing background data synchronization.
*   **PWA Installation ("Add to Home Screen")**:
    *   The application will prompt users to install the PWA to their home screen for easy access.

## 7. Native-Specific Features (`/platforms/native`)

Native-specific features will leverage the capabilities of the underlying mobile platform.

*   **Native Navigation**:
    *   Utilize native navigation gestures (e.g., swipe back) provided by React Navigation's native stack.
    *   Support for deep linking to specific content within the app.
    *   Customization of native header elements (titles, buttons).
*   **Native Storage**:
    *   **SQLite Configuration**: Fine-tuned configuration for the SQLite database, including schema management and migrations.
    *   **Secure Storage**: Potentially use secure storage solutions (e.g., Keychain/Keystore) for any sensitive user data, although not explicitly planned for liturgical content.
    *   **Backup/Restore**: Explore options for user-initiated backup and restore of application data (e.g., settings, bookmarks if added later).

## 8. Testing Strategy

A comprehensive testing strategy will be implemented to ensure code quality and application stability.

*   **Unit Tests (Jest)**:
    *   Focus on testing individual modules and functions in isolation.
    *   Areas covered: Core services (Calendar, Text, Data Manager), liturgical calculations, text processing utilities, state management (reducers, actions).
    *   Mock services and adapters will be used to isolate units under test.

*   **Integration Tests**:
    *   Verify the interaction between different parts of the application.
    *   Areas covered: Database operations (adapter interaction with SQLite/IndexedDB), navigation flows between screens, offline functionality (service worker behavior, data access without network), cross-platform compatibility checks.

## 9. Build and Deployment

Automated processes will be established for building and deploying the application to different platforms.

*   **Build Configuration**:
    *   **Android (`android/app/build.gradle`)**: Configuration for generating signed APKs/App Bundles for debug and release, including ProGuard rules for optimization.
    *   **Web (`vite.config.ts`)**: Optimized Vite build configuration for the PWA, including asset compression, code splitting, and tree shaking.

*   **CI/CD Pipeline (GitHub Actions)**:
    *   A GitHub Actions workflow will automate the build, test, and deployment process.
    *   Automated testing (unit and integration tests) will run on every push or pull request.
    *   Automated deployment to web hosting services and potentially to app store submission pipelines.
