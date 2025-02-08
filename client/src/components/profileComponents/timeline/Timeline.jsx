import EmptyData from "@/components/UI/EmptyData/EmptyData";
import "./Timeline.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import dateFormat from "@/utils/dateFormat";
const Timeline = ({ timelineData }) => {
  if (timelineData.length === 0) {
    return <EmptyData style={{ marginTop: "3rem" }} />;
  }

  const sortedTimelineData = timelineData.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });

  const tagIcon = (tag) => {
    switch (tag) {
      case "Project":
        return <FontAwesomeIcon icon="fa-solid fa-project-diagram" />;
      case "Competition":
        return <FontAwesomeIcon icon="fa-solid fa-medal" />;
      case "Certificate":
        return <FontAwesomeIcon icon="fa-solid fa-certificate" />;
      default:
        return <FontAwesomeIcon icon="fa-solid fa-chalkboard-user" />;
    }
  };

  return (
    <div className="timeline-container">
      {sortedTimelineData.map((item) => {
        return (
          <div className="timeline" key={item.title}>
            <div>
              <p className="timeline-tag">
                {tagIcon(item.tag)} <span>{item.tag}</span>
              </p>
              <p className="timeline-date">
                <FontAwesomeIcon icon="fa-regular fa-calendar" />{" "}
                <span>{dateFormat(item.date)}</span>
              </p>
            </div>
            <h2 className="timeline-name">{item.title}</h2>
            <p className="secondary-text timeline-summary">
              {item.description}
            </p>
            <Link
              to={item.link}
              className="primary-button"
              aria-label={`Learn more about ${item.title}`}
            >
              Learn More <FontAwesomeIcon icon="fa-solid fa-arrow-right" />
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
