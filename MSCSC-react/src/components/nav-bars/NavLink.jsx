const NavLink = (prams) => {
  const liClassName = prams.innerClass ? prams.innerClass : "nav-link";
  const innerText =
    prams.dropdown == "true" ? prams.children[0] : prams.children;
  const dropdownChildren = prams.dropdown == "true" ? prams.children[1] : "";

  return (
    <li className={liClassName}>
      <a
        href={prams.href}
        className="button-link"
        target="_blank"
        nav-link-name={prams.name}
        dropdown={prams.dropdown ?? "false"}
      >
        {innerText}
      </a>
      {dropdownChildren}
    </li>
  );
};

export default NavLink;
