# Open3DStudio - Replit Configuration

## Overview

Open3DStudio is a cross-platform AI-powered 3D game development studio and AIGC (AI Generated Content) application built with React, TypeScript, and Three.js. The platform enables AI-driven 3D model generation, game creation, and asset management with support for web and Electron desktop deployment.

**Core Capabilities:**
- AI Chat Interface for game ideation and automatic game generation
- 3D asset generation (mesh generation, texturing, rigging, retopology, UV unwrapping)
- Multiple game templates (platformer, shooter, puzzle, arcade, racing, adventure)
- Real-time 3D viewport with multiple render modes
- Export to HTML5 games and GLB/GLTF formats
- Integration with external 3DAIGC-API backend for AI operations

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Create React App
- **3D Rendering**: Three.js via @react-three/fiber and @react-three/drei for declarative 3D scenes
- **State Management**: Zustand with subscribeWithSelector middleware for centralized state
- **Styling**: styled-components with theme system supporting dark/light modes
- **Routing**: React Router DOM for navigation between modules

### Component Structure
- **Layout Components** (`src/components/layout/`): TopBar, Sidebars, Viewport, BottomBar
- **Feature Components** (`src/components/features/`): Module-specific panels for mesh generation, painting, segmentation, rigging, retopology, UV unwrapping
- **UI Components** (`src/components/ui/`): Reusable UI elements, modals, notifications

### State Management Pattern
The Zustand store (`src/store/index.ts`) manages:
- Current module and feature selection
- Task queue with job polling
- UI state (sidebar visibility, viewport settings)
- Authentication state
- Game Studio projects and conversations
- 3D model loading and selection

### API Integration
- **Client**: Axios-based API client (`src/api/client.ts`) with interceptors for auth and error handling
- **Job System**: All AI operations return job IDs, with automatic polling for completion
- **File Handling**: Base64 encoding for uploads, unique file IDs for subsequent operations

### Storage Architecture
- **IndexedDB** (`src/services/indexedDBStorage.ts`): Large 3D assets (50MB+ per asset)
- **Dexie.js** (`src/services/database.ts`): Enhanced IndexedDB wrapper with TypeScript support
- **localStorage**: Settings persistence and session state

### Desktop Support
- **Electron**: Cross-platform desktop app with preload scripts for secure IPC
- **Platform Detection**: Conditional rendering for Electron vs web features

## External Dependencies

### 3D and Graphics
- `three` / `@react-three/fiber` / `@react-three/drei`: 3D rendering ecosystem
- `@react-three/rapier`: Physics engine integration
- `@react-three/postprocessing`: Visual effects
- `troika-three-text`: High-quality 3D text rendering

### AI and Backend
- `@ai-sdk/react` / `ai`: Vercel AI SDK for chat interfaces
- `axios`: HTTP client for 3DAIGC-API backend communication
- External 3DAIGC-API server required for AI operations (mesh generation, texturing, etc.)

### UI and Development
- `@monaco-editor/react`: Code editor integration
- `@xyflow/react`: Visual flow editor for game logic
- `framer-motion`: Animations
- `leva`: GUI controls for 3D parameter tweaking
- `sonner`: Toast notifications
- `react-hotkeys-hook`: Keyboard shortcuts

### Storage and PWA
- `dexie`: IndexedDB wrapper
- `workbox-window`: Service worker for offline support

### Build and Deployment
- **Port**: 3000 (mapped to external port 80 on Replit)
- **Build Command**: `CI=false npm run build` (suppresses ESLint warnings)
- **Production Serving**: `npx serve -s build` for static file serving
- **Environment Variables**: `REACT_APP_API_BASE_URL` for backend API endpoint