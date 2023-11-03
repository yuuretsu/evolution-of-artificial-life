import styled from 'styled-components';

export const SafeAreaBottomWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: env(safe-area-inset-bottom);
  background-color: rgba(20, 20, 20, 0.8);
  backdrop-filter: blur(20px);
  z-index: 9999;
`;

export const SafeAreaBottom = () => <SafeAreaBottomWrapper onClick={e => e.stopPropagation()} />;
