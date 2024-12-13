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
            <ExecutiveSocials socials={socials} />
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

const ExecutiveSocials = ({ socials }) => {
  const socialsList = Object.keys(socials);
  if (socialsList.length > 0) {
    return (
      <>
        {socialsList.map((social) => {
          return (
            <a
              key={social}
              href={socials[social]}
              target="_blank"
              title={social}
            >
              <i className={`row-center fa-brands fa-${social}`}></i>
            </a>
          );
        })}
      </>
    );
  } else {
    return <></>;
  }
};

export default ExecutiveCard;
