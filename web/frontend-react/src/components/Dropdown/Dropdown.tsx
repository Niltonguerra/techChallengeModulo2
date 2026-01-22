import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { DropdownOption } from '../../types/dropdown';

interface DropdownProps<T extends string | number> {
  label: string;
  value: T | '';
  options: DropdownOption[];
  onChange: (value: T | '') => void;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function Dropdown<T extends string | number>({
  label,
  value,
  options,
  onChange,
  disabled = false,
  fullWidth = true,
}: DropdownProps<T>) {
  const isEmpty = options.length === 0;

  const handleChange = (event: SelectChangeEvent<T>) => {
    onChange(event.target.value as T);
  };

  return (
    <FormControl
      fullWidth={fullWidth}
      disabled={disabled || isEmpty}
    >
      {/* 🔑 shrink resolve o label sobrepondo */}
      <InputLabel shrink>{label}</InputLabel>

      <Select
        value={value}
        label={label}
        onChange={handleChange}
        displayEmpty
      >
        {isEmpty ? (
          <MenuItem value="" disabled>
            <em>Nenhuma opção disponível</em>
          </MenuItem>
        ) : (
          options.map(option => (
            <MenuItem
              key={String(option.value)}
              value={option.value}
            >
              {option.label}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
}
