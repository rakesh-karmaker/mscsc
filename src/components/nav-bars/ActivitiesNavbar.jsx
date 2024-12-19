import ActivityNavLink from "./ActivityNavLink";
const ActivitiesNavbar = ({ topic, onClick }) => {
  const title = (topic) => {
    if (topic === "Activities") return "Activities";
    return topic.charAt(0).toUpperCase() + topic.slice(1) + "s";
  };

  return (
    <>
      <div className="activities-navbar">
        <h1>
          All <span className="highlighted-text">{title(topic)}</span>
        </h1>
        <menu>
          <ActivityNavLink name="event" onClick={onClick}>
            <i className="fa-solid fa-calendar-days"></i>
          </ActivityNavLink>
          <ActivityNavLink name="workshop" onClick={onClick}>
            <i className="fa-solid fa-chalkboard-user"></i>
          </ActivityNavLink>
          <ActivityNavLink name="article" onClick={onClick}>
            <i className="fa-solid fa-newspaper"></i>
          </ActivityNavLink>
          <ActivityNavLink name="achievement" onClick={onClick}>
            <i className="fa-solid fa-trophy"></i>
          </ActivityNavLink>
        </menu>
      </div>
    </>
  );
};

export default ActivitiesNavbar;
