import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./EventCard.css";
import { Link } from "react-router-dom";

const EventCard = ({ eventData }) => {
  const { tag, coverImageUrl, title, summary, _id, date } = eventData;
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
        <p className="secondary-text">{summary}</p>
        <Link to={"/activity/" + _id} aria-label="Go to the article">
          Learn more <FontAwesomeIcon icon="fa-solid fa-arrow-right" />
        </Link>
      </article>
    </>
  );
};

export default EventCard;
