# SchnellLern - Minimal Vocabulary App

SchnellLern is a minimalist web application designed for daily German vocabulary practice. It allows users to focus on vocabulary for a specific language proficiency level (currently B2) and track their progress as they master new words.

## Features

-   **Level-based Learning:** Currently supports B2 level vocabulary. Other levels (A1, A2, B1) are available but do not contain vocabulary yet.
-   **Interactive Practice:** Users can start a practice session to review words one by one.
-   **Show Meaning:** Reveal the meaning of a word when ready.
-   **Mark as Mastered:** Keep track of learned words. Mastered words are removed from the practice pool.
-   **Pronunciation:** Listen to the pronunciation of each German word (requires browser support for Speech Synthesis).
-   **Statistics:** See a summary of total, mastered, and remaining vocabulary words.
-   **Persistent State:** Your progress is saved in your browser's `localStorage`, so you can pick up where you left off.
-   **Clean Interface:** A simple, beautiful, and focused user interface.

## Tech Stack

-   **React:** A JavaScript library for building user interfaces.
-   **Vite:** A fast build tool and development server for modern web projects.
-   **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
-   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
-   **Lucide React:** A beautiful and consistent icon toolkit.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) (which comes with Node.js) installed on your machine.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd schnelllern-minimal
    ```
3.  **Install the dependencies:**
    ```bash
    npm install
    ```

### Running the Application

Once the dependencies are installed, you can run the application in development mode:

```bash
npm run dev
```

This will start the development server. Open your browser and go to `http://localhost:5173` (the port might be different if 5173 is in use) to see the application.

### Building for Production

To create a production-ready build of the application, run the following command:

```bash
npm run build
```

This will create a `dist` directory with the optimized and minified files for deployment. You can preview the production build locally with:

```bash
npm run preview
```

## How It Works

-   Vocabulary data is stored in `src/data/vocabulary.json`. This file is structured by language level (A1, A2, B1, B2).
-   When the app loads, it checks for existing vocabulary data in the browser's `localStorage`. If found, it loads the user's progress.
-   If no saved data is found, it loads the default vocabulary for the selected level from the JSON file.
-   When a user marks a word as "mastered," its status is updated in the application's state and saved to `localStorage`.
-   The practice session always pulls a random word from the list of unmastered words.

## Future Improvements

-   Add vocabulary for A1, A2, and B1 levels.
-   Implement a more sophisticated spaced repetition system (SRS) for reviewing words.
-   Add more context to vocabulary, such as example sentences.
-   Allow users to create their own vocabulary lists.
-   Add user authentication to sync progress across devices.
