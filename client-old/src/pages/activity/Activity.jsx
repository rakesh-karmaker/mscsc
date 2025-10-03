import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/UI/Loader/Loader";
import { useState } from "react";

import "./Activity.css";
import Gallery from "@/components/UI/Gallery/Gallery";
import TextContent from "@/components/UI/TextContent/TextContent";
import dateFormat from "@/utils/dateFormat";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ImageViewer from "@/components/UI/ImageViewer/ImageViewer";
import { getActivity } from "@/lib/api/activities";

const Activity = () => {
  const [open, setOpen] = useState(false);
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
        <div className="cover-image-container" onClick={() => setOpen(true)}>
          <LazyLoadImage
            src={coverImageUrl}
            alt={`cover image of ${title}`}
            className="cover"
            onClick={() => setOpen(true)}
          />
          <p>View full image</p>
        </div>

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

        <ImageViewer
          data={[{ url: coverImageUrl }]}
          open={open}
          setOpen={setOpen}
          index={0}
        />
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
