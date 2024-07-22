import { memo, useEffect, useRef, useState } from "react";
import type { InputRef } from "antd";
import { Input, Tag } from "antd";

interface Props {
  data: string[];
  onChange?: (tags: string[]) => void;
}

const ListTag = (props: Props) => {
  const { data, onChange } = props;

  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const inputRef = useRef<InputRef>(null);

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);

    if (onChange) {
      onChange(newTags);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);

      if (onChange) {
        onChange([...tags, inputValue]);
      }
    }

    setInputValue("");
  };

  useEffect(() => {
    if (!tags.length) {
      setTags(data);
    }
  }, [data]);

  return (
    <div className="w-full flex items-center flex-wrap gap-2">
      {tags.map((tag: string) => (
        <span key={tag} style={{ display: "inline-block" }}>
          <Tag
            closable
            onClose={(e) => {
              e.preventDefault();
              handleClose(tag);
            }}
            className="!flex items-center !px-5 !py-1 gap-2"
          >
            {tag}
          </Tag>
        </span>
      ))}

      <Input
        ref={inputRef}
        type="text"
        size="middle"
        value={inputValue}
        placeholder="Please enter tag..."
        onChange={handleInputChange}
        onBlur={handleInputConfirm}
        onPressEnter={handleInputConfirm}
        className="!flex-1"
      />
    </div>
  );
};

export default memo(ListTag);
