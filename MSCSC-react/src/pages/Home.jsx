import Header from "../components/nav-bars/Header";
import Footer from "../components/Footer";
import Hero from "../components/home-components/hero-components/Hero";
import "../components/home-components/Home.css";

const Home = () => {
  return (
    <>
      <Header />
      <main className="page-home">
        <Hero />
      </main>
      <Footer />
    </>
  );
};

export default Home;
