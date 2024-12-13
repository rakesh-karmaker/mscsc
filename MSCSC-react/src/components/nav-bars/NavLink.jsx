const NavLink = (prams) => {
  const liClassName = prams.innerClass ? prams.innerClass : "nav-link";
  const innerText =
    prams.dropdown == "true" ? prams.children[0] : prams.children;
  const dropdownChildren = prams.dropdown == "true" ? prams.children[1] : "";

  const getLinkName = (innerText) => {
    if (innerText.includes(" ")) {
      return innerText.split(" ")[0].toLowerCase();
    }
    return innerText.toLowerCase();
  };

  return (
    <li className={liClassName}>
      <a
        href={prams.href}
        className="button-link"
        target="_blank"
        nav-link-name={getLinkName(innerText)}
        dropdown={prams.dropdown ?? "false"}
      >
        {innerText}
      </a>
      {dropdownChildren}
    </li>
  );
};

export default NavLink;
