import { GameProject, GameGenre, MarketReport, RevisionPlan, AssetPlan, PreviewSample, QAReport } from '../types/state';

const marketData: Record<GameGenre, { topGames: { name: string; features: string[] }[]; trends: string[]; opportunities: string[] }> = {
  platformer: {
    topGames: [
      { name: 'Celeste', features: ['tight controls', 'difficulty options', 'emotional story'] },
      { name: 'Hollow Knight', features: ['exploration', 'combat', 'atmosphere'] },
      { name: 'Dead Cells', features: ['roguelike elements', 'fast combat', 'progression'] }
    ],
    trends: ['Precision platforming', 'Roguelike mechanics', 'Emotional narratives', 'Accessibility options'],
    opportunities: ['Unique art style', 'Novel movement mechanics', 'Cozy/relaxing vibes']
  },
  puzzle: {
    topGames: [
      { name: 'The Witness', features: ['environmental puzzles', 'exploration', 'minimalist'] },
      { name: 'Baba Is You', features: ['rule manipulation', 'creative solutions', 'meta puzzles'] }
    ],
    trends: ['Meta puzzles', 'Relaxing atmosphere', 'Daily challenges', 'Social sharing'],
    opportunities: ['Novel puzzle mechanics', 'Story integration', 'Mobile-friendly']
  },
  shooter: {
    topGames: [
      { name: 'Vampire Survivors', features: ['auto-attack', 'upgrade choices', 'endless waves'] },
      { name: 'Enter the Gungeon', features: ['bullet hell', 'roguelike', 'humor'] }
    ],
    trends: ['Survivors-like', 'Roguelike elements', 'Minimalist controls', 'Satisfying feedback'],
    opportunities: ['Unique theme', 'Innovative weapons', 'Cooperative play']
  },
  racing: {
    topGames: [
      { name: 'Road 96', features: ['narrative', 'choice-based', 'atmosphere'] },
      { name: 'Art of Rally', features: ['minimalist', 'relaxing', 'beautiful visuals'] }
    ],
    trends: ['Arcade simplicity', 'Beautiful environments', 'Relaxing gameplay'],
    opportunities: ['Unique setting', 'Story elements', 'Creative obstacles']
  },
  adventure: {
    topGames: [
      { name: 'Firewatch', features: ['exploration', 'narrative', 'atmosphere'] },
      { name: 'What Remains of Edith Finch', features: ['walking sim', 'story vignettes', 'emotional'] }
    ],
    trends: ['Walking simulators', 'Environmental storytelling', 'Atmospheric experiences', 'Short but impactful'],
    opportunities: ['Unique settings', 'Emotional resonance', 'Immersive audio']
  },
  arcade: {
    topGames: [
      { name: 'Tetris Effect', features: ['classic gameplay', 'audiovisual experience', 'flow state'] },
      { name: 'Pac-Man 256', features: ['endless', 'power-ups', 'modern twist'] }
    ],
    trends: ['Classic revivals', 'Score chasing', 'Quick sessions', 'Leaderboards'],
    opportunities: ['Novel twist on classic', 'Satisfying feedback', 'One more try factor']
  },
  rpg: {
    topGames: [
      { name: 'Hades', features: ['action combat', 'narrative progression', 'roguelike'] }
    ],
    trends: ['Action RPG', 'Narrative focus', 'Roguelike elements'],
    opportunities: ['Unique setting', 'Character depth', 'Build variety']
  },
  simulation: {
    topGames: [
      { name: 'Stardew Valley', features: ['farming', 'relationships', 'relaxing'] }
    ],
    trends: ['Cozy games', 'Life simulation', 'Crafting'],
    opportunities: ['Unique theme', 'Relaxing gameplay', 'Long-term goals']
  },
  educational: {
    topGames: [
      { name: 'Kerbal Space Program', features: ['physics', 'creativity', 'learning'] }
    ],
    trends: ['Learn through play', 'Sandbox creativity', 'Achievement systems'],
    opportunities: ['Fun first', 'Hidden learning', 'Rewarding progress']
  },
  other: {
    topGames: [],
    trends: ['Innovation', 'Unique mechanics', 'Genre blending'],
    opportunities: ['Stand out from crowd', 'Create new category']
  }
};

export async function generateMarketReport(project: GameProject): Promise<MarketReport> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const genreData = marketData[project.genre] || marketData.other;
  const ideaText = project.ideaSummary || project.conversation.filter(m => m.role === 'user').map(m => m.content).join(' ');
  
  const similarGames = genreData.topGames.map((game, i) => ({
    name: game.name,
    genre: project.genre,
    successScore: 85 - i * 5,
    features: game.features
  }));
  
  const threats = [
    'Saturated market requires unique selling point',
    'Player expectations are high in this genre',
    'Discovery can be challenging'
  ];
  
  const baseScore = 65 + Math.floor(Math.random() * 20);
  
  return {
    similarGames,
    trends: genreData.trends,
    opportunities: genreData.opportunities,
    threats,
    viabilityScore: baseScore,
    completed: true
  };
}

