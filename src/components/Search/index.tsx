import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { SearchProps } from "antd/es/input";

interface Props extends SearchProps {}

const Search = (props: Props) => {
  return (
    <Input
      addonBefore={
        <div className="flex items-center justify-center h-full px-3 cursor-pointer border-r">
          <SearchOutlined />
        </div>
      }
      {...props}
    />
  );
};

export default Search;
