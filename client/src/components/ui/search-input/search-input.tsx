import type { CSSProperties, Dispatch, ReactNode, SetStateAction } from "react";
import { FaSearch } from "react-icons/fa";

import "./search-input.css";

export default function SearchInput({
  search,
  setSearch,
  children,
  ...rest
}: {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  children: string;
  style?: CSSProperties;
}): ReactNode {
  return (
    <div className="search" {...rest}>
      <div className="search-container">
        <div className="search-icon">
          <FaSearch />
        </div>
        <input
          placeholder={children}
          className="search-input"
          type="text"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          value={search}
        />
      </div>
    </div>
  );
}
