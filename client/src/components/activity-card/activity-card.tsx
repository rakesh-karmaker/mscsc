import { NavLink } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import type { ActivityPreview } from "@/types/activity-types";
import type { Dispatch, SetStateAction } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import formatDate from "@/utils/format-date";
import { FaArrowRight, FaChalkboardUser } from "react-icons/fa6";
import { HiPencil } from "react-icons/hi2";

import "./activity-card.css";

type ActivityCardProps = {
  data: ActivityPreview;
  selectedTag: string;
  admin?: boolean;
  setSelectedActivity?: Dispatch<SetStateAction<ActivityPreview | null>>;
};

export default function ActivityCard({
  data,
  selectedTag,
  admin,
  ...rest
}: ActivityCardProps) {
  const { tag, date, coverImageUrl, title, summary, slug } = data;

  return (
    <div className="activity" data-tag={tag}>
      <LazyLoadImage
        src={`${coverImageUrl}`}
        alt={`The image of ${title}`}
        effect="blur"
      />

      <article>
        <div className="activity-meta">
          {selectedTag === "" ? <Tag tag={data.tag} /> : ""}
          <p className="activity-date flex gap-1 items-center">
            <FaCalendarAlt />
            <span>{formatDate(date)}</span>
          </p>
        </div>
        <h2 className="activity-name">{title}</h2>
        <p className="secondary-text activity-summary">{summary}</p>
        <div className="activity-actions">
          <NavLink
            to={"/activity/" + slug}
            className="primary-button flex gap-1 items-center"
            aria-label={`Learn more about ${title} - ${tag} on ${date} at our Facebook page.`}
          >
            Learn More <FaArrowRight />
          </NavLink>

          {admin && (
            <button
              className="secondary-button primary-button flex gap-1 items-center"
              aria-label="Edit this activity"
              type="button"
              onClick={() => {
                if (rest.setSelectedActivity) {
                  rest.setSelectedActivity(data);
                }
              }}
            >
              <HiPencil />
              <span>Edit</span>
            </button>
          )}
        </div>
      </article>
    </div>
  );
}

const Tag = ({ tag }: { tag: string }) => {
  const capitalizeTag = tag.charAt(0).toUpperCase() + tag.slice(1);
  return (
    <p className="activity-tag flex gap-1 items-center">
      <FaChalkboardUser />
      <span>{capitalizeTag}</span>
    </p>
  );
};
