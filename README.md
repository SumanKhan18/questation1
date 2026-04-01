# GameVerse Arena

GameVerse Arena is a premium single-page game discovery interface built with React, TypeScript, Vite, Tailwind CSS, and Framer Motion. The project focuses on a highly visual browsing experience with cinematic motion, dynamic backgrounds, custom loading states, keyboard navigation, swipe gestures, hover previews, and a modal-based video player.

This README is written as a production-style handoff document so a new developer can understand:

- what the application does
- how the UI is structured
- where data comes from
- how state moves through the app
- which files are responsible for which behaviors
- how to run, maintain, and extend the project

## Contents

1. Project Summary
2. Tech Stack
3. Product Features
4. Application Flow
5. Architecture Overview
6. State Management
7. Component Responsibilities
8. Hooks and Utilities
9. Data Model
10. Styling and Motion System
11. Asset and Video Strategy
12. Scripts and Local Development
13. File Structure
14. Extension Guide
15. Known Notes

## Project Summary

The app presents a curated game showcase with:

- a branded loading experience
- a premium hero section
- searchable and filterable game listings
- featured and trending carousels
- a last-played recovery flow using `localStorage`
- animated game cards with hover video previews
- a full-screen modal player for selected games
- responsive layouts for desktop, tablet, and mobile

The current implementation is front-end only. There is no API layer or backend dependency in active use.

## Tech Stack

### Runtime

- React 18
- React DOM 18
- TypeScript 5

### Build and Tooling

- Vite 5
- ESLint 9
- TypeScript ESLint

### UI and Motion

- Tailwind CSS 3
- Framer Motion 12
- Lucide React icons

### Other

- Web Audio API for lightweight generated sound effects

## Product Features

### Core UX

- Premium branded loading screen with staged progress
- Cinematic hero section with parallax movement
- Rich game metadata:
  - title
  - category
  - rating
  - players
  - duration
  - age limit
  - difficulty
  - tags
- Search and category filtering
- Continue Playing section backed by `localStorage`
- Recommended games based on the selected game's category
- Featured and trending carousel sections

### Interaction Features

- Keyboard navigation with `W`, `A`, `S`, `D`, arrow keys, `Enter`, and `Space`
- Input-safe keyboard handling so form fields are not hijacked
- Swipe gesture support for modal close behavior
- Hover sound, click sound, and whoosh sound
- Hover preview video on cards
- Responsive mobile menu overlay

### Visual Features

- Dynamic background themes driven by the selected game
- Animated section reveals
- Premium CTA styles
- Glassmorphism panels and glow effects
- Animated video modal with hosted embed support

## Application Flow

This is the high-level runtime flow:

1. `src/main.tsx` mounts `App`.
2. `App.tsx` shows a short boot/loading screen.
3. After boot:
   - the custom cursor is enabled
   - the dynamic background becomes active
   - hero, browse, and carousel sections render
4. Clicking a game:
   - plays a whoosh sound
   - stores the selected game in component state
   - stores the game id in `localStorage` as the last played game
   - updates the active theme
   - opens the video modal
5. Closing the modal returns the user to the browsing surface.

## Architecture Overview

The project uses a simple component-driven architecture:

- `App.tsx` is the orchestration layer
- `src/data/games.ts` is the local content source
- presentational behavior is split into focused UI components
- custom hooks encapsulate keyboard and touch behavior
- utility logic is kept in `src/utils`

There is no global state library. React local state and props are enough for the current scope.

## State Management

Most important state lives in `src/App.tsx`.

### Main state in `App.tsx`

- `isBooting`
  - controls whether the loading screen is visible
- `loadingProgress`
  - drives the progress bar in the loading overlay
- `selectedGame`
  - controls which game is currently active in the video modal
- `isMenuOpen`
  - controls the mobile navigation overlay
- `searchQuery`
  - controls the search input and search results panel
- `isSearchFocused`
  - controls visibility of the premium search panel
- `selectedCategory`
  - controls category filtering
- `lastPlayedGame`
  - hydrated from `localStorage`
- `currentTheme`
  - passed to `DynamicBackground` for theme-specific visuals

### Derived state in `App.tsx`

- `categories`
  - generated from the game list
- `filteredGames`
  - based on `searchQuery` and `selectedCategory`
- `recommendedGames`
  - based on the currently selected game's category
- `searchResults`
  - top subset of filtered or full games for search suggestions

## Component Responsibilities

### `src/App.tsx`

This is the root feature component and the most important file in the project.

Responsibilities:

