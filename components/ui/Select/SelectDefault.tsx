import React from 'react';
import { Select, SelectProps } from 'antd';
import classes from './Select.module.css';

interface SelectDefaultProps extends SelectProps<any> {
  options: Array<{ value: string; label: string }>;
  className?: string;
  defaultValue?: { value: string; label: string };
  placeholder?: string;
}

const SelectDefault: React.FC<SelectDefaultProps> = ({
  options,
  className = '',
  defaultValue,
  placeholder = 'Select one...',
  ...props
}) => {
  return (
    <Select
      placeholder={placeholder}
      className={`${classes.selectDefault} ${className}`}
      options={options}
      defaultValue={defaultValue}
      {...props}
    />
  );
};

export default SelectDefault;
