import { FlexColumn, FlexRow } from 'shared/ui';
import styled from 'styled-components';

import { Links } from './Links';

export const Footer = () => {
  return (
    <FlexColumn gap={20}>
      <FlexRow justifyContent='space-between' alignItems='center'>
        <Links />
        <AppVersionWrapper>
          app version: {import.meta.env.PACKAGE_VERSION}
        </AppVersionWrapper>
      </FlexRow>
    </FlexColumn>
  );
};

const AppVersionWrapper = styled.span`
  color: rgb(80, 80, 80);
`;
