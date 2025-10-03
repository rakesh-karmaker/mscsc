import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./EventCard.css";
import { NavLink } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const EventCard = ({ eventData }) => {
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
        <NavLink to={"/activity/" + slug} aria-label="Go to the article">
          Learn more <FontAwesomeIcon icon="fa-solid fa-arrow-right" />
        </NavLink>
      </article>
    </>
  );
};

export default EventCard;
