import { fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryCache } from 'react-query';
import { sdkv3 } from '@cognite/cdf-sdk-singleton';
import { getMockResponse } from '../../../utils/mockResponse';
import { render } from '../../../utils/test';
import {
  CDF_ENV_GREENFIELD,
  ORIGIN_DEV,
  PROJECT_ITERA_INT_GREEN,
  renderQueryCacheIntegration,
} from '../../../utils/test/render';
import MainDetails from './MainDetails';

describe('<MainDetails/>', () => {
  let queryCache: QueryCache;
  beforeEach(() => {
    queryCache = new QueryCache();
  });

  test('Two edits at the same time', async () => {
    const integration = getMockResponse()[0];
    sdkv3.post.mockResolvedValue({ data: { items: [integration] } });
    const wrapper = renderQueryCacheIntegration(
      queryCache,
      PROJECT_ITERA_INT_GREEN,
      CDF_ENV_GREENFIELD,
      ORIGIN_DEV,
      integration
    );
    render(<MainDetails />, { wrapper });

    const editBtns = screen.getAllByText('Edit');
    expect(editBtns.length).toEqual(2); // name, description
    // click first edit btn
    const firstEditBtn = editBtns[0];
    fireEvent.click(firstEditBtn);
    const nameInput = screen.getByDisplayValue(integration.name); // assuming name is editable
    expect(nameInput).toBeInTheDocument();

    // click second edit btn - assumes there are two
    const secondEditBtn = editBtns[1];
    fireEvent.click(secondEditBtn);
    const inputDescription = screen.getByDisplayValue(integration.description); // assuming description is editable
    expect(inputDescription).toBeInTheDocument();

    const newValueDescription = 'This is a new description';
    fireEvent.change(inputDescription, {
      target: { value: newValueDescription },
    });
    fireEvent.blur(inputDescription);
    const warningDescription = screen.getByTestId(
      `warning-icon-description` // depends on mapIntegration
    );
    expect(warningDescription).toBeInTheDocument();

    // change value in input
    const newValueName = 'New integration name something unique';
    fireEvent.change(nameInput, { target: { value: newValueName } });
    fireEvent.blur(nameInput);
    const newValueInput = screen.getByDisplayValue(newValueName);
    expect(newValueInput).toBeInTheDocument();
    const warning = screen.getByTestId(`warning-icon-name`);
    expect(warning).toBeInTheDocument();

    // should be two inputs open.
    const saveBtns = screen.getAllByText('Save');
    expect(saveBtns.length).toEqual(2);

    // click save. new value saved. just display value
    fireEvent.click(saveBtns[0]);
    await waitFor(() => {
      const newValueForRow = screen.getByText(newValueName);
      expect(newValueForRow).toBeInTheDocument();
    });
  });
});
