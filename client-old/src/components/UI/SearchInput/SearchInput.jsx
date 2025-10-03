import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./SearchInput.css";

const SearchInput = ({ setSearch, children, ...rest }) => {
  return (
    <div className="search" {...rest}>
      <div className="search-container">
        <div className="search-icon">
          <FontAwesomeIcon icon="fa-solid fa-search" />
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
