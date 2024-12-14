const ActivityNavLink = (props) => {
  const { name, onClick, children } = props;
  const capitalizeName = name.charAt(0).toUpperCase() + name.slice(1);
  return (
    <li>
      <button
        className="activities-nav-link"
        nav-type={name}
        onClick={() => {
          onClick(name);
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
