const Activity = ({ data, topic }) => {
  const {
    tag,
    activityDate,
    activityImagePath,
    activityTitle,
    activityDesc,
    activityLink,
  } = data;
  return (
    <div className="activity" tag={tag}>
      <img
        src={`/activities/${tag}/${activityImagePath}`}
        alt={`The image of ${activityTitle}`}
      />

      <article>
        <div>
          {topic !== "" ? <Tag tag={tag} /> : ""}
          <p className="activity-date">
            <i className="fa-regular fa-calendar"></i>{" "}
            <span>{activityDate}</span>
          </p>
        </div>
        <h2 className="activity-name">{activityTitle}</h2>
        <p className="secondary-text activity-summary">{activityDesc}</p>
        <a
          href={activityLink}
          className="primary-button"
          target="_blank"
          aria-label={`Learn more about ${activityTitle}`}
        >
          Learn More <i className="fa-solid fa-arrow-right"></i>
        </a>
      </article>
    </div>
  );
};

const Tag = ({ tag }) => {
  const capitalizeTag = tag.charAt(0).toUpperCase() + tag.slice(1);
  return (
    <p className="activity-tag">
      <i className="fa-solid fa-chalkboard-user"></i>
      <span>{capitalizeTag}</span>
    </p>
  );
};

export default Activity;
