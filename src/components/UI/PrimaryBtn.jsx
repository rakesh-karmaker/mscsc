const PrimaryBtn = ({ link, children, name }) => {
  return (
    <a
      href={link}
      className="primary-button"
      target="_blank"
      aria-label={`Go to ${name}`}
    >
      {children}
    </a>
  );
};

export default PrimaryBtn;
