import React, { FunctionComponent, PropsWithChildren } from 'react';

import styled from 'styled-components';

import { Extpipe } from '@data-catalog-app/utils/types';

import { createLink } from '@cognite/cdf-utilities';

import { getExtractionPipelineUIUrl } from '../../../utils/extpipeUtils';

const StyledLink = styled.a`
  &:hover {
    text-decoration: underline;
  }
`;

interface ExtpipeLinkProps {
  extpipe: Extpipe;
}

export const ExtpipeLink: FunctionComponent<ExtpipeLinkProps> = ({
  extpipe,
}: PropsWithChildren<ExtpipeLinkProps>) => {
  const clickLink: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.stopPropagation();
  };
  return (
    <StyledLink
      href={createLink(getExtractionPipelineUIUrl(`/extpipe/${extpipe.id}`))}
      onClick={clickLink}
    >
      {extpipe.name}
    </StyledLink>
  );
};
