import styled from 'styled-components';

const Wrapper = styled.div`
  position: fixed;
  display: flex;
  background-color: #282828;
  padding: 10px;
  border-radius: 100px;
  box-shadow: 0 0 10px 0 black;
  top: 20px;
  left: 20px;
  & > *:not(:last-child) {
    margin-right: 10px;
  }
  transition-duration: 0.2s;
`;

export default Wrapper;