const Timeline = ({ timelineData }) => {
  const tagIcon = (tag) => {
    switch (tag) {
      case "Project":
        return <i className="fa-solid fa-project-diagram"></i>;
      case "Article":
        return <i className="fa-solid fa-newspaper"></i>;
      case "Certificate":
        return <i className="fa-solid fa-certificate"></i>;
      default:
        return <i className="fa-solid fa-chalkboard-user"></i>;
    }
  };

  if (timelineData.length === 0) {
    return <p className="secondary-text timeline-empty">No timeline data</p>;
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
                <i className="fa-regular fa-calendar"></i>{" "}
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
              Learn More <i className="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
