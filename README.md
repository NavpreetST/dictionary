# Deutsche Words - Personal German Dictionary

A Next.js application for building your personal German vocabulary with automatic word lookup, articles, and definitions.

## Features

- 🇩🇪 **German Word Management**: Add German words and automatically get their articles, translations, and definitions
- 🤖 **AI-Powered Lookup**: Integration with Google Gemini API for accurate word information (with fallback for common words)
- 🗂️ **Smart Filtering**: Filter words by part of speech (Noun, Verb, Adjective, etc.) and alphabetically
- 💾 **Local Storage**: Uses SQLite database for local data storage
- 📱 **Responsive Design**: Works great on desktop and mobile devices
- ⚡ **Fast Performance**: Built with Next.js and optimized for speed

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository or navigate to your project directory

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables (optional):
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Google Gemini API key if you want AI-powered lookups:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
   Get your API key from: https://ai.google.dev/

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Add Words**: Type a German word in the input field and click "Add Word"
2. **Browse Dictionary**: View all your words in the table with articles, translations, and definitions
3. **Filter Words**: Use the filter buttons to show specific parts of speech or words starting with certain letters
4. **Delete Words**: Click the X button next to any word to remove it from your dictionary

## Database

The application uses SQLite for local storage. The database file `deutsche_words.db` will be created automatically in your project root when you add your first word.

## API Integration

- **With Gemini API**: Provides accurate articles, definitions, and translations for German words
- **Fallback Mode**: Uses built-in dictionary for common German words when API key is not provided

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite3
- **Font**: Inter (Google Fonts)
- **AI Integration**: Google Gemini API

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── words/         # CRUD operations for words
│   │   └── lookup/        # AI-powered word lookup
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx          # Main application page
├── components/
│   ├── DeleteModal.tsx   # Confirmation modal for deletions
│   ├── FilterButtons.tsx # Part of speech and alphabet filters
│   ├── WordInput.tsx     # Word input form
│   └── WordsTable.tsx    # Dictionary table display
└── lib/
    └── database.ts       # SQLite database utilities
```

## Contributing

This project is based on your original HTML implementation and has been converted to a modern Next.js application with local database storage.

## Future Enhancements

- [ ] Export/Import dictionary data
- [ ] Search functionality
- [ ] Pronunciation guides
- [ ] Example sentences
- [ ] Progress tracking and statistics
- [ ] Dark mode support
