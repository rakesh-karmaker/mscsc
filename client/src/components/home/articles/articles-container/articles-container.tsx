import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Article } from "@/types/activity-types";
import SectionHeader from "@/components/ui/section-header";
import PrimaryBtn from "@/components/ui/primary-btn";
import Loader from "@/components/ui/loader/loader";
import Empty from "@/components/ui/empty/empty";
import ArticleCard from "../article-card/article-card";

import "./articles-container.css";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

export default function ArticlesContainer({
  articles,
  isLoading,
}: {
  articles: Article[];
  isLoading: boolean;
}) {
  useGSAP(() => {
    gsap.fromTo(
      ".articles-container",
      {
        y: "100px",
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        scrollTrigger: ".articles-container",
      }
    );
  });

  return (
    <section id="articles" className="page-section col-center">
      <SectionHeader
        title="CLUB Articles"
        description="Articles about the achievements and researches of MSCSC"
      >
        <PrimaryBtn link="/activities?tag=Article" name="See More">
          See More
        </PrimaryBtn>
      </SectionHeader>
      <div className="articles-container">
        {isLoading ? (
          <Loader />
        ) : articles?.length == 0 ? (
          <Empty />
        ) : (
          articles?.map((article) => (
            <ArticleCard key={article._id + "article"} article={article} />
          ))
        )}
      </div>
    </section>
  );
}
