const ActivityNavLink = (props) => {
  const { name, setTag, children, active } = props;
  const capitalizeName = name.charAt(0).toUpperCase() + name.slice(1);
  return (
    <li>
      <button
        className={`activities-nav-link ${active ? "active" : ""}`}
        nav-type={name}
        onClick={() => {
          setTag(name);
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