- app boot sequence
- top-level page layout
- hero section
- premium search panel
- mobile menu
- continue-playing logic
- browse/filter section
- featured and trending sections
- footer
- wiring `VideoPlayer`

This is also where the main state and derived UI logic live.

### `src/components/LoadingScreen.tsx`

Displays the boot/loading overlay before the main experience is shown.

Responsibilities:

- branded loading surface
- progress bar UI
- staged loading status messages
- decorative badges and launch messaging

Used only during initial app boot.

### `src/components/GameCard.tsx`

Represents a single game card in grid and carousel contexts.

Responsibilities:

- hover visuals
- click handling
- hover preview video after delay
- difficulty badge rendering
- title/category/rating/players/duration/age metadata rendering
- hover sound and click sound

Key behaviors:

- starts a preview timeout on hover
- plays preview video if available
- resets preview on hover end

### `src/components/EnhancedCarousel.tsx`

Premium three-card carousel used in featured sections.

Responsibilities:

- page and direction tracking
- swipe support using Framer Motion drag events
- rendering previous/current/next items
- premium active-card treatment
- carousel controls and indicators

This is the main carousel used in the current UI.

### `src/components/Carousel.tsx`

Alternative carousel implementation using a scroll container.

Responsibilities:

- mouse drag scrolling
- touch scrolling
- keyboard left/right navigation

This component exists in the codebase but is not currently the primary visual carousel surface.

### `src/components/VideoPlayer.tsx`

Full-screen modal player for a selected game.

Responsibilities:

- open/close animation
- modal background and particle effects
- hosted embed vs direct video handling
- mute toggle and fullscreen for native video
- game metadata display
- close handling via backdrop click and `Escape`

Important implementation detail:

- hosted URLs like Google Drive are rendered as `iframe` embeds
- direct media URLs are rendered through a native `<video>` element

### `src/components/DynamicBackground.tsx`

Renders the animated full-screen background behind the application.

Responsibilities:

- generate theme-specific gradient backgrounds
- generate particle visuals
- animate dot-grid and floating background particles

The active theme changes when a game is selected.

### `src/components/CustomCursor.tsx`

Provides the custom cursor visual layer used after the boot screen.

### `src/components/VideoPlayer.tsx`

Already covered above, but it is worth calling out again because it is the modal interaction center for the selected game flow.

## Hooks and Utilities

### `src/hooks/useKeyboardNavigation.ts`

Encapsulates keyboard-based navigation for the game list.

Supported keys:

- `ArrowRight`, `D`
- `ArrowLeft`, `A`
- `ArrowDown`, `S`
- `ArrowUp`, `W`
- `Enter`
- `Space`

Important protection:

- ignores events when the current target is an editable element like `input`, `textarea`, `select`, or `contenteditable`

This prevents global keyboard controls from interfering with the search input.

### `src/hooks/useSwipeGesture.ts`

Encapsulates global touch gesture detection.

Used for:

- left/right swipe close behavior for the selected-game modal

### `src/utils/soundEffects.ts`

Provides lightweight generated UI sounds using the Web Audio API.

Includes:

- `playHoverSound`
- `playClickSound`
- `playWhooshSound`

There are no external audio files. Sounds are synthesized in the browser.

## Data Model

All current content is stored in `src/data/games.ts`.

### `Game` interface

Each game entry has:

- `id`
- `title`
- `image`
- `category`
- `description`
- `videoUrl`
- `rating`
- `players`
- `duration`
- `ageLimit`
- `glowColor`
- `difficulty`
- `tags`
- `theme`
- `previewVideo`

### Current content strategy

- all main modal videos currently point to the same hosted Google Drive URL
- hover previews still use direct MP4 sample URLs
- image assets are loaded from `public/images`

## Styling and Motion System

### Tailwind

Tailwind is used for layout, spacing, typography, gradients, shadows, and responsive behavior.

### `src/index.css`

Contains global styles and reusable animation utilities such as:

- `neon-glow`
- `slide-in-up`
- `ripple-effect`
- `glow-border`
- `particle-float`
- `shimmer`
- `pulse-glow`
- `scan-line`
- `glass-morphism`
- `glass-morphism-dark`
- `gradient-animation`
- `glitch-effect`
- `perspective-rotate`
- `bounce-subtle`

### Framer Motion

Framer Motion powers:

- loading screen transitions
- hero parallax
- section reveals
- hover scale/rotation interactions
- modal open/close animations
- carousel transitions
- animated glows and pulsing effects

## Asset and Video Strategy

### Images

Static images are stored in:

- `public/images`

