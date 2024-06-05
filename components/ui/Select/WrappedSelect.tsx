import React from "react";
import { Select } from "antd";

interface WrappedSelectProps {
  name: string;
  value: string | undefined;
  options: { label: string; value: string }[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const WrappedSelect: React.FC<WrappedSelectProps> = ({
  name,
  value,
  options,
  onChange,
  className,
}) => {
  const handleChange = (selectedValue: string) => {
    const event = {
      target: {
        name,
        value: selectedValue,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
  };

  return (
    <Select
      className={className}
      value={value}
      onChange={handleChange}
      options={options}
    />
  );
};

export default WrappedSelect;
