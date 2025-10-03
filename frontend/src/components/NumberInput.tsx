import React from "react";

interface NumberInputProps {
  defaultValue: string;
  label?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const NumberInput: React.FC<NumberInputProps> = ({
  defaultValue,
  label = "Duration (seconds)",
  placeholder = "e.g. 86400 for 1 day",
  disabled = false,
  onChange,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type="number"
      min={1 / 1e18}
      step={1 / 1e18}
      value={defaultValue}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border rounded-md focus:ring focus:ring-indigo-500"
      placeholder={placeholder}
      disabled={disabled}
    />
  </div>
);

export default NumberInput;
