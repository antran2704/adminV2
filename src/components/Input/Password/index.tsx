import { Input, Space, Flex } from "antd";
import { ChangeEvent } from "react";
import { IInputPasswordField } from "~/interface";

type Props = IInputPasswordField;

const InputPassword = (props: Props) => {
  const {
    title,
    name,
    value,
    isError = false,
    message,
    important = false,
    placeholder,
    maxLength,
    onChange,
    onPressEnter,
  } = props;

  const onChangeValue = (e: ChangeEvent<HTMLInputElement>): void => {
    const value: string = e.target.value.trim();

    if (!onChange) return;
    onChange(value, name);
  };

  return (
    <Space direction="vertical" className="w-full">
      <Flex vertical gap={0}>
        {title && (
          <p className="mb-2">
            {title}
            {important && <strong className="text-red-500 pl-1">*</strong>}
          </p>
        )}
        <Input.Password
          className="inp__custome"
          name={name}
          value={value}
          status={isError ? "error" : ""}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={onChangeValue}
          onPressEnter={onPressEnter}
        />
        {message && <p className="text-xs text-red-200 py-1">{message}</p>}
      </Flex>
    </Space>
  );
};

export default InputPassword;
