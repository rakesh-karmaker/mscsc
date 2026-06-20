import SearchInput from "@/components/ui/search-input/search-input";
import type { ReactNode } from "react";
import FaCalendarAlt from "~icons/fa-solid/calendar-alt";
import FaNewspaper from "~icons/fa-solid/newspaper";
import FaTrophy from "~icons/fa/trophy";
import FaChalkboardUser from "~icons/fa6-solid/chalkboard-user";
import { useDebouncedCallback } from "@/hooks/table-hooks/use-debounced-callback";
import { useActivities } from "@/contexts/activities-context";
import capitalize from "@/utils/capitalize";

import "./activities-navbar.css";

export default function ActivitiesNavbar(): ReactNode {
  const { params, setParams } = useActivities();
  const { search, tag } = params;
  const debouncedSetFilterValues = useDebouncedCallback(
    (values: typeof params) => {
      void setParams(values);
    },
    300,
  );

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
            {tag === "" ? "Activities" : capitalize(tag) + "s"}
          </span>
        </h1>
        <menu>
          {Object.keys(icons).map((name) => {
            return (
              <li>
                <button
                  className={
                    "activities-nav-link" + (tag === name ? " active" : "")
                  }
                  aria-label={`Sort the activities by ${name}`}
                  onClick={() =>
                    tag !== name
                      ? setParams({ ...params, tag: name, page: 1 })
                      : setParams({ ...params, tag: "", page: 1 })
                  }
                >
                  {icons[name]} <span>{name}</span>
                </button>
              </li>
            );
          })}
        </menu>
        <SearchInput
          search={search}
          setSearch={(newSearch: string) =>
            debouncedSetFilterValues({ ...params, search: newSearch, page: 1 })
          }
        >
          Search Activity
        </SearchInput>
      </div>
    </>
  );
}
