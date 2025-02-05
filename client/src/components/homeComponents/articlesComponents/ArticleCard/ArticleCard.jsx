import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ArticleCard.css";
import { Link } from "react-router-dom";
import dateFormat from "@/utils/dateFormat";

const ArticleCard = ({ article }) => {
  const { tag, date, coverImageUrl, title, summary, _id } = article;

  return (
    <article className="article">
      <img src={coverImageUrl} alt={`${title} - ${tag} on ${date}`} />
      <div className="category-date">
        <p className="category">{tag}</p>
        <p className="date">{dateFormat(date)}</p>
      </div>
      <h3>{title}</h3>
      <p className="secondary-text">{summary}</p>
      <Link to={"/activity/" + _id} aria-label="Go to the article">
        Learn more <FontAwesomeIcon icon="fa-solid fa-arrow-right" />
      </Link>
    </article>
  );
};

export default ArticleCard;
