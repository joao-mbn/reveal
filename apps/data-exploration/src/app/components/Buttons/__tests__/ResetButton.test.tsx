import '@testing-library/jest-dom';
import render from '../../../../testUtils/render';
import { fireEvent, screen } from '@testing-library/react';
import { ResetButton } from '../ResetButton';
import { RESET } from '../constants';

describe('ResetButton', () => {
  it('should render correctly', () => {
    render(ResetButton);

    expect(screen.getByText(RESET)).toBeInTheDocument();
  });

  it('should trigger click event', () => {
    const onClick = jest.fn();
    render(ResetButton, undefined, { onClick });

    fireEvent.click(screen.getByText(RESET));
    expect(onClick).toHaveBeenCalled();
  });
});