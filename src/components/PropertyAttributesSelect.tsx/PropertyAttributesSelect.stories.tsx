import React from 'react';
import { Story } from '@storybook/react';
import { PropertyAttributesSelect } from './PropertyAttributesSelect';
import { mockComplexGraphqlModel } from '../../mocks/graphqlModels';
import { getObjectTypes } from '../../utils/graphql-utils';
import { parse } from 'graphql';

export default {
  title: 'Components/Property Attribute Select',
  component: PropertyAttributesSelect,
  decorators: [
    (storyFn: () => React.ReactNode) => (
      <div style={{ height: 500, width: '100%' }}>{storyFn()}</div>
    ),
  ],
};

const Template: Story<Parameters<typeof PropertyAttributesSelect>[0]> = (
  args
) => <PropertyAttributesSelect {...args} />;

const fieldWithId = getObjectTypes(
  parse(mockComplexGraphqlModel).definitions
)[0].fields![0];

export const IDAttribute = () => {
  return <Template field={fieldWithId} />;
};

const fieldWithSearchIndexUnique = getObjectTypes(
  parse(mockComplexGraphqlModel).definitions
)[0].fields![2];

export const EverythingElse = () => {
  return <Template field={fieldWithSearchIndexUnique} />;
};
const fieldWithNone = getObjectTypes(parse(mockComplexGraphqlModel).definitions)
  .find((el) => el.name.value === 'ParkingArea')!
  .fields!.find((el) => el.name.value === 'rentalCost')!;

export const None = () => {
  return <Template field={fieldWithNone} />;
};
