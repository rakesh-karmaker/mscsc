import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./EventCard.css";

const EventCard = ({ eventData }) => {
  const { tag, coverImageUrl, title, description, link, date } = eventData;
  const status = new Date(date) < new Date() ? "Happened" : "Upcoming";
  const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1);

  return (
    <>
      <img
        src={coverImageUrl}
        alt={`A poster of ${title} - ${tag} on ${date}`}
      />
      <article>
        <p className="event-tags">
          <span>{capitalizedTag}</span>
          <span>{status}</span>
        </p>
        <h3>{title}</h3>
        <p className="secondary-text">{description}</p>
        <a href={link} target="_blank" aria-label="Go to the Facebook post">
          Learn more <FontAwesomeIcon icon="fa-solid fa-arrow-right" />
        </a>
      </article>
    </>
  );
};

export default EventCard;