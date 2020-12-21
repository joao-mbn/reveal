import React from 'react';
import { Input } from '@cognite/cogs.js';
import { Suite } from 'store/suites/types';
import { TS_FIX_ME } from 'types/core';
import { Textarea } from 'components/modals/elements';
import ColorSelector from './ColorSelector';

interface Props {
  suite: Suite;
  setSuite: TS_FIX_ME;
}

export const SuiteForm: React.FC<Props> = ({ suite, setSuite }: Props) => {
  const handleOnChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value, name } = event.target;
    setSuite((prevState: Suite) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <Input
        autoComplete="off"
        title="Title"
        name="title"
        value={suite.title}
        variant="noBorder"
        placeholder="Name of suite"
        onChange={handleOnChange}
        fullWidth
      />
      <ColorSelector suite={suite} setSuite={setSuite} />
      <Textarea
        autoComplete="off"
        title="Description"
        name="description"
        value={suite.description}
        placeholder="Description that clearly explains the purpose of the suite"
        onChange={handleOnChange}
      />
    </>
  );
};
