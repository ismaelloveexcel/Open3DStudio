import React, { useState, useRef, useEffect } from 'react';
import ProjectWizard from './ProjectWizard';
import styled, { keyframes } from 'styled-components';
import { useStore, useStoreActions } from '../../store';
import { GameProject, ChatMessage, GameGenre, ProjectStage } from '../../types/state';
import { ConceptPreviewScene } from './ConceptPreviewScene';
import { 
  generateMarketReport, 
  generateRevisionPlan, 
  generateAssetPlan, 
  generatePreviewSamples,
  runQATests,
  getStageInfo
} from '../../services/gameStudioServices';
import { runAssetPipeline, PipelineProgress } from '../../services/assetPipelineService';
import { GameCodeGenerator } from '../../utils/gameCodeGenerator';
import { AssetProductionItem } from '../../types/state';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: ${props => props.theme.spacing.sm};
  overflow: hidden;
`;

const StageTimeline = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow-x: auto;
  flex-shrink: 0;
`;

const StageItem = styled.div<{ active?: boolean; completed?: boolean; clickable?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  white-space: nowrap;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  background: ${props => props.active ? props.theme.colors.primary[500] : props.completed ? props.theme.colors.success + '40' : 'transparent'};
  color: ${props => props.active ? 'white' : props.completed ? props.theme.colors.success : props.theme.colors.text.muted};
  border: 1px solid ${props => props.active ? props.theme.colors.primary[500] : props.completed ? props.theme.colors.success : 'transparent'};
  
  &:hover {
    ${props => props.clickable && `background: ${props.theme.colors.primary[500]}30;`}
  }
`;

const StageNumber = styled.span<{ completed?: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  background: ${props => props.completed ? props.theme.colors.success : 'rgba(255,255,255,0.2)'};
`;

const StageConnector = styled.div`
  width: 12px;
  height: 2px;
  background: ${props => props.theme.colors.border.default};
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  overflow: hidden;
`;

const StageHeader = styled.div`
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border.default};
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const StageHeaderLeft = styled.div`
  flex: 1;
`;

const StageTitle = styled.h3`
  margin: 0 0 4px 0;
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.fontSize.lg};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const StageDescription = styled.p`
  margin: 0;
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const ReviewButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: transparent;
  border: 1px solid ${props => props.theme.colors.warning};
  color: ${props => props.theme.colors.warning};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.theme.colors.warning}20;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border.default};
`;

