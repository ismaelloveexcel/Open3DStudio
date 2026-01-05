import React, { useEffect, useCallback } from 'react';
import styled, { useTheme } from 'styled-components';
import { useCurrentModule, useStoreActions, useUI } from '../../store';
import { ModuleType } from '../../types/state';

const MobileOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 200;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    display: none;
  }
`;

const SidebarNavContainer = styled.nav<{ $mobileOpen: boolean }>`
  /* Mobile: slide-out drawer */
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  max-width: 85vw;
  background: ${props => props.theme.colors.background.secondary};
  border-right: 1px solid ${props => props.theme.colors.border.default};
  display: flex;
  flex-direction: column;
  padding: ${props => props.theme.spacing.md} 0;
  gap: ${props => props.theme.spacing.xs};
  z-index: 201;
  overflow-y: auto;
  overflow-x: hidden;
  transform: translateX(${props => props.$mobileOpen ? '0' : '-100%'});
  transition: transform 0.3s ease;

  /* Desktop: static sidebar */
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    position: relative;
    width: 72px;
    min-width: 72px;
    max-width: none;
    transform: none;
    padding: ${props => props.theme.spacing.sm} 0;
    z-index: 101;
  }
`;

const MobileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.sm};
  border-bottom: 1px solid ${props => props.theme.colors.border.default};

  h3 {
    font-size: ${props => props.theme.typography.fontSize.lg};
    font-weight: ${props => props.theme.typography.fontWeight.semibold};
    color: ${props => props.theme.colors.text.primary};
    margin: 0;
  }

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    display: none;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.text.secondary};
  font-size: 20px;
  cursor: pointer;
  padding: ${props => props.theme.spacing.xs};
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${props => props.theme.colors.text.primary};
  }
`;

const NavButton = styled.button<{ $active: boolean }>`
  /* Mobile: full-width horizontal layout */
  width: calc(100% - ${props => props.theme.spacing.md} * 2);
  margin: 0 ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.$active ? props.theme.colors.primary[100] : 'transparent'};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: ${props => props.theme.spacing.md};
  color: ${props => props.$active ? props.theme.colors.primary[700] : props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s, color 0.2s;

  i {
    font-size: 18px;
    width: 24px;
    text-align: center;
  }

  span {
    display: block;
    text-align: left;
  }

  &:hover {
    background: ${props => props.theme.colors.primary[50]};
    color: ${props => props.theme.colors.primary[700]};
  }

  /* Desktop: square icon buttons */
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    width: 56px;
    height: 56px;
    margin: 0 auto;
    padding: ${props => props.theme.spacing.xs};
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    border-radius: 10px;

    i {
      font-size: 16px;
    }

    span {
      font-size: 9px;
      text-align: center;
      line-height: 1.1;
      max-width: 48px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;

const NavDivider = styled.div`
  height: 1px;
  background: ${props => props.theme.colors.border.default};
  margin: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    margin: ${props => props.theme.spacing.sm} 8px;
  }
`;

const navItems = [
  { id: 'game-studio', icon: 'fas fa-gamepad', label: 'Game Studio' },
  { id: 'game-concept', icon: 'fas fa-lightbulb', label: 'Game Concept' },
  { id: 'playable-generator', icon: 'fas fa-play-circle', label: 'Playable Generator' },
  { id: 'divider-1', isDivider: true },
  { id: 'image-generator', icon: 'fas fa-image', label: 'Image Generator' },
  { id: '3d-asset-generator', icon: 'fas fa-cube', label: '3D Asset Generator' },
  { id: 'video-generator', icon: 'fas fa-video', label: 'Video Generator' },
  { id: 'sprite-generator', icon: 'fas fa-th', label: 'Sprite Generator' },
  { id: 'audio-generator', icon: 'fas fa-music', label: 'Audio Generator' },
  { id: 'divider-2', isDivider: true },
  { id: 'idea-pathfinder', icon: 'fas fa-route', label: 'Idea Pathfinder' },
  { id: 'game-ideator', icon: 'fas fa-brain', label: 'Game Ideator' },
  { id: 'ask-ludo', icon: 'fas fa-question-circle', label: 'Ask Ludo' },
  { id: 'divider-3', isDivider: true },
  { id: 'market-trends', icon: 'fas fa-chart-line', label: 'Market Trends' },
  { id: 'search', icon: 'fas fa-search', label: 'Search' },
  { id: 'top-charts', icon: 'fas fa-trophy', label: 'Top Charts' },
  { id: 'favorites', icon: 'fas fa-heart', label: 'Favorites' },
  { id: 'divider-4', isDivider: true },
  { id: 'settings', icon: 'fas fa-cog', label: 'Settings' },
];

const SidebarNav: React.FC = () => {
  const currentModule = useCurrentModule();
  const ui = useUI();
  const { setCurrentModule, setMobileMenuOpen } = useStoreActions();
  const mobileMenuOpen = ui.sidebar.mobileMenuOpen;

  // Close mobile menu when clicking outside or pressing escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen, setMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const theme = useTheme();
  
  // Parse the breakpoint value (e.g., "1024px" -> 1024)
  const lgBreakpoint = parseInt(theme.breakpoints.lg, 10);

  const handleNavClick = useCallback((itemId: string) => {
    // Only set module if it's a valid ModuleType
    const validModules: ModuleType[] = [
      'game-studio', 'playable-generator', 'mesh-generation', 
      'mesh-painting', 'mesh-segmentation', 'part-completion',
      'auto-rigging', 'mesh-retopology', 'mesh-uv-unwrapping'
    ];
    
    if (validModules.includes(itemId as ModuleType)) {
      setCurrentModule(itemId as ModuleType);
    }
    
    // Close mobile menu after selection on mobile/tablet
    if (window.innerWidth < lgBreakpoint) {
      setMobileMenuOpen(false);
    }
  }, [setCurrentModule, setMobileMenuOpen, lgBreakpoint]);

  return (
    <>
      <MobileOverlay $isOpen={mobileMenuOpen} onClick={() => setMobileMenuOpen(false)} />
      <SidebarNavContainer $mobileOpen={mobileMenuOpen}>
        <MobileHeader>
          <h3>Menu</h3>
          <CloseButton onClick={() => setMobileMenuOpen(false)}>
            <i className="fas fa-times"></i>
          </CloseButton>
        </MobileHeader>
        
        {navItems.map(item => {
          if (item.isDivider) {
            return <NavDivider key={item.id} />;
          }
          return (
            <NavButton
              key={item.id}
              $active={currentModule === item.id}
              title={item.label}
              onClick={() => handleNavClick(item.id)}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </NavButton>
          );
        })}
      </SidebarNavContainer>
    </>
  );
};

export default SidebarNav;
