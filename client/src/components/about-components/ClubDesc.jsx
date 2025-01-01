import PrimaryBtn from "@/components/UI/PrimaryBtn";

const ClubDescription = () => {
  return (
    <div className="club-description">
      <p>Join</p>
      <h2>
        Unlock Your Potential with
        <span className="highlighted-text">MSCSC</span>
      </h2>
      <p className="secondary-text">
        Joining MSCSC offers essential skill development and valuable
        educational resources. This community enhances your personal and
        professional skills while connecting you with growth-oriented
        individuals. It fosters networking and shared insights, enriching your
        experience and broadening your horizons.
      </p>

      <div className="benefits-container row-center">
        <Benefit
          title="Skill Development"
          icon="skilldev.png"
          marginBottom="4px"
        >
          Boost your skills and knowledge with engaging hands-on projects and
          workshops designed to accommodate all levels of expertise.
        </Benefit>

        <Benefit title="Community Support" icon="communitysupport.png">
          Engage with fellow enthusiasts and experienced mentors who share your
          deep passion for both science and technology innovation.
        </Benefit>
      </div>
      <PrimaryBtn link="https://www.facebook.com/MSCSC2014" name="Facebook">
        Learn More
      </PrimaryBtn>
    </div>
  );
};

const Benefit = ({ icon, title, children, marginBottom }) => {
  const margin = marginBottom ? marginBottom : "0px";
  const style = { marginBottom: margin };
  return (
    <div className="benefit">
      <img className={style} src={`/icons/${icon}`} alt={`A ${title} icon`} />
      <h3>{title}</h3>
      <p className="secondary-text">{children}</p>
    </div>
  );
};

export default ClubDescription;
