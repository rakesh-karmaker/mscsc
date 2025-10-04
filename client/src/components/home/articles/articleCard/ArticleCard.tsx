import "./ArticleCard.css";
import { NavLink } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import type { Article } from "@/types/activityTypes";
import type { ReactNode } from "react";
import { FaArrowRight } from "react-icons/fa6";
import formatDate from "@/utils/formatDate";

import "./articleCard.css";

export default function ArticleCard({
  article,
}: {
  article: Article;
}): ReactNode {
  const { tag, date, coverImageUrl, title, summary, slug } = article;

  return (
    <article className="article">
      <LazyLoadImage
        src={coverImageUrl}
        alt={`${title} - ${tag} on ${date}`}
        effect="blur"
      />
      <div className="category-date">
        <p className="category">{tag}</p>
        <p className="date">{formatDate(date)}</p>
      </div>
      <h3>{title}</h3>
      <p className="secondary-text">{summary}</p>
      <NavLink
        to={"/activity/" + slug}
        aria-label="Go to the article"
        className="flex gap-1 items-center"
      >
        Learn more <FaArrowRight />
      </NavLink>
    </article>
  );
}
