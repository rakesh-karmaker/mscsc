import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ArticleCard.css";
import { Link } from "react-router-dom";

const ArticleCard = ({ article }) => {
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
      <Link to={link}>
        Learn more <FontAwesomeIcon icon="fa-solid fa-arrow-right" />
      </Link>
    </article>
  );
};

export default ArticleCard;
