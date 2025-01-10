import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Article = ({ article }) => {
  const { tag, date, coverImageUrl, title, description, link } = article;

  return (
    <article className="article">
      <img src={coverImageUrl} alt={`${title} - ${tag} on ${date}`} />
      <div className="category-date">
        <p className="category">{tag}</p>
        <p className="date">{date}</p>
      </div>
      <h3>{title}</h3>
      <p className="secondary-text">{description}</p>
      <a href={link} target="_blank">
        Learn more <FontAwesomeIcon icon="fa-solid fa-arrow-right" />
      </a>
    </article>
  );
};

export default Article;
