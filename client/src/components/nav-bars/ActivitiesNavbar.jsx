import ActivityNavLink from "@/components/nav-bars/ActivityNavLink";
const ActivitiesNavbar = ({ topic, setTopic }) => {
  const capitalizeName = topic.charAt(0).toUpperCase() + topic.slice(1) + "s";
  const icons = {
    event: "fa-calendar-days",
    workshop: "fa-chalkboard-user",
    article: "fa-newspaper",
    achievement: "fa-trophy",
  };

  return (
    <>
      <div className="activities-navbar">
        <h1>
          All{" "}
          <span className="highlighted-text">
            {topic === "" ? "Activities" : capitalizeName}
          </span>
        </h1>
        <menu>
          {Object.keys(icons).map((icon) => {
            return (
              <ActivityNavLink
                name={icon}
                setTopic={setTopic}
                key={icon}
                active={topic === icon}
              >
                <i className={`fa-solid ${icons[icon]}`}></i>
              </ActivityNavLink>
            );
          })}
        </menu>
      </div>
    </>
  );
};

export default ActivitiesNavbar;
