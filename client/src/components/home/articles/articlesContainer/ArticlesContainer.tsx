import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Article } from "@/types/activityTypes";
import SectionHeader from "@/components/ui/SectionHeader";
import PrimaryBtn from "@/components/ui/PrimaryBtn";
import Loader from "@/components/ui/loader/Loader";
import Empty from "@/components/ui/empty/Empty";
import ArticleCard from "../articleCard/ArticleCard";

import "./articlesContainer.css";

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
