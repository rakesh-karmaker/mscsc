import SearchInput from "@/components/ui/searchInput/SearchInput";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import ActivityNavLink from "./ActivityNavLink";
import { FaCalendarAlt, FaNewspaper, FaTrophy } from "react-icons/fa";
import { FaChalkboardUser } from "react-icons/fa6";

import "./activitiesNavbar.css";

type ActivitiesNavbarProps = {
  tag: string;
  setTag: Dispatch<SetStateAction<string>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  admin?: boolean;
};

export default function ActivitiesNavbar({
  tag,
  setTag,
  search,
  setSearch,
  ...rest
}: ActivitiesNavbarProps): ReactNode {
  const capitalizeName = tag.charAt(0).toUpperCase() + tag.slice(1) + "s";
  const icons: {
    [key: string]: ReactNode;
  } = {
    Event: <FaCalendarAlt />,
    Workshop: <FaChalkboardUser />,
    Article: <FaNewspaper />,
    Achievement: <FaTrophy />,
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
                {icons[icon]}
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
}
