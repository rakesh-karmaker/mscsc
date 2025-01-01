const Activity = ({ data, selectedTag, admin, ...rest }) => {
  const { tag, date, coverImageUrl, title, description, link } = data;

  return (
    <div className="activity" tag={tag}>
      <img src={`${coverImageUrl}`} alt={`The image of ${title}`} />

      <article>
        <div className="activity-meta">
          {selectedTag === "" ? <Tag tag={data.tag} /> : ""}
          <p className="activity-date">
            <i className="fa-regular fa-calendar"></i> <span>{date}</span>
          </p>
        </div>
        <h2 className="activity-name">{title}</h2>
        <p className="secondary-text activity-summary">{description}</p>
        <div className="activity-actions">
          <a
            href={link}
            className="primary-button"
            target="_blank"
            aria-label={`Learn more about ${title}`}
          >
            Learn More <i className="fa-solid fa-arrow-right"></i>
          </a>

          {admin && (
            <button
              className="secondary-button primary-button"
              aria-label="Edit this activity"
              type="button"
              onClick={() => rest.setSelectedActivity(data)}
            >
              <i className="fa-solid fa-pencil"></i>
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
      <i className="fa-solid fa-chalkboard-user"></i>
      <span>{capitalizeTag}</span>
    </p>
  );
};

export default Activity;
