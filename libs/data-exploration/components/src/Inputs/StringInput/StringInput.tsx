import { Input } from '@cognite/cogs.js';
import { FilterLabel } from '../../Labels/FilterLabel';

export const StringInput = ({
  value,
  onChange,
  label,
  placeholder = 'Starts with...',
}: {
  label?: string;
  placeholder?: string;
  value?: string | undefined;
  onChange?: (newValue: string | undefined) => void;
}) => {
  const handleOnChange = (newValue: string | undefined) => {
    onChange?.(newValue && newValue.length > 0 ? newValue : undefined);
  };

  return (
    <>
      {label && <FilterLabel>{label}</FilterLabel>}
      <Input
        variant="noBorder"
        style={{
          width: '100%',
        }}
        value={value || ''}
        placeholder={placeholder}
        onChange={(event) => {
          handleOnChange(event.target.value);
        }}
      />
    </>
  );
};