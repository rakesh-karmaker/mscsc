import { getActivity } from "@/services/GetService";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/UI/Loader/Loader";

import "./Activity.css";
import Gallery from "@/components/UI/Gallery/Gallery";
import TextContent from "@/components/UI/TextContent/TextContent";
import dateFormat from "@/utils/dateFormat";
import { LazyLoadImage } from "react-lazy-load-image-component";

const Activity = () => {
  const { activityName } = useParams();
  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["activity", activityName],
    queryFn: () => getActivity(activityName),
    refetchOnWindowFocus: false,
    retry: 0,
  });

  if (error) {
    throw Error("Failed to fetch activity");
  }

  if (isLoading) {
    return (
      <div style={{ height: "100vh" }} className="row-center">
        <Loader />
      </div>
    );
  }

  const { tag, date, title, summary, coverImageUrl, gallery, content } =
    response?.data?.activity;

  const others = response?.data?.sameTags;

  return (
    <main className="page-activity">
      <div className="activity-details">
        <LazyLoadImage
          src={coverImageUrl}
          alt={`cover image of ${title}`}
          className="cover"
          // width="1200"
        />

        <p className="title">{title}</p>
        <p className="tags">
          <a href={`/activities?tag=${tag}`} className="tag">
            {tag}
          </a>
          <span>/</span>
          <span className="date">{dateFormat(date)}</span>
        </p>
        <p className="summary">{summary}</p>
        <Gallery title="Gallery" images={gallery} />

        <TextContent content={content} />
      </div>

      <aside className="others">
        <p className="others-title">Other {tag}s</p>
        <ul className="others-container">
          {others?.map((act) => {
            return (
              <li key={act.slug} className="other-activity">
                <Link to={`/activity/${act.slug}`}>
                  <p className="other-activity-title">{act.title}</p>
                  <p className="other-activity-date">{dateFormat(act.date)}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
    </main>
  );
};

export default Activity;
