import "./SearchInput.css";

const SearchInput = ({ search, setSearch, children }) => {
  return (
    <div className="search">
      <div className="search-container">
        <div className="search-icon">
          <i className="fa-solid fa-search"></i>
        </div>
        <input
          placeholder={children}
          className="search-input"
          type="text"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default SearchInput;
