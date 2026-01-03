import { GameProject, GameBlueprint, ConceptPreview, GameGenre } from '../types/state';

const moodPalettes: Record<string, { primary: string; secondary: string; accent: string; background: string; atmosphere: string }> = {
  dark: { primary: '#2d1b4e', secondary: '#1a0a2e', accent: '#8b5cf6', background: '#0a0a0f', atmosphere: '#1e1e3f' },
  eerie: { primary: '#1a2e1a', secondary: '#0d1a0d', accent: '#4ade80', background: '#050a05', atmosphere: '#1a3a1a' },
  upside_down: { primary: '#1a0a1a', secondary: '#0d050d', accent: '#dc2626', background: '#050205', atmosphere: '#2d1a2d' },
  bright: { primary: '#60a5fa', secondary: '#3b82f6', accent: '#fbbf24', background: '#1e40af', atmosphere: '#bfdbfe' },
  mystical: { primary: '#7c3aed', secondary: '#5b21b6', accent: '#c084fc', background: '#1e1b4b', atmosphere: '#a78bfa' },
  horror: { primary: '#450a0a', secondary: '#1c0404', accent: '#dc2626', background: '#0a0404', atmosphere: '#7f1d1d' },
  peaceful: { primary: '#22d3ee', secondary: '#06b6d4', accent: '#fcd34d', background: '#164e63', atmosphere: '#a5f3fc' },
  futuristic: { primary: '#06b6d4', secondary: '#0891b2', accent: '#f0abfc', background: '#083344', atmosphere: '#67e8f9' },
  fantasy: { primary: '#a855f7', secondary: '#7c3aed', accent: '#fbbf24', background: '#3b0764', atmosphere: '#c4b5fd' },
  urban: { primary: '#6b7280', secondary: '#4b5563', accent: '#fbbf24', background: '#1f2937', atmosphere: '#9ca3af' }
};

const genreDefaults: Record<GameGenre, { visualStyle: string; defaultMood: string }> = {
  platformer: { visualStyle: 'Colorful side-scrolling with clean geometric shapes', defaultMood: 'bright' },
  puzzle: { visualStyle: 'Minimalist with subtle gradients and smooth transitions', defaultMood: 'peaceful' },
  shooter: { visualStyle: 'High contrast with particle effects and dynamic lighting', defaultMood: 'futuristic' },
  racing: { visualStyle: 'Sleek with motion blur and neon accents', defaultMood: 'futuristic' },
  rpg: { visualStyle: 'Rich detailed environments with atmospheric depth', defaultMood: 'fantasy' },
  adventure: { visualStyle: 'Immersive first-person exploration with environmental storytelling', defaultMood: 'mystical' },
  simulation: { visualStyle: 'Realistic proportions with clean UI overlays', defaultMood: 'peaceful' },
  arcade: { visualStyle: 'Retro-inspired with bold colors and pixel-art feel', defaultMood: 'bright' },
  educational: { visualStyle: 'Friendly and approachable with clear visual hierarchy', defaultMood: 'bright' },
  other: { visualStyle: 'Custom visual style based on concept', defaultMood: 'peaceful' }
};

function detectMoodFromDescription(description: string): string {
  const lowerDesc = description.toLowerCase();
  
  if (lowerDesc.includes('upside down') || lowerDesc.includes('stranger things')) return 'upside_down';
  if (lowerDesc.includes('dark') || lowerDesc.includes('eerie') || lowerDesc.includes('scary')) return 'eerie';
  if (lowerDesc.includes('horror') || lowerDesc.includes('terrifying')) return 'horror';
  if (lowerDesc.includes('bright') || lowerDesc.includes('colorful') || lowerDesc.includes('happy')) return 'bright';
  if (lowerDesc.includes('mystical') || lowerDesc.includes('magical') || lowerDesc.includes('enchanted')) return 'mystical';
  if (lowerDesc.includes('peaceful') || lowerDesc.includes('calm') || lowerDesc.includes('relaxing')) return 'peaceful';
  if (lowerDesc.includes('futuristic') || lowerDesc.includes('cyber') || lowerDesc.includes('neon')) return 'futuristic';
  if (lowerDesc.includes('fantasy') || lowerDesc.includes('medieval') || lowerDesc.includes('dragon')) return 'fantasy';
  if (lowerDesc.includes('city') || lowerDesc.includes('urban') || lowerDesc.includes('mall')) return 'urban';
  
  return 'mystical';
}

