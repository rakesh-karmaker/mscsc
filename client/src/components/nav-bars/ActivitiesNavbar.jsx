import SearchInput from "@/admin/components/SearchInput/SearchInput";
import ActivityNavLink from "@/components/nav-bars/ActivityNavLink";
const ActivitiesNavbar = ({ tag, setTag, search, setSearch }) => {
  const capitalizeName = tag.charAt(0).toUpperCase() + tag.slice(1) + "s";
  const icons = {
    Event: "fa-calendar-days",
    Workshop: "fa-chalkboard-user",
    Article: "fa-newspaper",
    Achievement: "fa-trophy",
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
                setTag={setTag}
                key={icon}
                active={tag === icon}
              >
                <i className={`fa-solid ${icons[icon]}`}></i>
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
