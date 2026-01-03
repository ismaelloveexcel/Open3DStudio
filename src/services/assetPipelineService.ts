import { AssetProductionItem, AssetPipelineStep, AssetStatus, AssetPlan } from '../types/state';

const STEP_LABELS: Record<AssetPipelineStep, string> = {
  meshgen: 'Generating 3D Mesh',
  segmentation: 'Segmenting Parts',
  part_completion: 'Completing Parts',
  retopology: 'Low-Poly Retopology',
  uv_unwrap: 'UV Unwrapping',
  texturing: 'Generating Textures'
};

const STEP_DURATION_MS: Record<AssetPipelineStep, number> = {
  meshgen: 2000,
  segmentation: 1500,
  part_completion: 1800,
  retopology: 1200,
  uv_unwrap: 1000,
  texturing: 2200
};

export interface PipelineProgress {
  assetId: string;
  assetName: string;
  currentStep: AssetPipelineStep | null;
  stepLabel: string;
  stepProgress: number;
  overallProgress: number;
  isComplete: boolean;
}

export interface PipelineCallbacks {
  onAssetProgress: (progress: PipelineProgress) => void;
  onAssetComplete: (assetId: string, finalAsset: AssetProductionItem) => void;
  onPipelineComplete: (assets: AssetProductionItem[]) => void;
  onError: (assetId: string, step: AssetPipelineStep, error: string) => void;
}

export async function runAssetPipeline(
  assetPlan: AssetPlan,
  callbacks: PipelineCallbacks
): Promise<AssetProductionItem[]> {
  const updatedAssets: AssetProductionItem[] = [];
  
  for (const asset of assetPlan.assets) {
    if (asset.pipeline.length === 0) {
      const completedAsset: AssetProductionItem = {
        ...asset,
        overallProgress: 100,
        currentStep: null
      };
      updatedAssets.push(completedAsset);
      callbacks.onAssetComplete(asset.id, completedAsset);
      continue;
    }
    
    let currentAsset = { ...asset };
    const totalSteps = asset.pipeline.length;
    
    for (let stepIndex = 0; stepIndex < asset.pipeline.length; stepIndex++) {
      const step = asset.pipeline[stepIndex];
      const stepDuration = STEP_DURATION_MS[step];
      const progressInterval = 50;
      const progressIncrements = stepDuration / progressInterval;
      
      currentAsset = {
        ...currentAsset,
        currentStep: step,
        stepProgress: {
          ...currentAsset.stepProgress,
          [step]: { status: 'generating' as AssetStatus, progress: 0 }
        }
      };
      
      for (let i = 0; i <= progressIncrements; i++) {
        const stepProgress = Math.min(100, (i / progressIncrements) * 100);
        const overallProgress = ((stepIndex + stepProgress / 100) / totalSteps) * 100;
        
        currentAsset = {
          ...currentAsset,
          stepProgress: {
            ...currentAsset.stepProgress,
            [step]: { status: 'generating' as AssetStatus, progress: stepProgress }
          },
          overallProgress
        };
        
        callbacks.onAssetProgress({
          assetId: asset.id,
          assetName: asset.name,
          currentStep: step,
          stepLabel: STEP_LABELS[step],
          stepProgress,
          overallProgress,
          isComplete: false
        });
        
        await new Promise(resolve => setTimeout(resolve, progressInterval));
      }
      
      currentAsset = {
        ...currentAsset,
        stepProgress: {
          ...currentAsset.stepProgress,
          [step]: { status: 'completed' as AssetStatus, progress: 100 }
        }
      };
    }
    
    currentAsset = {
      ...currentAsset,
      currentStep: null,
      overallProgress: 100,
      previewUrl: `/assets/preview_${asset.id}.png`,
      finalAssetUrl: `/assets/${asset.id}.glb`
    };
    
    updatedAssets.push(currentAsset);
    callbacks.onAssetComplete(asset.id, currentAsset);
    
    callbacks.onAssetProgress({
      assetId: asset.id,
      assetName: asset.name,
      currentStep: null,
      stepLabel: 'Complete',
      stepProgress: 100,
      overallProgress: 100,
      isComplete: true
    });
  }
  
  callbacks.onPipelineComplete(updatedAssets);
  return updatedAssets;
}

export function getStepLabel(step: AssetPipelineStep): string {
  return STEP_LABELS[step];
}

export function getPipelineStepsForCategory(category: AssetProductionItem['category']): AssetPipelineStep[] {
  const pipelineForCategory: Record<AssetProductionItem['category'], AssetPipelineStep[]> = {
    character: ['meshgen', 'segmentation', 'part_completion', 'retopology', 'uv_unwrap', 'texturing'],
    environment: ['meshgen', 'retopology', 'uv_unwrap', 'texturing'],
    prop: ['meshgen', 'retopology', 'uv_unwrap', 'texturing'],
    effect: [],
    ui: []
  };
  return pipelineForCategory[category];
}

export function calculateTotalPipelineTime(assetPlan: AssetPlan): number {
  let totalMs = 0;
  for (const asset of assetPlan.assets) {
    for (const step of asset.pipeline) {
      totalMs += STEP_DURATION_MS[step];
    }
  }
  return totalMs;
}

export function formatPipelineTime(ms: number): string {
  const seconds = Math.ceil(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}