function extractSettingFromConversation(conversation: { content: string; role: string }[]): string {
  const userMessages = conversation.filter(m => m.role === 'user').map(m => m.content).join(' ');
  return userMessages || 'A mysterious world awaiting exploration';
}

function extractEnvironmentsFromDescription(description: string): { id: string; name: string; description: string; elements: string[] }[] {
  const environments: { id: string; name: string; description: string; elements: string[] }[] = [];
  const lowerDesc = description.toLowerCase();
  
  if (lowerDesc.includes('metro') || lowerDesc.includes('station') || lowerDesc.includes('subway')) {
    environments.push({
      id: 'env_metro',
      name: 'Metro Station',
      description: 'Underground transit hub with dim lighting',
      elements: ['platform', 'rails', 'pillars', 'flickering lights', 'empty benches']
    });
  }
  
  if (lowerDesc.includes('passageway') || lowerDesc.includes('corridor') || lowerDesc.includes('tunnel')) {
    environments.push({
      id: 'env_passage',
      name: 'Connecting Passage',
      description: 'Long corridor between areas',
      elements: ['walls', 'floor tiles', 'ceiling', 'emergency lights', 'shadows']
    });
  }
  
  if (lowerDesc.includes('mall') || lowerDesc.includes('shopping')) {
    environments.push({
      id: 'env_mall',
      name: 'Main Mall Area',
      description: 'Large shopping complex interior',
      elements: ['storefronts', 'escalators', 'benches', 'planters', 'high ceiling']
    });
  }
  
  if (lowerDesc.includes('fountain') || lowerDesc.includes('water')) {
    environments.push({
      id: 'env_fountain',
      name: 'Fountain Plaza',
      description: 'Central water feature area',
      elements: ['fountain', 'water jets', 'seating area', 'decorative lights']
    });
  }
  
  if (lowerDesc.includes('burj') || lowerDesc.includes('tower') || lowerDesc.includes('skyscraper')) {
    environments.push({
      id: 'env_vista',
      name: 'Tower Vista',
      description: 'View of the iconic tower',
      elements: ['glass windows', 'tower silhouette', 'city lights', 'sky backdrop']
    });
  }
  
  if (lowerDesc.includes('vine') || lowerDesc.includes('overgrown')) {
    environments.forEach(env => {
      env.elements.push('creeping vines', 'organic growths', 'decayed matter');
    });
  }
  
  if (environments.length === 0) {
    environments.push({
      id: 'env_main',
      name: 'Main Environment',
      description: 'Primary game area',
      elements: ['floor', 'walls', 'ambient lighting', 'atmospheric effects']
    });
  }
  
  return environments;
}

export function generateBlueprint(project: GameProject): GameBlueprint {
  const fullDescription = extractSettingFromConversation(project.conversation);
  const detectedMood = detectMoodFromDescription(fullDescription);
  const palette = moodPalettes[detectedMood] || moodPalettes.mystical;
  const genreStyle = genreDefaults[project.genre] || genreDefaults.other;
  
  const environments = extractEnvironmentsFromDescription(fullDescription);
  
  const storyBeats: string[] = [];
  if (environments.length > 0) {
    storyBeats.push(`Begin at ${environments[0].name}`);
    environments.slice(1).forEach(env => {
      storyBeats.push(`Progress through ${env.name}`);
    });
    storyBeats.push('Reach the climax/destination');
    storyBeats.push('Experience the atmosphere');
  }
  
  return {
    setting: {
      name: project.name,
      description: fullDescription,
      mood: detectedMood.replace('_', ' '),
      timeOfDay: fullDescription.toLowerCase().includes('night') ? 'night' : 
                 fullDescription.toLowerCase().includes('sunset') ? 'sunset' : 'dusk',
      weather: fullDescription.toLowerCase().includes('rain') ? 'rain' : 
               fullDescription.toLowerCase().includes('fog') ? 'foggy' : 'clear'
    },
    colorPalette: palette,
    environments,
    characters: [{
      id: 'char_player',
      name: 'Explorer',
      role: 'player',
      appearance: 'First-person perspective - player embodies the explorer'
    }],
    storyBeats,
    visualStyle: `${genreStyle.visualStyle}. Mood: ${detectedMood.replace('_', ' ')}`
  };
}

