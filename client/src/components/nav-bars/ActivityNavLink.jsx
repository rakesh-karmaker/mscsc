const ActivityNavLink = (props) => {
  const { name, setTopic, children, active } = props;
  const capitalizeName = name.charAt(0).toUpperCase() + name.slice(1);
  return (
    <li>
      <button
        className={`activities-nav-link ${active ? "active" : ""}`}
        nav-type={name}
        onClick={() => {
          setTopic(name);
        }}
        type="button"
        aria-label={`Sort the activities by ${capitalizeName}`}
      >
        {children} <span>{capitalizeName}</span>
      </button>
    </li>
  );
};

export default ActivityNavLink;
