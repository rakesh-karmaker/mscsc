import EmptyData from "@/components/UI/EmptyData/EmptyData";
import "./Timeline.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Timeline = ({ timelineData }) => {
  const tagIcon = (tag) => {
    switch (tag) {
      case "Project":
        return <FontAwesomeIcon icon="fa-solid fa-project-diagram" />;
      case "Article":
        return <FontAwesomeIcon icon="fa-regular fa-newspaper" />;
      case "Certificate":
        return <FontAwesomeIcon icon="fa-solid fa-certificate" />;
      default:
        return <FontAwesomeIcon icon="fa-solid fa-chalkboard-user" />;
    }
  };

  if (timelineData.length === 0) {
    return <EmptyData style={{ marginTop: "3rem" }} />;
  }

  return (
    <div className="timeline-container">
      {timelineData.map((item) => {
        return (
          <div className="timeline" key={item.title}>
            <div>
              <p className="timeline-tag">
                {tagIcon(item.tag)} <span>{item.tag}</span>
              </p>
              <p className="timeline-date">
                <FontAwesomeIcon icon="fa-regular fa-calendar" />{" "}
                <span>{item.date}</span>
              </p>
            </div>
            <h2 className="timeline-name">{item.title}</h2>
            <p className="secondary-text timeline-summary">
              {item.description}
            </p>
            <a
              href={item.link}
              className="primary-button"
              target="_blank"
              aria-label={`Learn more about ${item.title}`}
            >
              Learn More <FontAwesomeIcon icon="fa-solid fa-arrow-right" />
            </a>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