export function generateConceptPreviews(blueprint: GameBlueprint): ConceptPreview[] {
  const previews: ConceptPreview[] = [];
  
  previews.push({
    id: 'preview_mood',
    type: 'mood',
    name: 'Atmosphere & Mood',
    description: `${blueprint.setting.mood} atmosphere with ${blueprint.setting.timeOfDay} lighting`,
    approved: false,
    sceneConfig: {
      backgroundColor: blueprint.colorPalette.background,
      fogColor: blueprint.colorPalette.atmosphere,
      fogDensity: 0.02,
      ambientLight: blueprint.colorPalette.primary,
      elements: [
        { type: 'ambientParticles', color: blueprint.colorPalette.accent, position: [0, 2, 0], scale: 5 },
        { type: 'ground', color: blueprint.colorPalette.secondary, position: [0, -1, 0], scale: 20 },
        { type: 'fog', color: blueprint.colorPalette.atmosphere, position: [0, 0, 0], scale: 1 }
      ]
    }
  });
  
  blueprint.environments.forEach((env, index) => {
    previews.push({
      id: `preview_env_${index}`,
      type: 'environment',
      name: env.name,
      description: env.description,
      approved: false,
      sceneConfig: {
        backgroundColor: blueprint.colorPalette.background,
        fogColor: blueprint.colorPalette.atmosphere,
        fogDensity: 0.015,
        ambientLight: blueprint.colorPalette.primary,
        elements: env.elements.map((el, i) => ({
          type: el,
          color: i % 2 === 0 ? blueprint.colorPalette.secondary : blueprint.colorPalette.accent,
          position: [(i - 2) * 3, 0, -5] as [number, number, number],
          scale: 1
        }))
      }
    });
  });
  
  return previews;
}

export function analyzeUserIdea(message: string): { 
  hasEnoughDetail: boolean; 
  extractedConcepts: string[];
  suggestedQuestions: string[];
} {
  const concepts: string[] = [];
  const lower = message.toLowerCase();
  
  if (lower.includes('walk') || lower.includes('explore') || lower.includes('move')) concepts.push('exploration');
  if (lower.includes('dark') || lower.includes('eerie') || lower.includes('scary')) concepts.push('horror atmosphere');
  if (lower.includes('mall') || lower.includes('city') || lower.includes('urban')) concepts.push('urban setting');
  if (lower.includes('upside down') || lower.includes('stranger things')) concepts.push('surreal/inverted world');
  if (lower.includes('vine') || lower.includes('overgrown')) concepts.push('organic decay');
  if (lower.includes('fountain') || lower.includes('landmark')) concepts.push('landmark destination');
  
  const hasEnoughDetail = concepts.length >= 2 && message.length > 50;
  
  const suggestedQuestions: string[] = [];
  if (!concepts.includes('exploration')) suggestedQuestions.push("How does the player move/interact?");
  if (!lower.includes('end') && !lower.includes('goal')) suggestedQuestions.push("What happens when you reach the destination?");
  if (!concepts.includes('horror atmosphere') && !lower.includes('mood')) suggestedQuestions.push("What mood/feeling should players experience?");
  
  return { hasEnoughDetail, extractedConcepts: concepts, suggestedQuestions };
}
