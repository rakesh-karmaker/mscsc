import PrimaryBtn from "@/components/UI/PrimaryBtn";
import SectionHeader from "@/components/UI/SectionHeader";
import "./Articles.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useEffect, useState } from "react";
import Loader from "@/components/UI/Loader/Loader";
import EmptyData from "@/components/UI/EmptyData/EmptyData";
import ArticleCard from "@/components/homeComponents/articlesComponents/ArticleCard/ArticleCard";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

const Articles = ({ activities, isLoading }) => {
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    const filteredData = activities
      ?.filter((event) => event.tag === "Article")
      .slice(0, 3);
    setArticles(filteredData);
  }, [activities]);

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
          <EmptyData />
        ) : (
          articles?.map((article) => (
            <ArticleCard key={article._id + "article"} article={article} />
          ))
        )}
      </div>
    </section>
  );
};

export default Articles;
