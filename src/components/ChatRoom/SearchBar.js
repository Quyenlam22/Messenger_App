import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

function SearchBar() {
  return (
    <div className="search">
      <div className="search__container">
        <Input
          size="large"
          placeholder="Search group..."
          prefix={<SearchOutlined className="search__icon"/>}
          className="search__input"
        />
      </div>
    </div>
  );
}

export default SearchBar;