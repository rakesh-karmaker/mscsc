import "@/components/UI/InputText/InputText.css";
import "./SearchInput.css";
import { useState } from "react";

const SearchInput = ({ search, setSearch }) => {
  const [top, setTop] = useState(search ? "-25px" : "0");
  return (
    <div className="search">
      <div className="input-text">
        <div className="input-container">
          <label htmlFor="search" style={{ top: top }}>
            Search by name
          </label>
          <input
            type="text"
            id="search"
            onChange={(e) => {
              setTop(e.target.value ? "-25px" : "0");
              setSearch(e.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
