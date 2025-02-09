import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ArticleCard.css";
import { NavLink } from "react-router-dom";
import dateFormat from "@/utils/dateFormat";

const ArticleCard = ({ article }) => {
  const { tag, date, coverImageUrl, title, summary, slug } = article;

  return (
    <article className="article">
      <img src={coverImageUrl} alt={`${title} - ${tag} on ${date}`} />
      <div className="category-date">
        <p className="category">{tag}</p>
        <p className="date">{dateFormat(date)}</p>
      </div>
      <h3>{title}</h3>
      <p className="secondary-text">{summary}</p>
      <NavLink to={"/activity/" + slug} aria-label="Go to the article">
        Learn more <FontAwesomeIcon icon="fa-solid fa-arrow-right" />
      </NavLink>
    </article>
  );
};

export default ArticleCard;
