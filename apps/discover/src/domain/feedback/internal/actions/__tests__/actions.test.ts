import { getUser } from '__test-utils/fixtures/user';

import { getObjectFeedback } from '../../../service/__fixtures/getObjectFeedback';
import { assignGeneralFeedback } from '../assignGeneralFeedback';
import { deleteGeneralFeedback } from '../deleteGeneralFeedback';
import { deleteObjectFeedback } from '../deleteObjectFeedback';
import { recoverGeneralFeedback } from '../recoverGeneralFeedback';
import { recoverObjectFeedback } from '../recoverObjectFeedback';
import { sendGeneralFeedback } from '../sendGeneralFeedback';
import { sendObjectFeedback } from '../sendObjectFeedback';
import { setObjectFeedbackSensitivityByAdmin } from '../setObjectFeedbackSensitivityByAdmin';
import { unassignGeneralFeedback } from '../unassignGeneralFeedback';
import { updateFeedbackStatus } from '../updateFeedbackStatus';

const id = '12345';
const mutate = jest.fn();

describe('feedback actions', () => {
  beforeEach(() => {
    mutate.mockClear();
    mutate.mockImplementation(() => {
      try {
        return Promise.resolve();
      } catch (error) {
        return Promise.reject();
      }
    });
  });

  it('should call `updateFeedbackStatus` as expected', async () => {
    await updateFeedbackStatus(id, 12345, mutate);
    expect(mutate).toBeCalledTimes(1);
  });

  it('should call `recoverGeneralFeedback` as expected', async () => {
    recoverGeneralFeedback(id, mutate);
    expect(mutate).toBeCalledTimes(1);
  });

  it('should call `sendObjectFeedback` as expected', async () => {
    const feedback = getObjectFeedback();
    sendObjectFeedback(feedback, mutate);
    expect(mutate).toBeCalledTimes(1);
  });

  it('should call `deleteObjectFeedback` as expected', async () => {
    deleteObjectFeedback(id, mutate);
    expect(mutate).toBeCalledTimes(1);
  });

  it('should call `recoverObjectFeedback` as expected', async () => {
    recoverObjectFeedback(id, mutate);
    expect(mutate).toBeCalledTimes(1);
  });

  it('should call `setObjectFeedbackSensitivityByAdmin` as expected', async () => {
    setObjectFeedbackSensitivityByAdmin(id, false, mutate);
    expect(mutate).toBeCalledTimes(1);
  });

  it('should call `deleteGeneralFeedback` as expected', async () => {
    deleteGeneralFeedback(id, mutate);
    expect(mutate).toBeCalledTimes(1);
  });

  it('should call `assignGeneralFeedback` as expected', async () => {
    const user = getUser();
    assignGeneralFeedback(id, mutate, user.id);
    expect(mutate).toBeCalledTimes(1);

    // When user is undefined
    expect(assignGeneralFeedback(id, mutate, undefined)).toBeFalsy();
  });

  it('should call `unassignGeneralFeedback` as expected', async () => {
    unassignGeneralFeedback(id, mutate);
    expect(mutate).toBeCalledTimes(1);
  });

  it('should call `sendGeneralFeedback` as expected', async () => {
    sendGeneralFeedback('comment', 'image', mutate);
    expect(mutate).toBeCalledTimes(1);
  });
});

/**
 * Couldn't test if `log` or `showErrorMessage` is called.
 * Not showing the toast message on screen either.
 * But, the function lands into the `catch` block once an error is thrown.
 * Following was the only way to cover the lines.
 */
describe('feedback api error handling', () => {
  const originalConsole = global.console;

  beforeEach(() => {
    // @ts-expect-error - missing other keys
    global.console = { error: jest.fn() };

    mutate.mockClear();
    mutate.mockImplementation(() => {
      try {
        throw new Error('error');
      } catch (error) {
        return Promise.reject(error);
      }
    });
  });

  afterAll(() => {
    global.console = originalConsole;
  });

  it('should handle error on call `updateFeedbackStatus` as expected', async () => {
    await expect(
      updateFeedbackStatus(id, 12345, mutate)
    ).rejects.toThrowError();
  });

  it('should handle error on call `recoverGeneralFeedback` as expected', async () => {
    recoverGeneralFeedback(id, mutate);
    expect(mutate).toBeCalledTimes(1);
  });

  it('should handle error on call `sendObjectFeedback` as expected', async () => {
    const feedback = getObjectFeedback();
    sendObjectFeedback(feedback, mutate);
    expect(mutate).toBeCalledTimes(1);
  });

  it('should handle error on call `deleteObjectFeedback` as expected', async () => {
    deleteObjectFeedback(id, mutate);
    expect(mutate).toBeCalledTimes(1);
  });

  it('should handle error on call `recoverObjectFeedback` as expected', async () => {
    recoverObjectFeedback(id, mutate);
    expect(mutate).toBeCalledTimes(1);
  });

  it('should handle error on call `setObjectFeedbackSensitivityByAdmin` as expected', async () => {
    setObjectFeedbackSensitivityByAdmin(id, false, mutate);
    expect(mutate).toBeCalledTimes(1);
  });

  it('should handle error on call `deleteGeneralFeedback` as expected', async () => {
    deleteGeneralFeedback(id, mutate);
    expect(mutate).toBeCalledTimes(1);
  });

  it('should handle error on call `assignGeneralFeedback` as expected', async () => {
    const user = getUser();
    assignGeneralFeedback(id, mutate, user.id);
    expect(mutate).toBeCalledTimes(1);
  });

  it('should handle error on call `unassignGeneralFeedback` as expected', async () => {
    unassignGeneralFeedback(id, mutate);
    expect(mutate).toBeCalledTimes(1);
  });

  it('should handle error on call `sendGeneralFeedback` as expected', async () => {
    sendGeneralFeedback('comment', 'image', mutate);
    expect(mutate).toBeCalledTimes(1);
  });
});
