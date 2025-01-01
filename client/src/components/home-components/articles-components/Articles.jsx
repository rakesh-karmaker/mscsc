import PrimaryBtn from "@/components/UI/PrimaryBtn";
import SectionHeader from "@/components/UI/SectionHeader";
import Article from "@/components/home-components/articles-components/Article";
import "@/components/home-components/articles-components/Articles.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useEffect, useState } from "react";
import { getAllActivities } from "@/services/GetService";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

const Articles = () => {
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    const fetchArticles = async () => {
      const response = await getAllActivities(1, 3, "Article", "");
      setArticles(response.data.results);
    };
    fetchArticles();
  }, []);

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
        <PrimaryBtn link="/activities" name="See More">
          See More
        </PrimaryBtn>
      </SectionHeader>
      <div className="articles-container">
        {articles?.map((article) => (
          <Article key={article._id + "article"} article={article} />
        ))}
      </div>
    </section>
  );
};

export default Articles;
