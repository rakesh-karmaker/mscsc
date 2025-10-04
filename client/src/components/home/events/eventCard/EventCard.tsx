import type { Event } from "@/types/activityTypes";
import type { ReactNode } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { NavLink } from "react-router-dom";

import "react-lazy-load-image-component/src/effects/blur.css";
import "./eventCard.css";

export default function EventCard({
  eventData,
}: {
  eventData: Event;
}): ReactNode {
  const { tag, coverImageUrl, title, summary, slug, date } = eventData;
  const status = new Date(date) < new Date() ? "Happened" : "Upcoming";
  const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1);

  return (
    <>
      <LazyLoadImage
        src={coverImageUrl}
        alt={`A poster of ${title} - ${tag} on ${date}`}
        effect="blur"
      />
      <article>
        <p className="event-tags">
          <span>{capitalizedTag}</span>
          <span>{status}</span>
        </p>
        <h3>{title}</h3>
        <p className="secondary-text">{summary}</p>
        <NavLink
          to={"/activity/" + slug}
          aria-label="Go to the article"
          className="flex gap-1 items-center"
        >
          Learn more <FaArrowRight />
        </NavLink>
      </article>
    </>
  );
}