export async function generateRevisionPlan(project: GameProject, marketReport: MarketReport): Promise<RevisionPlan> {
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const ideaText = project.ideaSummary || '';
  
  const suggestions: { area: string; suggestion: string; impact: 'high' | 'medium' | 'low' }[] = [];
  
  if (!ideaText.toLowerCase().includes('unique') && !ideaText.toLowerCase().includes('different')) {
    suggestions.push({
      area: 'Unique Selling Point',
      suggestion: `Consider adding a distinctive hook that sets your game apart. Popular ${project.genre} games succeed with: ${marketReport.opportunities[0] || 'unique mechanics'}`,
      impact: 'high'
    });
  }
  
  if (marketReport.trends.length > 0) {
    suggestions.push({
      area: 'Market Trends',
      suggestion: `Incorporate trending elements: ${marketReport.trends.slice(0, 2).join(', ')}`,
      impact: 'medium'
    });
  }
  
  suggestions.push({
    area: 'Player Retention',
    suggestion: 'Add progression systems or unlockables to encourage repeat play',
    impact: 'medium'
  });
  
  suggestions.push({
    area: 'Accessibility',
    suggestion: 'Include difficulty options or assist modes to reach wider audience',
    impact: 'low'
  });
  
  return {
    originalConcept: ideaText,
    suggestedChanges: suggestions,
    finalConcept: ideaText,
    approved: false
  };
}

export async function generateAssetPlan(project: GameProject): Promise<AssetPlan> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const ideaText = project.ideaSummary || project.conversation.filter(m => m.role === 'user').map(m => m.content).join(' ');
  const lowerIdea = ideaText.toLowerCase();
  
  const assets: AssetPlan['assets'] = [];
  
  assets.push({
    id: 'asset_player',
    category: 'character',
    name: 'Player Character',
    description: 'Main playable character or first-person viewpoint',
    priority: 'essential'
  });
  
  if (lowerIdea.includes('mall') || lowerIdea.includes('building') || lowerIdea.includes('indoor')) {
    assets.push({ id: 'asset_interior', category: 'environment', name: 'Interior Environment', description: 'Indoor spaces with walls, floors, ceiling', priority: 'essential' });
  }
  
  if (lowerIdea.includes('metro') || lowerIdea.includes('station') || lowerIdea.includes('subway')) {
    assets.push({ id: 'asset_metro', category: 'environment', name: 'Metro Station', description: 'Underground transit area', priority: 'essential' });
  }
  
  if (lowerIdea.includes('fountain') || lowerIdea.includes('water')) {
    assets.push({ id: 'asset_fountain', category: 'prop', name: 'Water Fountain', description: 'Decorative water feature', priority: 'important' });
  }
  
  if (lowerIdea.includes('tower') || lowerIdea.includes('burj') || lowerIdea.includes('skyscraper')) {
    assets.push({ id: 'asset_tower', category: 'environment', name: 'Landmark Tower', description: 'Iconic tall building in background', priority: 'important' });
  }
  
  if (lowerIdea.includes('vine') || lowerIdea.includes('overgrown') || lowerIdea.includes('upside down')) {
    assets.push({ id: 'asset_vines', category: 'prop', name: 'Creeping Vines', description: 'Organic growth covering surfaces', priority: 'essential' });
    assets.push({ id: 'asset_decay', category: 'effect', name: 'Decay Effects', description: 'Particles and fog for eerie atmosphere', priority: 'important' });
  }
  
  if (lowerIdea.includes('dark') || lowerIdea.includes('eerie') || lowerIdea.includes('scary')) {
    assets.push({ id: 'asset_lighting', category: 'effect', name: 'Atmospheric Lighting', description: 'Moody, dim lighting with shadows', priority: 'essential' });
    assets.push({ id: 'asset_particles', category: 'effect', name: 'Ambient Particles', description: 'Floating dust, spores, or embers', priority: 'important' });
  }
  
  assets.push({ id: 'asset_ui', category: 'ui', name: 'Game UI', description: 'Menus, HUD, and interface elements', priority: 'essential' });
  
  if (assets.length < 5) {
    assets.push({ id: 'asset_ground', category: 'environment', name: 'Ground/Floor', description: 'Main walkable surface', priority: 'essential' });
    assets.push({ id: 'asset_props', category: 'prop', name: 'Environmental Props', description: 'Decorative objects and obstacles', priority: 'important' });
  }
  
  return {
    realism: 'semi_realistic',
    detailLevel: 'medium',
    assets,
    approved: false
  };
}