There are multiple duplicate image filenames with `copy` variants. The app references specific filenames directly from `games.ts`.

### Favicon and branding asset

- `public/gameverse-emblem.svg`

### Video behavior

Game modal video playback supports two modes:

1. Hosted embed mode
   - used for Google Drive and Jumpshare-style links
   - rendered using `iframe`
2. Native video mode
   - used when a direct playable video URL is available
   - rendered using `<video>`

## Scripts and Local Development

### Install

```bash
npm install
```

### Start development server

```bash
npm run dev
```

### Lint

```bash
npm run lint
```

### Type check

```bash
npm run typecheck
```

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## File Structure

The following structure reflects the current project files excluding `node_modules` and build output:

```text
project/
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── TODO.md
├── eslint.config.js
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── public/
│   ├── gameverse-emblem.svg
│   └── images/
│       ├── escape_the_lava.jpg
│       ├── escape_the_lava copy.jpg
│       ├── escape_the_lava copy copy.jpg
│       ├── find_the_color.jpg
│       ├── find_the_color copy.jpg
│       ├── red_light_green_light.jpg
│       ├── red_light_green_light copy.jpg
│       ├── red_light_green_light copy copy.jpg
│       ├── shooter.jpg
│       ├── shooter copy.jpg
│       └── shooter copy copy.jpg
└── src/
    ├── App.tsx
    ├── index.css
    ├── main.tsx
    ├── vite-env.d.ts
    ├── components/
    │   ├── Carousel.tsx
    │   ├── CustomCursor.tsx
    │   ├── DynamicBackground.tsx
    │   ├── EnhancedCarousel.tsx
    │   ├── GameCard.tsx
    │   ├── LoadingScreen.tsx
    │   └── VideoPlayer.tsx
    ├── data/
    │   └── games.ts
    ├── hooks/
    │   ├── useKeyboardNavigation.ts
    │   └── useSwipeGesture.ts
    └── utils/
        └── soundEffects.ts
```

## Configuration Files

### `index.html`

Responsible for:

- page title
- favicon
- social preview meta tags
- root mount node for React

### `vite.config.ts`

Responsible for:

- Vite configuration
- React plugin registration
- excluding `lucide-react` from dependency optimization

### `eslint.config.js`

Responsible for:

- JavaScript and TypeScript linting rules
- React Hooks lint rules
- React Refresh rules

### `tailwind.config.js`

Responsible for Tailwind scanning and theme configuration.

### `tsconfig*.json`

Responsible for TypeScript compilation and editor behavior.

## Extension Guide

### Add a new game

Update `src/data/games.ts` with a new `Game` object.

Make sure to provide:

- image path
- category
- video URL
- preview video URL if available
- theme
- glow color
- duration
- age limit

### Change the hero game

The hero section in `App.tsx` is currently hard-coded to `games[0]` and the associated visual copy.

If you want it fully data-driven:

- replace the hard-coded strings in the hero
- derive content from a selected featured game object

### Replace hosted video logic

If you move away from Google Drive:

- update `getHostedEmbedUrl` in `src/components/VideoPlayer.tsx`
- keep direct-video fallback behavior if native playback is still needed

### Add backend integration

The package includes `@supabase/supabase-js`, but the current application does not use it.

A future backend integration could power:

- dynamic game lists
- user profiles
- real continue-playing state
- favorites/watchlists
- analytics

## Known Notes

- The project is currently front-end only.
- Game metadata is local and static.
- The hero section still contains some hard-coded copy for the featured game.
- Some asset filenames include spaces and `copy` suffixes. This works, but renaming assets to stable production-friendly names would improve maintainability.
- Google Drive video embedding depends on the share URL remaining valid and embeddable.
- `TODO.md` exists for project planning notes but is separate from runtime behavior.

## Recommended Production Improvements

If this project is moving toward full production, these would be strong next steps:

1. Move all game content to a CMS or backend API.
2. Normalize asset filenames and remove duplicate image copies.
3. Add automated tests for:
   - search behavior
   - modal open/close behavior
   - keyboard navigation
   - responsive menu behavior
4. Add accessibility passes for:
   - focus management in the modal
   - mobile menu keyboard support
   - color contrast verification
5. Extract repeated premium button and panel styles into reusable components.

## Maintainer Notes

When editing this project, the most important files to understand first are:

1. `src/App.tsx`
2. `src/data/games.ts`
3. `src/components/GameCard.tsx`
4. `src/components/EnhancedCarousel.tsx`
5. `src/components/VideoPlayer.tsx`

Those five files explain the majority of the app’s user experience and logic.