const ChatMessages = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: 4px;
  padding: ${props => props.theme.spacing.sm};
  
  span {
    width: 8px;
    height: 8px;
    background: ${props => props.theme.colors.primary[500]};
    border-radius: 50%;
    animation: ${pulse} 1.4s infinite;
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
`;

const MessageBubble = styled.div<{ role: string }>`
  max-width: 90%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  line-height: 1.5;
  align-self: ${props => props.role === 'user' ? 'flex-end' : 'flex-start'};
  background: ${props => props.role === 'user' ? props.theme.colors.primary[500] : props.theme.colors.background.secondary};
  color: ${props => props.role === 'user' ? 'white' : props.theme.colors.text.primary};
  
  p { margin: 0 0 4px 0; &:last-child { margin: 0; } }
`;

const InputArea = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.md};
  flex-shrink: 0;
`;

const TextInput = styled.textarea`
  flex: 1;
  background: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.border.default};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  resize: none;
  min-height: 60px;
  font-family: inherit;
  
  &:focus { outline: none; border-color: ${props => props.theme.colors.primary[500]}; }
  &::placeholder { color: ${props => props.theme.colors.text.muted}; }
`;

const Button = styled.button<{ variant?: 'primary' | 'success' | 'secondary' }>`
  background: ${props => {
    if (props.variant === 'primary') return props.theme.colors.primary[500];
    if (props.variant === 'success') return props.theme.colors.success;
    return props.theme.colors.background.tertiary;
  }};
  color: ${props => props.variant ? 'white' : props.theme.colors.text.primary};
  border: 1px solid ${props => props.variant ? 'transparent' : props.theme.colors.border.default};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  
  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
`;

const Card = styled.div<{ approved?: boolean }>`
  background: ${props => props.theme.colors.background.secondary};
  border: 2px solid ${props => props.approved ? props.theme.colors.success : props.theme.colors.border.default};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  
  h4 { margin: 0 0 8px 0; color: ${props => props.theme.colors.text.primary}; font-size: 14px; }
  p { margin: 0; color: ${props => props.theme.colors.text.secondary}; font-size: 12px; }
`;

const ProgressBar = styled.div<{ value: number }>`
  width: 100%;
  height: 8px;
  background: ${props => props.theme.colors.background.tertiary};
  border-radius: 4px;
  overflow: hidden;
  
  &::after {
    content: '';
    display: block;
    width: ${props => props.value}%;
    height: 100%;
    background: ${props => props.value >= 80 ? props.theme.colors.success : props.value >= 60 ? props.theme.colors.warning : props.theme.colors.error};
    transition: width 0.3s ease;
  }
`;

const ScoreDisplay = styled.div<{ score: number }>`
  font-size: 32px;
  font-weight: bold;
  color: ${props => props.score >= 80 ? props.theme.colors.success : props.score >= 60 ? props.theme.colors.warning : props.theme.colors.error};
  text-align: center;
  margin: ${props => props.theme.spacing.md} 0;
`;

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${props => props.theme.spacing.md};
`;

const PreviewCard = styled.div<{ approved?: boolean }>`
  background: ${props => props.theme.colors.background.secondary};
  border: 2px solid ${props => props.approved ? props.theme.colors.success : props.theme.colors.border.default};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
  
  h4 { 
    margin: 0; 
    padding: ${props => props.theme.spacing.sm}; 
    background: ${props => props.approved ? props.theme.colors.success + '20' : 'transparent'};
    color: ${props => props.theme.colors.text.primary}; 
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

const SelectControl = styled.select`
  background: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.border.default};
  color: ${props => props.theme.colors.text.primary};
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  flex-wrap: wrap;
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${props => props.theme.colors.border.default};
  border-top-color: ${props => props.theme.colors.primary[500]};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: ${props => props.theme.spacing.xl} auto;
`;

const LoadingText = styled.p`
  text-align: center;
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin-top: ${props => props.theme.spacing.md};
`;

const stageOrder: ProjectStage[] = ['idea', 'market', 'revision', 'asset_plan', 'preview', 'build', 'qa'];

const GameStudioPanel: React.FC = () => {
  const { gameStudio } = useStore();
  const { updateGameProject, addChatMessage, setCurrentGameProject, deleteGameProject, addNotification } = useStoreActions();
  
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [showReviewMenu, setShowReviewMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const currentProject = gameStudio.projects.find(p => p.id === gameStudio.currentProjectId);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentProject?.conversation]);
  
  if (!currentProject) {
    return <ProjectWizard onComplete={() => {}} />;
  }
  
  const stage = currentProject.stage || 'idea';
  const stageInfo = getStageInfo(stage);
  const currentStageIndex = stageOrder.indexOf(stage);
  
  const goToStage = (targetStage: ProjectStage) => {
    const targetIndex = stageOrder.indexOf(targetStage);
    if (targetIndex < currentStageIndex) {
      updateGameProject(currentProject.id, { stage: targetStage });
      setShowReviewMenu(false);
    }
  };
  
  const canReview = currentStageIndex > 0;
  
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;
    
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };
    
    addChatMessage(currentProject.id, userMessage);
    setInputValue('');
    
    if (stage === 'idea') {
      updateGameProject(currentProject.id, { ideaSummary: inputValue.trim() });
      
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: `msg_${Date.now()}`,
          role: 'assistant',
          content: `I understand your vision:\n\n"${inputValue.trim()}"\n\nThis sounds like a unique experience! When you're ready, click "Proceed to Market Analysis" to see how this compares to current trends.`,
          timestamp: new Date()
        };
        addChatMessage(currentProject.id, aiResponse);
      }, 800);
    }
  };
  
  const proceedToNextStage = async () => {
    const nextIndex = currentStageIndex + 1;
    if (nextIndex >= stageOrder.length) return;
    
    const nextStage = stageOrder[nextIndex];
    setIsProcessing(true);
    
    try {
      switch (nextStage) {
        case 'market':
          setProcessingMessage('Analyzing market trends...');
          const marketReport = await generateMarketReport(currentProject);
          updateGameProject(currentProject.id, { stage: 'market', marketReport });
          break;
          
        case 'revision':
          setProcessingMessage('Generating improvement suggestions...');
          if (!currentProject.marketReport) {
            throw new Error('Market report not available');
          }
          const revisionPlan = await generateRevisionPlan(currentProject, currentProject.marketReport);
          updateGameProject(currentProject.id, { stage: 'revision', revisionPlan });
          break;
          
        case 'asset_plan':
          setProcessingMessage('Planning game assets...');
          const assetPlan = await generateAssetPlan(currentProject);
          updateGameProject(currentProject.id, { stage: 'asset_plan', assetPlan });
          break;
          
        case 'preview':
          setProcessingMessage('Generating visual previews...');
          if (!currentProject.assetPlan) {
            throw new Error('Asset plan not available');
          }
          const previewSamples = await generatePreviewSamples(currentProject, currentProject.assetPlan);
          updateGameProject(currentProject.id, { stage: 'preview', previewSamples });
          break;
          
        case 'build':
          if (!currentProject.assetPlan) {
            throw new Error('Asset plan not available');
          }
          const projectId = currentProject.id;
          const initialAssetPlan = { ...currentProject.assetPlan };
          let buildingAssets = [...initialAssetPlan.assets];
          
          updateGameProject(projectId, { stage: 'build' });
          setIsProcessing(false);
          
          await runAssetPipeline(initialAssetPlan, {
            onAssetProgress: (progress: PipelineProgress) => {
              buildingAssets = buildingAssets.map(a => {
                if (a.id === progress.assetId) {
                  return {
                    ...a,
                    currentStep: progress.currentStep,
                    overallProgress: progress.overallProgress,
                    stepProgress: {
                      ...a.stepProgress,
                      ...(progress.currentStep ? {
                        [progress.currentStep]: { status: 'generating' as const, progress: progress.stepProgress }
                      } : {})
                    }
                  };
                }
                return a;
              });
              updateGameProject(projectId, { 
                assetPlan: { ...initialAssetPlan, assets: buildingAssets }
              });
            },
            onAssetComplete: (assetId: string, finalAsset: AssetProductionItem) => {
              buildingAssets = buildingAssets.map(a => a.id === assetId ? finalAsset : a);
              const completedCount = buildingAssets.filter(a => a.overallProgress === 100).length;
              updateGameProject(projectId, { 
                assetPlan: { 
                  ...initialAssetPlan, 
                  assets: buildingAssets,
                  completedAssets: completedCount
                }
              });
            },
            onPipelineComplete: (assets: AssetProductionItem[]) => {
              const finalProject = useStore.getState().gameStudio.projects.find(p => p.id === projectId);
              const gameCode = GameCodeGenerator.generateHTML5Game(finalProject || currentProject);
              updateGameProject(projectId, { 
                assetPlan: { ...initialAssetPlan, assets, completedAssets: assets.length },
                generatedCode: gameCode 
              });
            },
            onError: (assetId: string, step, error: string) => {
              addNotification({ type: 'error', title: 'Asset Error', message: `Failed to process ${assetId}: ${error}`, duration: 5000 });
            }
          });
          return;
          
        case 'qa':
          setProcessingMessage('Running quality tests...');
          const qaReport = await runQATests(currentProject);
          updateGameProject(currentProject.id, { stage: 'qa', qaReport });
          break;
      }
    } catch (error) {
      addNotification({ type: 'error', title: 'Error', message: 'Failed to process stage', duration: 3000 });
    }
    
    setIsProcessing(false);
    setProcessingMessage('');
  };
  
  const approvePreview = (previewId: string) => {
    if (!currentProject.previewSamples) return;
    const updated = currentProject.previewSamples.map(p => 
      p.id === previewId ? { ...p, approved: true } : p
    );
    updateGameProject(currentProject.id, { previewSamples: updated });
  };
  
  const approveAllPreviews = () => {
    if (!currentProject.previewSamples) return;
    const updated = currentProject.previewSamples.map(p => ({ ...p, approved: true }));
    updateGameProject(currentProject.id, { previewSamples: updated });
  };
  
  const allPreviewsApproved = currentProject.previewSamples?.every(p => p.approved) || false;
  
  const renderStageContent = () => {
    if (isProcessing) {
      return (
        <ContentArea>
          <LoadingSpinner />
          <LoadingText>{processingMessage}</LoadingText>
        </ContentArea>
      );
    }
    
    switch (stage) {
      case 'idea':
        return (
          <>
            <ContentArea>
              <ChatMessages>
                {currentProject.conversation.map(msg => (
                  <MessageBubble key={msg.id} role={msg.role}>
                    {msg.content.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </MessageBubble>
                ))}
                <div ref={messagesEndRef} />
              </ChatMessages>
            </ContentArea>
            <InputArea>
              <TextInput
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Describe your game idea in 4-5 lines... What's the setting? What does the player do? What's the mood?"
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Button variant="primary" onClick={handleSendMessage} disabled={!inputValue.trim()}>
                  Send
                </Button>
                {currentProject.ideaSummary && (
                  <Button variant="success" onClick={proceedToNextStage}>
                    Proceed
                  </Button>
                )}
              </div>
            </InputArea>
          </>
        );
        
      case 'market':
        const market = currentProject.marketReport;
        return (
          <ContentArea>
            <h4 style={{ marginTop: 0 }}>Market Viability Score</h4>
            <ScoreDisplay score={market?.viabilityScore || 0}>{market?.viabilityScore || 0}%</ScoreDisplay>
            <ProgressBar value={market?.viabilityScore || 0} />
            
            <h4 style={{ marginTop: 24 }}>Similar Games in Market</h4>
            <CardGrid>
              {market?.similarGames.map((game, i) => (
                <Card key={i}>
                  <h4>{game.name}</h4>
                  <p>Success Score: {game.successScore}%</p>
                  <p style={{ marginTop: 8 }}>{game.features.join(', ')}</p>
                </Card>
              ))}
            </CardGrid>
            
            <h4 style={{ marginTop: 24 }}>Current Trends</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {market?.trends.map((trend, i) => (
                <span key={i} style={{ padding: '4px 12px', background: 'rgba(99, 102, 241, 0.2)', borderRadius: 16, fontSize: 12 }}>
                  {trend}
                </span>
              ))}
            </div>
            
            <h4 style={{ marginTop: 24 }}>Opportunities</h4>
            <ul>
              {market?.opportunities.map((opp, i) => (
                <li key={i} style={{ color: '#10b981', marginBottom: 4 }}>{opp}</li>
              ))}
            </ul>
            
            <div style={{ marginTop: 24 }}>
              <Button variant="success" onClick={proceedToNextStage}>
                Continue to Revision Stage
              </Button>
            </div>
          </ContentArea>
        );
        
      case 'revision':
        const revision = currentProject.revisionPlan;
        return (
          <ContentArea>
            <h4 style={{ marginTop: 0 }}>Suggested Improvements</h4>
            <p style={{ color: '#9ca3af', marginBottom: 16 }}>Based on market analysis, here are recommendations to make your game more successful:</p>
            
            <CardGrid>
              {revision?.suggestedChanges.map((change, i) => (
                <Card key={i}>
                  <h4>{change.area}</h4>
                  <p>{change.suggestion}</p>
                  <span style={{ 
                    display: 'inline-block',
                    marginTop: 8,
                    padding: '2px 8px', 
                    borderRadius: 4, 
                    fontSize: 10,
                    background: change.impact === 'high' ? '#ef4444' : change.impact === 'medium' ? '#f59e0b' : '#6b7280'
                  }}>
                    {change.impact.toUpperCase()} IMPACT
                  </span>
                </Card>
              ))}
            </CardGrid>
            
            <div style={{ marginTop: 24 }}>
              <Button variant="success" onClick={proceedToNextStage}>
                Approve & Continue to Asset Planning
              </Button>
            </div>
          </ContentArea>
        );
        
      case 'asset_plan':
        const assets = currentProject.assetPlan;
        const pipelineStepLabels: Record<string, string> = {
          meshgen: 'MeshGen',
          segmentation: 'Segment',
          part_completion: 'Complete',
          retopology: 'Retopo',
          uv_unwrap: 'UV',
          texturing: 'Texture'
        };
        return (
          <ContentArea>
            <HeaderRow>
              <h4 style={{ margin: 0 }}>Asset Production Blueprint</h4>
              <div style={{ display: 'flex', gap: 8 }}>
                <SelectControl 
                  value={assets?.realism || 'semi_realistic'}
                  onChange={(e) => updateGameProject(currentProject.id, { 
                    assetPlan: { ...assets!, realism: e.target.value as any }
                  })}
                >
                  <option value="stylized">Stylized</option>
                  <option value="semi_realistic">Semi-Realistic</option>
                  <option value="realistic">Realistic</option>
                </SelectControl>
                <SelectControl 
                  value={assets?.detailLevel || 'medium'}
                  onChange={(e) => updateGameProject(currentProject.id, { 
                    assetPlan: { ...assets!, detailLevel: e.target.value as any }
                  })}
                >
                  <option value="low">Low Detail</option>
                  <option value="medium">Medium Detail</option>
                  <option value="high">High Detail</option>
                </SelectControl>
              </div>
            </HeaderRow>
            
            <p style={{ color: '#9ca3af', margin: '16px 0' }}>
              Each asset will be automatically processed through the AI pipeline. The stages shown below will run automatically during the build.
            </p>
            
            <CardGrid>
              {assets?.assets.map((asset) => (
                <Card key={asset.id}>
                  <h4>{asset.name}</h4>
                  <p style={{ fontSize: 12, marginBottom: 8 }}>{asset.description}</p>
                  
                  {asset.pipeline.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ fontSize: 10, color: '#6b7280', marginBottom: 4 }}>AI Pipeline:</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {asset.pipeline.map((step, i) => (
                          <span key={step} style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            gap: 4,
                            padding: '2px 6px', 
                            borderRadius: 4, 
                            fontSize: 9,
                            background: 'rgba(99, 102, 241, 0.15)',
                            color: '#a5b4fc'
                          }}>
                            {pipelineStepLabels[step]}
                            {i < asset.pipeline.length - 1 && <span style={{ opacity: 0.5 }}>→</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: 4, 
                      fontSize: 10,
                      background: 'rgba(99, 102, 241, 0.2)'
                    }}>
                      {asset.category}
                    </span>
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: 4, 
                      fontSize: 10,
                      background: asset.priority === 'essential' ? '#ef444440' : asset.priority === 'important' ? '#f59e0b40' : '#6b728040'
                    }}>
                      {asset.priority}
                    </span>
                  </div>
                </Card>
              ))}
            </CardGrid>
            
            <div style={{ marginTop: 24 }}>
              <Button variant="success" onClick={proceedToNextStage}>
                Approve Blueprint & Generate Previews
              </Button>
            </div>
          </ContentArea>
        );
        
      case 'preview':
        return (
          <ContentArea>
            <HeaderRow>
              <h4 style={{ margin: 0 }}>Visual Previews</h4>
              <Button variant="primary" onClick={approveAllPreviews}>
                Approve All
              </Button>
            </HeaderRow>
            <p style={{ color: '#9ca3af', margin: '16px 0' }}>
              Here's how your game will look. Approve each preview or all at once.
            </p>
            
            <PreviewGrid>
              {currentProject.previewSamples?.map((preview) => (
                <PreviewCard key={preview.id} approved={preview.approved}>
                  <ConceptPreviewScene 
                    preview={{ 
                      id: preview.id, 
                      type: preview.type as any, 
                      name: preview.name, 
                      description: '', 
                      approved: preview.approved,
                      sceneConfig: preview.sceneConfig 
                    }} 
                    size={{ width: 280, height: 180 }}
                  />
                  <h4>
                    {preview.name}
                    {!preview.approved && (
                      <Button onClick={() => approvePreview(preview.id)} style={{ padding: '4px 8px', fontSize: 10 }}>
                        Approve
                      </Button>
                    )}
                    {preview.approved && <span style={{ color: '#10b981', fontSize: 12 }}>Approved</span>}
                  </h4>
                </PreviewCard>
              ))}
            </PreviewGrid>
            
            <div style={{ marginTop: 24 }}>
              <Button 
                variant="success" 
                onClick={proceedToNextStage}
                disabled={!allPreviewsApproved}
              >
                {allPreviewsApproved ? 'Build Game' : 'Approve all previews to continue'}
              </Button>
            </div>
          </ContentArea>
        );
        
      case 'build':
        const buildAssets = currentProject.assetPlan?.assets || [];
        const buildStepLabels: Record<string, string> = {
          meshgen: 'Generating Mesh',
          segmentation: 'Segmenting',
          part_completion: 'Completing',
          retopology: 'Retopology',
          uv_unwrap: 'UV Unwrap',
          texturing: 'Texturing'
        };
        const completedCount = buildAssets.filter(a => a.overallProgress === 100).length;
        const totalBuildProgress = buildAssets.length > 0 
          ? buildAssets.reduce((sum, a) => sum + a.overallProgress, 0) / buildAssets.length 
          : 0;
        const buildComplete = totalBuildProgress === 100;
        
        return (
          <ContentArea>
            <HeaderRow>
              <h4 style={{ margin: 0 }}>
                {buildComplete ? 'Build Complete!' : 'Building Assets...'}
              </h4>
              <span style={{ color: '#9ca3af' }}>
                {completedCount}/{buildAssets.length} assets complete
              </span>
            </HeaderRow>
            
            <div style={{ margin: '16px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12 }}>Overall Progress</span>
                <span style={{ fontSize: 12 }}>{Math.round(totalBuildProgress)}%</span>
              </div>
              <ProgressBar value={totalBuildProgress} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {buildAssets.map((asset) => (
                <Card key={asset.id} approved={asset.overallProgress === 100}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <h4 style={{ margin: 0 }}>{asset.name}</h4>
                    <span style={{ 
                      fontSize: 12, 
                      color: asset.overallProgress === 100 ? '#10b981' : '#9ca3af'
                    }}>
                      {asset.overallProgress === 100 ? '✓ Complete' : `${Math.round(asset.overallProgress)}%`}
                    </span>
                  </div>
                  
                  {asset.pipeline.length > 0 && (
                    <>
                      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                        {asset.pipeline.map((step) => {
                          const stepStatus = asset.stepProgress[step];
                          const isActive = asset.currentStep === step;
                          const isComplete = stepStatus?.status === 'completed';
                          return (
                            <span key={step} style={{ 
                              padding: '2px 6px', 
                              borderRadius: 4, 
                              fontSize: 9,
                              background: isComplete ? '#10b98130' : isActive ? '#6366f130' : '#1f2937',
                              color: isComplete ? '#10b981' : isActive ? '#a5b4fc' : '#6b7280',
                              border: isActive ? '1px solid #6366f1' : '1px solid transparent'
                            }}>
                              {isComplete ? '✓' : ''} {buildStepLabels[step] || step}
                            </span>
                          );
                        })}
                      </div>
                      <ProgressBar value={asset.overallProgress} />
                    </>
                  )}
                  
                  {asset.pipeline.length === 0 && (
                    <span style={{ fontSize: 11, color: '#6b7280' }}>No processing needed</span>
                  )}
                </Card>
              ))}
            </div>
            
            {buildComplete && (
              <div style={{ marginTop: 24, textAlign: 'center' }}>
                <p style={{ color: '#10b981', marginBottom: 16 }}>
                  All assets generated successfully!
                </p>
                <Button variant="success" onClick={proceedToNextStage}>
                  Run QA Tests
                </Button>
              </div>
            )}
          </ContentArea>
        );
        
      case 'qa':
        const qa = currentProject.qaReport;
        return (
          <ContentArea>
            <h4 style={{ marginTop: 0 }}>Quality Assurance Report</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
              <Card>
                <h4>Performance</h4>
                <ScoreDisplay score={qa?.performanceScore || 0} style={{ fontSize: 24, margin: '8px 0' }}>
                  {qa?.performanceScore || 0}%
                </ScoreDisplay>
              </Card>
              <Card>
                <h4>Playability</h4>
                <ScoreDisplay score={qa?.playabilityScore || 0} style={{ fontSize: 24, margin: '8px 0' }}>
                  {qa?.playabilityScore || 0}%
                </ScoreDisplay>
              </Card>
              <Card>
                <h4>Overall</h4>
                <ScoreDisplay score={qa?.overallScore || 0} style={{ fontSize: 24, margin: '8px 0' }}>
                  {qa?.overallScore || 0}%
                </ScoreDisplay>
              </Card>
            </div>
            
            <h4>Tests Run: {qa?.testsRun || 0}</h4>
            
            {qa?.issuesFound && qa.issuesFound.length > 0 ? (
              <>
                <h4>Issues Found & Fixed</h4>
                {qa.issuesFound.map((issue) => (
                  <Card key={issue.id} style={{ marginBottom: 8 }} approved={issue.fixed}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{issue.description}</span>
                      <span style={{ 
                        padding: '2px 8px', 
                        borderRadius: 4, 
                        fontSize: 10,
                        background: issue.fixed ? '#10b98140' : '#ef444440'
                      }}>
                        {issue.fixed ? 'FIXED' : issue.severity.toUpperCase()}
                      </span>
                    </div>
                  </Card>
                ))}
              </>
            ) : (
              <p style={{ color: '#10b981' }}>No issues found! Game passed all tests.</p>
            )}
            
            <h4 style={{ marginTop: 24 }}>Recommendations</h4>
            <ul>
              {qa?.recommendations.map((rec, i) => (
                <li key={i} style={{ color: '#9ca3af', marginBottom: 4 }}>{rec}</li>
              ))}
            </ul>
            
            {qa?.passed && (
              <div style={{ marginTop: 24, textAlign: 'center' }}>
                <h3 style={{ color: '#10b981' }}>Your game is ready!</h3>
                <p style={{ color: '#9ca3af', marginBottom: 16 }}>Quality assurance passed. Your game is production-ready.</p>
                <Button variant="success" onClick={() => {
                  if (currentProject.generatedCode) {
                    const blob = new Blob([currentProject.generatedCode], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${currentProject.name.replace(/\s+/g, '_')}.html`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }
                }}>
                  Download Game
                </Button>
              </div>
            )}
          </ContentArea>
        );
        
      default:
        return <ContentArea>Unknown stage</ContentArea>;
    }
  };
  
  return (
    <Container>
      <StageTimeline>
        {stageOrder.map((s, index) => {
          const info = getStageInfo(s);
          const isActive = s === stage;
          const isCompleted = index < currentStageIndex;
          const canClick = isCompleted;
          
          return (
            <React.Fragment key={s}>
              {index > 0 && <StageConnector />}
              <StageItem 
                active={isActive} 
                completed={isCompleted} 
                clickable={canClick}
                onClick={() => canClick && goToStage(s)}
                title={canClick ? `Click to review ${info.name}` : undefined}
              >
                <StageNumber completed={isCompleted}>
                  {isCompleted ? '✓' : info.number}
                </StageNumber>
                {info.name}
              </StageItem>
            </React.Fragment>
          );
        })}
      </StageTimeline>
      
      <StageHeader>
        <StageHeaderLeft>
          <StageTitle>
            Stage {stageInfo.number}: {stageInfo.name}
          </StageTitle>
          <StageDescription>{stageInfo.description}</StageDescription>
        </StageHeaderLeft>
        {canReview && (
          <div style={{ position: 'relative' }}>
            <ReviewButton onClick={() => setShowReviewMenu(!showReviewMenu)}>
              <span>&#8592;</span> Review Previous
            </ReviewButton>
            {showReviewMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 8,
                background: '#1e1e2e',
                border: '1px solid #3f3f5a',
                borderRadius: 8,
                padding: 8,
                zIndex: 100,
                minWidth: 180
              }}>
                {stageOrder.slice(0, currentStageIndex).map(s => {
                  const info = getStageInfo(s);
                  return (
                    <div
                      key={s}
                      onClick={() => goToStage(s)}
                      style={{
                        padding: '8px 12px',
                        cursor: 'pointer',
                        borderRadius: 4,
                        fontSize: 13,
                        color: '#e0e0e0'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#2a2a3e'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      Stage {info.number}: {info.name}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </StageHeader>
      
      <MainContent>
        {renderStageContent()}
      </MainContent>
    </Container>
  );
};

export default GameStudioPanel;
