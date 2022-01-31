import { Field, useFormikContext } from 'formik';

import { Switch } from '@cognite/cogs.js';
import type { CalculationTemplate } from '@cognite/simconfig-api-sdk/rtk';

import { SegmentedControl } from 'components/forms/controls/SegmentedControl';
import {
  FormContainer,
  FormHeader,
  FormRow,
  FormRowStacked,
  NumberField,
  TimeSeriesField,
} from 'components/forms/elements';

import type { StepProps } from '../types';

export function DataSamplingStep({ isEditing }: StepProps) {
  const { errors, values, setFieldValue } =
    useFormikContext<CalculationTemplate>();

  return (
    <FormContainer>
      <FormHeader>Data sampling configuration</FormHeader>
      <FormRowStacked>
        <NumberField
          label={(value: number) => (value === 1 ? 'minute' : 'minutes')}
          min={15}
          name="dataSampling.validationWindow"
          step={1}
          title="Validation window"
          width={180}
        />

        <NumberField
          label={(value: number) => (value === 1 ? 'minute' : 'minutes')}
          min={0}
          name="dataSampling.samplingWindow"
          step={1}
          title="Sampling window"
          width={180}
        />

        <NumberField
          label={(value: number) => (value === 1 ? 'minute' : 'minutes')}
          min={1}
          name="dataSampling.granularity"
          step={1}
          title="Granularity"
          width={180}
        />
      </FormRowStacked>

      <FormHeader>
        Logical check
        <Field
          as={Switch}
          checked={values.logicalCheck.enabled}
          defaultChecked={false}
          name="logicalCheck.enabled"
          onChange={(value: boolean) => {
            setFieldValue('logicalCheck.enabled', value);
          }}
        />
      </FormHeader>
      {values.logicalCheck.enabled ? (
        <>
          <FormRow>
            <TimeSeriesField
              aggregateTypeField="logicalCheck.aggregateType"
              externalIdDisabled={isEditing}
              externalIdField="logicalCheck.externalId"
            />
          </FormRow>
          <FormRow>
            <div className="cogs-input-container">
              <div className="title">Check</div>
              <SegmentedControl
                currentKey={values.logicalCheck.check ?? ''}
                error={errors.logicalCheck?.check}
                fullWidth
                onButtonClicked={(value: string) => {
                  setFieldValue('logicalCheck.check', value);
                }}
              >
                <SegmentedControl.Button key="eq">=</SegmentedControl.Button>
                <SegmentedControl.Button key="ne">≠</SegmentedControl.Button>
                <SegmentedControl.Button key="gt">&gt;</SegmentedControl.Button>
                <SegmentedControl.Button key="ge">≥</SegmentedControl.Button>
                <SegmentedControl.Button key="lt">&lt;</SegmentedControl.Button>
                <SegmentedControl.Button key="le">≤</SegmentedControl.Button>
              </SegmentedControl>
            </div>

            <NumberField name="logicalCheck.value" title="Value" width={120} />
          </FormRow>
        </>
      ) : null}

      <FormHeader>
        Steady state detection
        <Field
          as={Switch}
          checked={values.steadyStateDetection.enabled}
          defaultChecked={false}
          name="steadyStateDetection.enabled"
          onChange={(value: boolean) => {
            setFieldValue('steadyStateDetection.enabled', value);
          }}
        />
      </FormHeader>
      {values.steadyStateDetection.enabled ? (
        <>
          <FormRow>
            <TimeSeriesField
              aggregateTypeField="steadyStateDetection.aggregateType"
              externalIdDisabled={isEditing}
              externalIdField="steadyStateDetection.externalId"
            />
          </FormRow>
          <FormRow>
            <NumberField
              min={0}
              name="steadyStateDetection.minSectionSize"
              title="Min. section size"
              width={120}
            />
            <NumberField
              min={0}
              name="steadyStateDetection.varThreshold"
              title="Var threshold"
              width={120}
            />
            <NumberField
              max={0}
              name="steadyStateDetection.slopeThreshold"
              title="Slope threshold"
              width={120}
            />
          </FormRow>
        </>
      ) : null}
    </FormContainer>
  );
}
