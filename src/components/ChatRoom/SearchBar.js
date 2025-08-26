import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";

function SearchBar({ onSearch }) {
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  useEffect(() => {
    if(debouncedValue !== "") {
      onSearch?.(debouncedValue);
    }
    else {
      onSearch?.("");
    }
  }, [debouncedValue, onSearch]);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div className="search">
      <div className="search__container">
        <Input
          size="large"
          placeholder="Search group..."
          prefix={<SearchOutlined className="search__icon" />}
          className="search__input"
          value={value}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

export default SearchBar;