import { DoglegSeverityInternal } from 'domain/wells/trajectory/internal/types';

import { Distance } from 'convert-units';

import { Datum, Wellbore } from '@cognite/sdk-wells';

export interface WellboreInternal extends Omit<Wellbore, 'datum'> {
  id: string;
  wellMatchingId: string;
  wellId: string;
  wellName: string;
  title: string;
  datum?: DatumInternal;
  maxMeasuredDepth?: number;
  maxTrueVerticalDepth?: number;
  maxDoglegSeverity?: DoglegSeverityInternal;
  color: string;
}

export interface DatumInternal extends Omit<Datum, 'unit'> {
  unit: Distance;
}
