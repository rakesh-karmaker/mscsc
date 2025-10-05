import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { getActivity } from "@/lib/api/activities";
import Loader from "@/components/ui/loader/Loader";
import formatDate from "@/utils/formatDate";
import Gallery from "@/components/ui/gallery/Gallery";
import FormattedTextContent from "@/components/ui/formattedTextContent/FormattedTextContent";
import ImageViewer from "@/components/ui/imageViewer/ImageViewer";

import "./activity.css";

export default function Activity(): ReactNode {
  const [open, setOpen] = useState(false);
  const { activityName } = useParams();
  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["activity", activityName],
    queryFn: () => getActivity(activityName as string),
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
          <span className="date">{formatDate(date)}</span>
        </p>
        <p className="summary">{summary}</p>
        <Gallery title="Gallery" images={gallery} />

        <FormattedTextContent content={content} />

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
          {others?.map((act: { slug: string; title: string; date: string }) => {
            return (
              <li key={act.slug} className="other-activity">
                <Link to={`/activity/${act.slug}`}>
                  <p className="other-activity-title">{act.title}</p>
                  <p className="other-activity-date">{formatDate(act.date)}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
    </main>
  );
}
