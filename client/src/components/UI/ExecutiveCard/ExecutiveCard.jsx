import "@/components/UI/ExecutiveCard/ExecutiveCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
const ExecutiveCard = ({ executiveData }) => {
  const { name, position, image, socials, panel } = executiveData;
  return (
    <div className="executive-member">
      <div>
        <div className="executive-upper">
          <img
            src={`/executive-members/${image}`}
            alt={`A picture of ${name}, our ${position} of MSCSC in ${panel}`}
          />
          <div className="member-socials row-center">
            <ExecutiveSocials socials={socials} name={name} />
          </div>
        </div>
        <div className="executive-lower col-center">
          <p>{name}</p>
          <p className="secondary-text">{position}</p>
        </div>
      </div>
    </div>
  );
};

const ExecutiveSocials = ({ socials, name }) => {
  const socialsList = Object.keys(socials);
  if (socialsList.length > 0) {
    return (
      <>
        {socialsList.map((social) => {
          return (
            <Link
              key={social}
              to={socials[social]}
              className="row-center"
              title={social}
              aria-label={`Go to ${name}'s ${social} page`}
            >
              <FontAwesomeIcon icon={`fa-brands fa-${social}`} />
            </Link>
          );
        })}
      </>
    );
  } else {
    return;
  }
};

export default ExecutiveCard;
