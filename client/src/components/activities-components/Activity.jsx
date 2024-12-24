const Activity = ({ data, select }) => {
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
          {select == "false" ? <Tag tag={tag} /> : ""}
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
  return (
    <p className="activity-tag">
      <i className="fa-solid fa-chalkboard-user"></i>
      <span>{tag}</span>
    </p>
  );
};

export default Activity;
