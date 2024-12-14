import PrimaryBtn from "../../PrimaryBtn";
import SectionHeader from "../../SectionHeader";
import Article from "./Article";
import "./Articles.css";

const Articles = ({ data }) => {
  const filteredArticles = data
    .filter(
      (activity) => activity.tag == "article" || activity.tag == "achievement"
    )
    .slice(0, 3);
  console.log(filteredArticles);
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
