import { Input, Space } from "antd";
import { ChangeEvent } from "react";
import { IInputSearchField } from "~/interface";
import { useDebouncedCallback } from "use-debounce";

type Props = IInputSearchField;

const InputSearch = (props: Props) => {
  const { value, name, placeholder, onChange, onSearch } = props;
  const debounceSearch = useDebouncedCallback((value: string, name: string) => {
    if (onChange) {
      onChange(value, name);
    }
  }, 500);

  const onChangeValue = (e: ChangeEvent<HTMLInputElement>): void => {
    const valueInp: string = e.target.value;

    debounceSearch(valueInp, name);
  };

  const onEnter = (text: string): void => {
    if (onSearch) {
      onSearch(text, name);
    }
  };

  return (
    <Space direction="vertical" className="w-full">
      <Input.Search
        name={name}
        value={value}
        placeholder={placeholder}
        className="inp__search w-full"
        onChange={onChangeValue}
        onSearch={onEnter}
      />
    </Space>
  );
};

export default InputSearch;
