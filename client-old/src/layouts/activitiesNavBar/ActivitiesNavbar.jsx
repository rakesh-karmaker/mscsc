import SearchInput from "@/components/UI/SearchInput/SearchInput";
import ActivityNavLink from "@/layouts/activitiesNavBar/ActivityNavLink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ActivitiesNavBar.css";

const ActivitiesNavbar = ({ tag, setTag, search, setSearch, ...rest }) => {
  const capitalizeName = tag.charAt(0).toUpperCase() + tag.slice(1) + "s";
  const icons = {
    Event: "fa-regular fa-calendar-days",
    Workshop: "fa-solid fa-chalkboard-user",
    Article: "fa-solid fa-newspaper",
    Achievement: "fa-solid fa-trophy",
  };

  return (
    <>
      <div className="activities-navbar">
        <h1>
          All{" "}
          <span className="highlighted-text">
            {tag === "" ? "Activities" : capitalizeName}
          </span>
        </h1>
        <menu>
          {Object.keys(icons).map((icon) => {
            return (
              <ActivityNavLink
                name={icon}
                key={icon}
                active={tag === icon}
                setTag={setTag}
                search={search}
                {...rest}
              >
                <FontAwesomeIcon icon={icons[icon]} />
              </ActivityNavLink>
            );
          })}
        </menu>
        <SearchInput search={search} setSearch={setSearch}>
          Search Activity
        </SearchInput>
      </div>
    </>
  );
};

export default ActivitiesNavbar;
