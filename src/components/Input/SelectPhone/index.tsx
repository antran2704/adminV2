"use client";

import { Input, Select, Space, Typography, Flex } from "antd";
import { ChangeEvent } from "react";
import { checkValidNumber } from "~/helper/format";
import { IInputSelectPhoneField } from "~/interface";
const { Option } = Select;

type Props = IInputSelectPhoneField;

const InputSelectPhone = (props: Props) => {
  const {
    title,
    name,
    maxLength,
    value,
    important = false,
    placeholder,
    onChange,
    onChangeCodeArea,
  } = props;

  const onChangeValue = (e: ChangeEvent<HTMLInputElement>): void => {
    const value: string = e.target.value.replaceAll(" ", "");
    const isValidNumber = checkValidNumber(Number(value));

    if (!isValidNumber) return;
    if (!onChange) return;

    onChange(value, name);
  };

  return (
    <Space direction="vertical" className="w-full">
      <Flex vertical gap={0}>
        {title && (
          <Typography.Title level={5} className="mb-2">
            {title}
            {important && <strong className="text-red-500 pl-1">*</strong>}
          </Typography.Title>
        )}
        <Input
          className="inp__select w-full "
          placeholder={placeholder}
          maxLength={maxLength}
          addonBefore={
            <Select
              onChange={onChangeCodeArea}
              defaultValue="+84"
              className="flex items-center bg-white"
            >
              <Option value="+84">+84</Option>
              <Option value="+85">+85</Option>
            </Select>
          }
          value={value}
          onChange={onChangeValue}
        />
      </Flex>
    </Space>
  );
};

export default InputSelectPhone;
