import React from 'react';
import styled from 'styled-components';
import { useCurrentModule, useStoreActions, useStore } from '../../store';
import { ModuleType } from '../../types/state';

// Detect if running in Electron and platform
const isElectron = window.electronAPI !== undefined;
const isMacOS = navigator.platform.toLowerCase().includes('mac');
const isElectronMacOS = isElectron && isMacOS;

const TopBarContainer = styled.header<{ $isElectronMacOS: boolean }>`
  background: ${props => props.theme.colors.background.secondary};
  border-bottom: 1px solid ${props => props.theme.colors.border.default};
  padding: 0 ${props => props.theme.spacing.sm};
  padding-top: ${props => props.$isElectronMacOS ? '28px' : '0'};
  height: ${props => props.$isElectronMacOS ? '80px' : '56px'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  backdrop-filter: blur(24px);
  flex-shrink: 0;
  position: relative;
  z-index: 100;
  gap: ${props => props.theme.spacing.sm};

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    padding: 0 ${props => props.theme.spacing.lg};
    height: ${props => props.$isElectronMacOS ? '92px' : '64px'};
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const HamburgerButton = styled.button`
  background: transparent;
  border: 1px solid ${props => props.theme.colors.border.default};
  color: ${props => props.theme.colors.text.secondary};
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: ${props => props.theme.colors.border.hover};
    color: ${props => props.theme.colors.text.primary};
  }

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    display: none;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-size: ${props => props.theme.typography.fontSize.base};
  letter-spacing: -0.02em;

  i {
    color: ${props => props.theme.colors.primary[500]};
    font-size: 20px;
    filter: drop-shadow(0 0 8px ${props => props.theme.colors.primary[500]}40);
  }

  span {
    display: none;
  }

  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    gap: ${props => props.theme.spacing.sm};
    font-size: ${props => props.theme.typography.fontSize.lg};
    
    i {
      font-size: 24px;
    }

    span {
      display: inline;
    }
  }
`;

const MainNav = styled.nav`
  display: none;
  gap: 2px;
  background: ${props => props.theme.colors.background.tertiary};
  padding: 4px;
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border.default};

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    display: flex;
  }
`;

const NavItem = styled.button<{ $active: boolean }>`
  background: ${props => props.$active 
    ? `linear-gradient(135deg, ${props.theme.colors.primary[600]} 0%, ${props.theme.colors.primary[500]} 100%)`
    : 'transparent'
  };
  border: none;
  color: ${props => props.$active 
    ? 'white' 
    : props.theme.colors.text.secondary
  };
  padding: 8px 16px;
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  position: relative;
  white-space: nowrap;
  letter-spacing: -0.01em;

  &:hover {
    background: ${props => props.$active 
      ? `linear-gradient(135deg, ${props.theme.colors.primary[600]} 0%, ${props.theme.colors.primary[500]} 100%)`
      : 'rgba(255, 255, 255, 0.06)'
    };
    color: ${props => props.$active 
      ? 'white' 
      : props.theme.colors.text.primary
    };
  }

  ${props => props.$active && `
    box-shadow: ${props.theme.shadows.md};
  `}
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
  align-items: center;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    gap: ${props => props.theme.spacing.sm};
  }
`;

const UserInfo = styled.div`
  display: none;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: 6px 12px;
  background: ${props => props.theme.colors.background.tertiary};
  border: 1px solid ${props => props.theme.colors.border.default};
  border-radius: ${props => props.theme.borderRadius.md};

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    display: flex;
  }
`;

const UserName = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.primary};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const UserBadge = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${props => props.theme.colors.success};
`;

const ActionButton = styled.button`
  background: transparent;
  border: 1px solid ${props => props.theme.colors.border.default};
  color: ${props => props.theme.colors.text.secondary};
  width: 36px;
  height: 36px;
  border-radius: ${props => props.theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: ${props => props.theme.colors.border.hover};
    color: ${props => props.theme.colors.text.primary};
  }
`;

const DesktopOnlyButton = styled(ActionButton)`
  display: none;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    display: flex;
  }
`;

interface TopBarProps {
  onSettingsClick?: () => void;
}

const modules: { id: ModuleType; name: string; icon: string }[] = [
  { id: 'game-studio', name: 'Game Studio', icon: 'fas fa-gamepad' },
];

const TopBar: React.FC<TopBarProps> = ({ onSettingsClick }) => {
  const currentModule = useCurrentModule();
  const { auth, ui } = useStore();
  const { setCurrentModule, openModal, logout, toggleMobileMenu } = useStoreActions();

  const handleModuleChange = (moduleId: ModuleType) => {
    setCurrentModule(moduleId);
  };

  const handleSettingsClick = () => {
    if (onSettingsClick) {
      onSettingsClick();
    } else {
      openModal('settings');
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <TopBarContainer $isElectronMacOS={isElectronMacOS}>
      <LeftSection>
        <HamburgerButton 
          onClick={toggleMobileMenu}
          title={ui.sidebar.mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <i className={ui.sidebar.mobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </HamburgerButton>
        
        <Logo>
          <i className="fas fa-cube"></i>
          <span>Open3DStudio</span>
        </Logo>
      </LeftSection>
      
      <MainNav>
        {modules.map(module => (
          <NavItem
            key={module.id}
            $active={currentModule === module.id}
            onClick={() => handleModuleChange(module.id)}
          >
            <i className={module.icon}></i>
            <span>{module.name}</span>
          </NavItem>
        ))}
      </MainNav>

      <HeaderActions>
        {auth.authStatus?.user_auth_enabled && auth.isAuthenticated && auth.user && (
          <UserInfo>
            <UserBadge />
            <UserName>{auth.user.username}</UserName>
          </UserInfo>
        )}
        
        <DesktopOnlyButton 
          title="View on GitHub" 
          onClick={() => window.open('https://github.com/FishWoWater/Open3DStudio', '_blank')}
        >
          <i className="fab fa-github"></i>
        </DesktopOnlyButton>
        
        {auth.authStatus?.user_auth_enabled && auth.isAuthenticated && (
          <ActionButton title="Logout" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
          </ActionButton>
        )}
        
        <ActionButton title="Settings" onClick={handleSettingsClick}>
          <i className="fas fa-cog"></i>
        </ActionButton>
      </HeaderActions>
    </TopBarContainer>
  );
};

export default TopBar; 