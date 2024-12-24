import PrimaryBtn from "@/components/UI/PrimaryBtn";
import SectionHeader from "@/components/UI/SectionHeader";
import Article from "@/components/home-components/articles-components/Article";
import "@/components/home-components/articles-components/Articles.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

const Articles = ({ data }) => {
  const filteredArticles = data
    .filter(
      (activity) => activity.tag == "article" || activity.tag == "achievement"
    )
    .slice(0, 3);

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
        {filteredArticles.map((article) => (
          <Article key={article.activityTitle} article={article} />
        ))}
      </div>
    </section>
  );
};

export default Articles;
