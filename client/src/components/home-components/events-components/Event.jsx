const Event = ({ eventData }) => {
  const {
    tag,
    status,
    activityImagePath,
    activityTitle,
    activityDesc,
    activityLink,
  } = eventData;
  const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1);
  return (
    <>
      <img
        src={`/activities/${tag}/${activityImagePath}`}
        alt={`A poster of ${activityTitle} workshop`}
      />
      <article>
        <p className="event-tags">
          <span>{capitalizedTag}</span>
          <span>{status}</span>
        </p>
        <h3>{activityTitle}</h3>
        <p className="secondary-text">{activityDesc}</p>
        <a
          href={activityLink}
          target="_blank"
          aria-label="Go to the Facebook post"
        >
          Learn more <i className="fa-solid fa-arrow-right"></i>
        </a>
      </article>
    </>
  );
};

export default Event;
