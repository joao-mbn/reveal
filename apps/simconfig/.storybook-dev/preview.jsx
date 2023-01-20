import { BrowserRouter } from 'react-router-dom-v5';

import { configureI18n, I18nContainer } from '@cognite/react-i18n';

import '@cognite/cogs.js/dist/cogs.css';

configureI18n();

export const decorators = [
  (Story) => (
    <I18nContainer>
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    </I18nContainer>
  ),
];

// https://storybook.js.org/docs/react/writing-stories/parameters#global-parameters
export const parameters = {
  // https://storybook.js.org/docs/react/essentials/actions#automatically-matching-args
  actions: { argTypesRegex: '^on.*' },
  controls: { expanded: true },
  layout: 'centered',
};
