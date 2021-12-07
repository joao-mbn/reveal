import { fetchVersions, fetchSolution } from './actions';
/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SolutionSchema, Solution } from '@platypus/platypus-core';
import { ActionStatus } from '@platypus-app/types';

const solutionStateSlice = createSlice({
  name: 'solution',
  initialState: {
    solution: undefined as Solution | undefined,
    solutionStatus: ActionStatus.IDLE,
    solutionError: '',
    selectedSchema: undefined as SolutionSchema | undefined,
    schemas: [] as SolutionSchema[],
    schemasStatus: ActionStatus.IDLE,
    schemasError: '',
  },
  reducers: {
    selectVersion: (state, action: PayloadAction<{ version: string }>) => {
      if (state.schemas.length) {
        state.selectedSchema = Object.assign(
          state.selectedSchema,
          state.schemas.find(
            (schema) => schema.version === action.payload.version
          )
        );
      }
    },
  },
  extraReducers: (builder) => {
    // Fetching solution
    builder.addCase(fetchSolution.pending, (state) => {
      state.solutionStatus = ActionStatus.PROCESSING;
    });
    builder.addCase(fetchSolution.fulfilled, (state, action) => {
      state.solutionStatus = ActionStatus.SUCCESS;
      state.solution = action.payload;
    });
    builder.addCase(fetchSolution.rejected, (state, action) => {
      state.solutionStatus = ActionStatus.FAIL;
      state.solutionError = action.error.message as string;
    });

    // Fetching versions
    builder.addCase(fetchVersions.pending, (state) => {
      state.schemasStatus = ActionStatus.PROCESSING;
    });
    builder.addCase(fetchVersions.fulfilled, (state, action) => {
      state.schemasStatus = ActionStatus.SUCCESS;
      state.schemas = action.payload;
      state.selectedSchema = action.payload.length
        ? action.payload[0]
        : undefined;
    });
    builder.addCase(fetchVersions.rejected, (state, action) => {
      state.schemasStatus = ActionStatus.FAIL;
      state.schemasError = action.error.message as string;
    });
  },
});

export type SolutionState = ReturnType<typeof solutionStateSlice.reducer>;
export const { actions } = solutionStateSlice;
export default solutionStateSlice;
