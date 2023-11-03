import { FlexRow } from 'ui';
import { IconContext } from 'react-icons';
import { AiFillGithub } from 'react-icons/ai';
import styled from 'styled-components';

const COLOR = 'rgb(80, 80, 80)';

export const Links = () => {
  return (
    <IconContext.Provider value={{ color: COLOR, size: '24' }}>
      <A href="https://github.com/yuuretsu/evolution-of-artificial-life" target='_blank' rel='noopener noreferrer'>
        <FlexRow gap={10} alignItems='center'>
          <AiFillGithub />
          github
        </FlexRow>
      </A>
    </IconContext.Provider>
  );
};

const A = styled.a`
  color: ${COLOR};
  text-decoration: none;
`;
