import React from 'react';
import styled from 'styled-components';
import { useCurrentModule, useStoreActions } from '../../store';

const SidebarNavContainer = styled.nav`
  width: 80px;
  background: ${props => props.theme.colors.background.secondary};
  border-right: 1px solid ${props => props.theme.colors.border.default};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 0;
  gap: 2px;
  position: relative;
  z-index: 101;
  overflow-y: auto;
  overflow-x: hidden;
`;

const NavSection = styled.div`
  width: 100%;
  margin-bottom: 16px;
`;

const NavButton = styled.button<{ active: boolean }>`
  width: 56px;
  height: 48px;
  background: ${props => props.active ? props.theme.colors.primary[100] : 'transparent'};
  border: none;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${props => props.active ? props.theme.colors.primary[700] : props.theme.colors.text.secondary};
  font-size: 18px;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s;
  &:hover {
    background: ${props => props.theme.colors.primary[50]};
    color: ${props => props.theme.colors.primary[700]};
  }
`;

const navItems = [
  { id: 'start', icon: 'fas fa-home', label: 'Start Here' },
  { id: 'game-concept', icon: 'fas fa-lightbulb', label: 'Game Concept' },
  { id: 'playable-generator', icon: 'fas fa-gamepad', label: 'Playable Generator' },
  { id: 'favorites', icon: 'fas fa-heart', label: 'Favorites' },
  { id: 'image-generator', icon: 'fas fa-image', label: 'Image Generator' },
  { id: '3d-asset-generator', icon: 'fas fa-cube', label: '3D Asset Generator' },
  { id: 'video-generator', icon: 'fas fa-video', label: 'Video Generator' },
  { id: 'sprite-generator', icon: 'fas fa-th', label: 'Sprite Generator' },
  { id: 'audio-generator', icon: 'fas fa-music', label: 'Audio Generator' },
  { id: 'idea-pathfinder', icon: 'fas fa-route', label: 'Idea Pathfinder' },
  { id: 'game-ideator', icon: 'fas fa-brain', label: 'Game Ideator' },
  { id: 'ask-ludo', icon: 'fas fa-question-circle', label: 'Ask Ludo' },
  { id: 'market-trends', icon: 'fas fa-chart-line', label: 'Market Trends' },
  { id: 'search', icon: 'fas fa-search', label: 'Search' },
  { id: 'top-charts', icon: 'fas fa-trophy', label: 'Top Charts' },
  { id: 'settings', icon: 'fas fa-cog', label: 'Settings' },
];

const SidebarNav: React.FC = () => {
  const currentModule = useCurrentModule();
  const { setCurrentModule } = useStoreActions();

  return (
    <SidebarNavContainer>
      {navItems.map(item => (
        <NavButton
          key={item.id}
          active={currentModule === item.id}
          title={item.label}
          onClick={() => setCurrentModule(item.id as any)}
        >
          <i className={item.icon}></i>
          <span style={{ fontSize: 8, marginTop: 2, textAlign: 'center', lineHeight: 1.1 }}>{item.label}</span>
        </NavButton>
      ))}
    </SidebarNavContainer>
  );
};

export default SidebarNav;
