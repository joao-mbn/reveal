import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components/macro';

import { Menu as CogsMenu } from '@cognite/cogs.js';

import { Suggestion } from '../../types';

export interface SuggestionsMenuProps {
  suggestions?: Suggestion[];
  onSelectSuggestion?: (suggestion: string) => void;
}

export const SuggestionsMenu: React.FC<SuggestionsMenuProps> = ({
  suggestions,
  onSelectSuggestion,
}) => {
  if (!suggestions || isEmpty(suggestions)) {
    return null;
  }

  return (
    <Menu>
      {suggestions.map((suggestion) => {
        return (
          <Menu.Item
            key={suggestion}
            onClick={() => onSelectSuggestion?.(String(suggestion))}
          >
            {suggestion}
          </Menu.Item>
        );
      })}
    </Menu>
  );
};

const Menu = styled(CogsMenu)`
  width: 240px;
  max-height: 160px;
  margin-top: -4px;
  overflow-y: auto;
`;