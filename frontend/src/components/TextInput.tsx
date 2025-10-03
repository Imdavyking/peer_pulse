import React from "react";

interface TextInputProps {
  defaultValue: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({
  defaultValue,
  label = "Text",
  placeholder = "placeholder",
  disabled = false,
  onChange,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type="text"
      value={defaultValue}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border rounded-md focus:ring focus:ring-indigo-500"
      placeholder={placeholder}
      disabled={disabled}
    />
  </div>
);

export default TextInput;
