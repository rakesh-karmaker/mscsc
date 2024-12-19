const Article = ({ article }) => {
  const {
    tag,
    activityDate,
    activityImagePath,
    activityTitle,
    activityDesc,
    activityLink,
  } = article;

  const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1);
  return (
    <article className="article">
      <img
        src={`/activities/${tag}/${activityImagePath}`}
        alt={`Became ${activityTitle}`}
      />
      <div className="category-date">
        <p className="category">{capitalizedTag}</p>
        <p className="date">{activityDate}</p>
      </div>
      <h3>{activityTitle}</h3>
      <p className="secondary-text">{activityDesc}</p>
      <a href={activityLink} target="_blank">
        Learn more <i className="fa-solid fa-arrow-right"></i>
      </a>
    </article>
  );
};

export default Article;
