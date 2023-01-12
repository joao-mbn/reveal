import '@testing-library/jest-dom/extend-expect';

import { screen } from '@testing-library/react';

import { renderComponent } from '../../../__test-utils/renderer';

import { AppliedFiltersTags, Props } from '../AppliedFiltersTags';

describe('AppliedFiltersTags', () => {
  const testInit = (props: Props) => {
    return renderComponent(AppliedFiltersTags, props);
  };

  it('should show correct number of filter chips', () => {
    testInit({
      filter: {
        labels: [
          { label: 'label1', value: 'value1' },
          { label: 'label2', value: 'value2' },
        ],
      },
    });
    expect(screen.getAllByTestId('filter-chip')).toHaveLength(2);
  });

  it('should show only one filter chip', () => {
    testInit({
      filter: {
        type: 'test-type',
      },
    });
    expect(screen.getAllByTestId('filter-chip')).toHaveLength(1);
  });

  it('should not show any filter chip', () => {
    testInit({
      filter: {
        type: undefined,
      },
    });
    expect(screen.queryAllByTestId('filter-chip')).toHaveLength(0);
  });
});
