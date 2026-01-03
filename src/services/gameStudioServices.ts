import { GameProject, GameGenre, MarketReport, RevisionPlan, AssetPlan, PreviewSample, QAReport, AssetProductionItem, AssetPipelineStep, AssetStatus } from '../types/state';

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

function createAssetProductionItem(
  id: string, 
  category: AssetProductionItem['category'], 
  name: string, 
  description: string, 
  priority: AssetProductionItem['priority']
): AssetProductionItem {
  const pipelineForCategory: Record<AssetProductionItem['category'], AssetPipelineStep[]> = {
    character: ['meshgen', 'segmentation', 'part_completion', 'retopology', 'uv_unwrap', 'texturing'],
    environment: ['meshgen', 'retopology', 'uv_unwrap', 'texturing'],
    prop: ['meshgen', 'retopology', 'uv_unwrap', 'texturing'],
    effect: [],
    ui: []
  };
  
  const pipeline = pipelineForCategory[category];
  const defaultStepProgress: Record<AssetPipelineStep, { status: AssetStatus; progress: number }> = {
    meshgen: { status: 'pending', progress: 0 },
    segmentation: { status: 'pending', progress: 0 },
    part_completion: { status: 'pending', progress: 0 },
    retopology: { status: 'pending', progress: 0 },
    uv_unwrap: { status: 'pending', progress: 0 },
    texturing: { status: 'pending', progress: 0 }
  };
  
  return {
    id,
    category,
    name,
    description,
    priority,
    pipeline,
    currentStep: null,
    stepProgress: defaultStepProgress,
    overallProgress: 0
  };
}

export async function generateAssetPlan(project: GameProject): Promise<AssetPlan> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const ideaText = project.ideaSummary || project.conversation.filter(m => m.role === 'user').map(m => m.content).join(' ');
  const lowerIdea = ideaText.toLowerCase();
  
  const assets: AssetProductionItem[] = [];
  
  assets.push(createAssetProductionItem('asset_player', 'character', 'Player Character', 'Main playable character or first-person viewpoint', 'essential'));
  
  if (lowerIdea.includes('mall') || lowerIdea.includes('building') || lowerIdea.includes('indoor')) {
    assets.push(createAssetProductionItem('asset_interior', 'environment', 'Interior Environment', 'Indoor spaces with walls, floors, ceiling', 'essential'));
  }
  
  if (lowerIdea.includes('metro') || lowerIdea.includes('station') || lowerIdea.includes('subway')) {
    assets.push(createAssetProductionItem('asset_metro', 'environment', 'Metro Station', 'Underground transit area', 'essential'));
  }
  
  if (lowerIdea.includes('fountain') || lowerIdea.includes('water')) {
    assets.push(createAssetProductionItem('asset_fountain', 'prop', 'Water Fountain', 'Decorative water feature', 'important'));
  }
  
  if (lowerIdea.includes('tower') || lowerIdea.includes('burj') || lowerIdea.includes('skyscraper')) {
    assets.push(createAssetProductionItem('asset_tower', 'environment', 'Landmark Tower', 'Iconic tall building in background', 'important'));
  }
  
  if (lowerIdea.includes('vine') || lowerIdea.includes('overgrown') || lowerIdea.includes('upside down')) {
    assets.push(createAssetProductionItem('asset_vines', 'prop', 'Creeping Vines', 'Organic growth covering surfaces', 'essential'));
    assets.push(createAssetProductionItem('asset_decay', 'effect', 'Decay Effects', 'Particles and fog for eerie atmosphere', 'important'));
  }
  
  if (lowerIdea.includes('dark') || lowerIdea.includes('eerie') || lowerIdea.includes('scary')) {
    assets.push(createAssetProductionItem('asset_lighting', 'effect', 'Atmospheric Lighting', 'Moody, dim lighting with shadows', 'essential'));
    assets.push(createAssetProductionItem('asset_particles', 'effect', 'Ambient Particles', 'Floating dust, spores, or embers', 'important'));
  }
  
  assets.push(createAssetProductionItem('asset_ui', 'ui', 'Game UI', 'Menus, HUD, and interface elements', 'essential'));
  
  if (assets.length < 5) {
    assets.push(createAssetProductionItem('asset_ground', 'environment', 'Ground/Floor', 'Main walkable surface', 'essential'));
    assets.push(createAssetProductionItem('asset_props', 'prop', 'Environmental Props', 'Decorative objects and obstacles', 'important'));
  }
  
  return {
    realism: 'semi_realistic',
    detailLevel: 'medium',
    assets,
    totalAssets: assets.length,
    completedAssets: 0,
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
