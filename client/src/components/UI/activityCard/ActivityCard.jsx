import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ActivityCard.css";
import { Link } from "react-router-dom";

const ActivityCard = ({ data, selectedTag, admin, ...rest }) => {
  const { tag, date, coverImageUrl, title, description, link } = data;

  return (
    <div className="activity" tag={tag}>
      <img src={`${coverImageUrl}`} alt={`The image of ${title}`} />

      <article>
        <div className="activity-meta">
          {selectedTag === "" ? <Tag tag={data.tag} /> : ""}
          <p className="activity-date">
            <FontAwesomeIcon icon="fa-regular fa-calendar" />
            <span>{date}</span>
          </p>
        </div>
        <h2 className="activity-name">{title}</h2>
        <p className="secondary-text activity-summary">{description}</p>
        <div className="activity-actions">
          <Link
            to={link}
            className="primary-button"
            aria-label={`Learn more about ${title} - ${tag} on ${date} at our Facebook page.`}
          >
            Learn More <FontAwesomeIcon icon="fa-solid fa-arrow-right" />
          </Link>

          {admin && (
            <button
              className="secondary-button primary-button"
              aria-label="Edit this activity"
              type="button"
              onClick={() => rest.setSelectedActivity(data)}
            >
              <FontAwesomeIcon icon="fa-solid fa-pencil" />
              <span>Edit</span>
            </button>
          )}
        </div>
      </article>
    </div>
  );
};

const Tag = ({ tag }) => {
  const capitalizeTag = tag.charAt(0).toUpperCase() + tag.slice(1);
  return (
    <p className="activity-tag">
      <FontAwesomeIcon icon="fa-solid fa-chalkboard-user" />
      <span>{capitalizeTag}</span>
    </p>
  );
};

export default ActivityCard;
