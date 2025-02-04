import { getActivity } from "@/services/GetService";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/UI/Loader/Loader";

import "./Activity.css";
import Gallery from "@/components/UI/Gallery/Gallery";
import { useActivities } from "@/contexts/ActivitiesContext";
import TextContent from "@/components/UI/TextContent/TextContent";

const Activity = () => {
  const { allActivities, allActivitiesIsLoading } = useActivities();
  const { id } = useParams();
  const {
    data: activityData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["activity", id],
    queryFn: () => getActivity(id),
    refetchOnWindowFocus: false,
    retry: 0,
  });

  if (error) {
    throw Error("Failed to fetch activity");
  }

  if (isLoading || allActivitiesIsLoading) {
    return (
      <div style={{ height: "100vh" }} className="row-center">
        <Loader />
      </div>
    );
  }

  const { tag, date, title, summary, coverImageUrl, gallery, content, _id } =
    activityData.data;

  const filteredActivities = allActivities
    .filter((act) => act.tag === tag && act._id !== _id)
    .slice(0, window.innerWidth > 1080 ? 7 : 5);

  return (
    <main className="page-activity">
      <div className="activity-details">
        <img
          src={coverImageUrl}
          alt={`cover image of ${title}`}
          className="cover"
          width="1200"
        />
        <p className="title">{title}</p>
        <p className="tags">
          <a href={`/activities?tag=${tag}`} className="tag">
            {tag}
          </a>
          <span>/</span>
          <span className="date">{date}</span>
        </p>
        <p className="summary">{summary}</p>
        <Gallery title="Gallery" images={gallery} />

        <TextContent content={content} />
      </div>

      <aside className="others">
        <p className="others-title">Other {tag}s</p>
        <ul className="others-container">
          {filteredActivities.map((act) => {
            return (
              <li key={act._id} className="other-activity">
                <Link to={`/activity/${act._id}`}>
                  <p className="other-activity-title">{act.title}</p>
                  <p className="other-activity-date">{act.date}</p>
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
