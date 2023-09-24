import styled from 'styled-components';

export const SafeAreaBottomWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
  z-index: 9999;
`;

export const SafeAreaBottom = () => <SafeAreaBottomWrapper onClick={e => e.stopPropagation()} />;