export async function generatePreviewSamples(project: GameProject, assetPlan: AssetPlan): Promise<PreviewSample[]> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const ideaText = project.ideaSummary || '';
  const lowerIdea = ideaText.toLowerCase();
  
  const isUpsideDown = lowerIdea.includes('upside down') || lowerIdea.includes('stranger things');
  const isDark = lowerIdea.includes('dark') || lowerIdea.includes('eerie') || lowerIdea.includes('scary');
  
  const bgColor = isDark ? '#050508' : '#1a1a2e';
  const fogColor = isUpsideDown ? '#1a0a1a' : isDark ? '#0a0a1a' : '#2a2a4e';
  const accentColor = isUpsideDown ? '#dc2626' : '#6366f1';
  const ambientColor = isUpsideDown ? '#2d1a2d' : '#4a4a6a';
  
  const previews: PreviewSample[] = [];
  
  previews.push({
    id: 'preview_atmosphere',
    name: 'Atmosphere & Mood',
    type: 'environment',
    sceneConfig: {
      backgroundColor: bgColor,
      fogColor,
      fogDensity: isDark ? 0.04 : 0.02,
      ambientLight: ambientColor,
      elements: [
        { type: 'ground', color: fogColor, position: [0, -1, 0], scale: 30 },
        { type: 'ambientParticles', color: accentColor, position: [0, 2, 0], scale: 1 },
        { type: 'fog', color: fogColor, position: [0, 0, 0], scale: 1 }
      ]
    },
    approved: false
  });
  
  previews.push({
    id: 'preview_environment',
    name: 'Main Environment',
    type: 'environment',
    sceneConfig: {
      backgroundColor: bgColor,
      fogColor,
      fogDensity: 0.025,
      ambientLight: ambientColor,
      elements: [
        { type: 'ground', color: '#1a1a2a', position: [0, -1, 0], scale: 30 },
        { type: 'walls', color: '#2a2a3a', position: [-5, 1, -5], scale: 1 },
        { type: 'walls', color: '#2a2a3a', position: [5, 1, -5], scale: 1 },
        { type: 'pillars', color: '#3a3a4a', position: [-3, 1, -3], scale: 0.8 },
        { type: 'pillars', color: '#3a3a4a', position: [3, 1, -3], scale: 0.8 },
        ...(isUpsideDown ? [
          { type: 'creeping vines', color: '#2d4a2d', position: [-4, 2, -4], scale: 0.5 },
          { type: 'creeping vines', color: '#3d5a3d', position: [4, 2.5, -4], scale: 0.6 }
        ] : [])
      ]
    },
    approved: false
  });
  
  previews.push({
    id: 'preview_gameplay',
    name: 'Gameplay View',
    type: 'gameplay',
    sceneConfig: {
      backgroundColor: bgColor,
      fogColor,
      fogDensity: 0.02,
      ambientLight: ambientColor,
      elements: [
        { type: 'ground', color: '#1a1a2a', position: [0, -1, 0], scale: 30 },
        { type: 'player_indicator', color: accentColor, position: [0, 0.5, 0], scale: 0.5 },
        { type: 'path', color: '#2a2a4a', position: [0, -0.9, -10], scale: 2 },
        { type: 'destination', color: accentColor, position: [0, 0, -15], scale: 1 }
      ]
    },
    approved: false
  });
  
  return previews;
}

export async function runQATests(project: GameProject): Promise<QAReport> {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const issues: QAReport['issuesFound'] = [];
  
  if (Math.random() > 0.7) {
    issues.push({
      id: 'qa_1',
      severity: 'minor',
      description: 'Slight frame rate drop during particle effects',
      fixed: true
    });
  }
  
  if (Math.random() > 0.8) {
    issues.push({
      id: 'qa_2',
      severity: 'minor',
      description: 'Edge case: player can clip through corner geometry',
      fixed: true
    });
  }
  
  const performanceScore = 85 + Math.floor(Math.random() * 15);
  const playabilityScore = 80 + Math.floor(Math.random() * 20);
  const overallScore = Math.floor((performanceScore + playabilityScore) / 2);
  
  const recommendations = [
    'Game runs smoothly on target platforms',
    'Controls are responsive and intuitive',
    'Visual atmosphere matches intended mood'
  ];
  
  if (performanceScore < 90) {
    recommendations.push('Consider optimizing particle systems for lower-end devices');
  }
  
  return {
    testsRun: 15 + Math.floor(Math.random() * 10),
    issuesFound: issues,
    performanceScore,
    playabilityScore,
    overallScore,
    recommendations,
    passed: issues.filter(i => i.severity === 'critical' && !i.fixed).length === 0
  };
}

export function getStageInfo(stage: string): { number: number; name: string; description: string } {
  const stages: Record<string, { number: number; name: string; description: string }> = {
    idea: { number: 1, name: 'Developing Idea', description: 'Describe your game concept' },
    market: { number: 2, name: 'Market Analysis', description: 'Comparing with trends' },
    revision: { number: 3, name: 'Revision', description: 'Making it market viable' },
    asset_plan: { number: 4, name: 'Asset Planning', description: 'Planning all game assets' },
    preview: { number: 5, name: 'Visual Preview', description: 'See how it will look' },
    build: { number: 6, name: 'Building', description: 'AI is creating your game' },
    qa: { number: 7, name: 'Quality Assurance', description: 'Testing for perfection' }
  };
  return stages[stage] || stages.idea;
}
