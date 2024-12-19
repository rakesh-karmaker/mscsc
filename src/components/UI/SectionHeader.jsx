const SectionHeader = ({ title, description, children }) => {
  return (
    <div className="section-header">
      <div>
        <h2 className="section-heading">{title}</h2>
        <p className="section-sub-heading secondary-text">{description}</p>
      </div>
      {children}
    </div>
  );
};

export default SectionHeader;
