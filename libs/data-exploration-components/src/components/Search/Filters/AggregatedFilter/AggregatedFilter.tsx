import React from 'react';
import { Body } from '@cognite/cogs.js';
import { Select } from '@data-exploration-components/components';

export const AggregatedFilter = <T,>({
  items,
  value,
  setValue,
  title,
  aggregator,
}: {
  items: T[];
  aggregator: string;
  value: string | undefined;
  title: string;
  setValue: (newValue: string | undefined) => void;
}) => {
  const setSource = (newValue: string | undefined) => {
    const newSource = newValue && newValue.length > 0 ? newValue : undefined;
    setValue(newSource);
  };

  const sources: Set<string | number> = new Set();
  items.forEach((el) => {
    if (aggregator in el) {
      sources.add((el as any)[aggregator] as string | number);
    }
  });

  return (
    <>
      <Body
        level={4}
        style={{ marginBottom: 5, marginTop: 10 }}
        className="title"
      >
        {title}
      </Body>
      <Select
        creatable
        className="aggregated-filter-select"
        value={value ? { value, label: value } : undefined}
        onChange={(item) => {
          if (item) {
            const tmpValue = (item as { value: string }).value;
            setSource(tmpValue);
          } else {
            setSource(undefined);
          }
        }}
        options={[...sources].map((el) => ({
          value: el,
          label: String(el),
        }))}
      />
    </>
  );
};
