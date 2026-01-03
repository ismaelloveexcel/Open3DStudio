# Open3DStudio - Replit Configuration

## Overview

Open3DStudio is a cross-platform AI-powered game development studio built with React, TypeScript, and Three.js. The platform provides a unified 7-stage creative director workflow for game creation, with all 3D asset generation tools integrated seamlessly into the pipeline.

**Core Capabilities:**
- 7-Stage Professional Pipeline: Idea → Market Analysis → Revision → Asset Planning → Visual Preview → Building → QA
- Integrated AI Asset Pipeline: MeshGen → Segmentation → Part Completion → Retopology → UV Unwrap → Texturing
- Visual previews before committing to full game build
- Automated quality assurance testing with performance and playability scores
- Export to playable HTML5 games
- Optional 3DAIGC-API backend for GPU-accelerated AI operations

## User Preferences

Preferred communication style: Simple, everyday language.

## 7-Stage Game Development Pipeline

### Stage 1: Developing Idea
User describes their game vision through natural language chat.

### Stage 2: Market Analysis
AI compares the idea against current market trends and provides viability score.

### Stage 3: Revision
AI suggests improvements based on market insights to boost appeal.

### Stage 4: Asset Planning
AI plans all game assets with production blueprints showing the AI pipeline steps for each asset.
- Realism options: Stylized / Semi-Realistic / Realistic
- Detail levels: Low / Medium / High

### Stage 5: Visual Preview
Real-time 3D previews of environments and atmosphere before committing to full build.

### Stage 6: Building
Automated asset generation with live progress tracking:
- MeshGen: Generate base 3D meshes
- Segmentation: Segment meshes into parts
- Part Completion: Complete and enhance parts
- Retopology: Low-poly optimization
- UV Unwrap: UV mapping
- Texturing: Material and texture generation

### Stage 7: Quality Assurance
Automated testing with:
- Performance score
- Playability score
- Issue detection and recommendations
- Games must pass QA before final delivery

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Create React App
- **3D Rendering**: Three.js via @react-three/fiber and @react-three/drei
- **State Management**: Zustand with subscribeWithSelector middleware
- **Styling**: styled-components with theme system

### Key Services
- `src/services/gameStudioServices.ts`: Market analysis, revision planning, asset planning, QA testing
- `src/services/assetPipelineService.ts`: Orchestrates the 6-step asset generation pipeline
- `src/components/features/GameStudioPanel.tsx`: Main 7-stage UI
- `src/components/features/ConceptPreviewScene.tsx`: 3D preview rendering

### Storage Architecture
- **IndexedDB** (`src/services/indexedDBStorage.ts`): Large 3D assets
- **Dexie.js** (`src/services/database.ts`): Enhanced IndexedDB wrapper
- **localStorage**: Settings persistence

### Build and Deployment
- **Port**: 5000 (frontend)
- **Build Command**: `CI=false npm run build`
- **Production Serving**: `npx serve -s build`
