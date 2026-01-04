import { Link } from "react-router-dom";
import type { User } from "@/types/user-types";
import formatDate from "@/utils/format-date";
import Empty from "@/components/ui/empty/empty";
import {
  FaCalendarAlt,
  FaCertificate,
  FaMedal,
  FaProjectDiagram,
} from "react-icons/fa";
import { FaArrowRight, FaChalkboardUser } from "react-icons/fa6";

export default function Timeline({
  timelineData,
}: {
  timelineData: User["timeline"];
}) {
  if (timelineData.length === 0) {
    return <Empty style={{ marginTop: "3rem" }} />;
  }

  const sortedTimelineData = timelineData.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  const tagIcon = (tag: string) => {
    switch (tag) {
      case "Project":
        return <FaProjectDiagram />;
      case "Competition":
        return <FaMedal />;
      case "Certificate":
        return <FaCertificate />;
      default:
        return <FaChalkboardUser />;
    }
  };

  return (
    <div className="w-full !mt-5 grid grid-cols-3 gap-7.5 max-2xl:grid-cols-2 max-xl:grid-cols-1">
      {sortedTimelineData.map((item) => {
        return (
          <div
            className="[box-shadow:rgba(149,157,165,0.2)_0px_8px_24px] relative !p-5 flex flex-col gap-3 rounded-lg justify-between"
            key={item.title}
          >
            <div className="flex flex-col gap-3">
              <div className="flex gap-2.5 items-center justify-between">
                <p className="text-highlighted-color flex gap-1.5 items-center text-[0.9em]">
                  {tagIcon(item.tag)} <span>{item.tag}</span>
                </p>
                {item.date && (
                  <p className="text-[#7d7d7d] text-[0.9em] flex gap-1.5 items-center">
                    <FaCalendarAlt /> <span>{formatDate(item.date)}</span>
                  </p>
                )}
              </div>
              <h2
                className="text-2xl font-medium line-clamp-2"
                title={item.title}
              >
                {item.title}
              </h2>
              <p className="secondary-text text-[0.9em] text-[#7d7d7d] line-clamp-4">
                {item.description}
              </p>
            </div>
            {item.link && item.link.trim() !== "" ? (
              <Link
                to={item.link}
                className="primary-button flex gap-1 items-center !px-[16px] !py-[8px] !text-sm w-fit !h-fit"
                aria-label={`Learn more about ${item.title}`}
              >
                Learn More <FaArrowRight />
              </Link>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
