import "./TermsPolicy.css";

const TermsPolicyContent = ({ content, page }) => {
  return (
    <section className="terms-policy-content">
      {page === "terms" && (
        <p>
          Welcome to the Monipur School and College Science Club (MSCSC)! By
          accessing or using our website, you agree to the following terms and
          conditions. Please read them carefully.
        </p>
      )}
      {content.map((item, index) => (
        <TermsPolicyItem
          key={item.id}
          title={item.title}
          content={item.content}
          list={item.list}
          index={index + 1}
          id={item.id}
        />
      ))}
      <p className="last-updated">Last Updated: 18-01-2025</p>
    </section>
  );
};

const TermsPolicyItem = ({ title, content, list, index, id }) => {
  return (
    <div className="terms-policy-item">
      <h2 id={`${id}`}>
        {index}. {title}
      </h2>
      <p>{content}</p>
      {list && (
        <ul>
          {list.map((item, i) => (
            <li key={id + item + i}>
              <span className="bullet"></span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const KeyPoints = ({ content }) => {
  return (
    <aside className="key-points">
      <h2 className="aside-heading">Key Points</h2>
      <ul className="key-points-list">
        {content.map((keyPoint, index) => (
          <li key={keyPoint.title} className="key-point-item">
            <a href={`#${keyPoint.id}`}>
              {index + 1}. {keyPoint.title}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export { TermsPolicyContent, KeyPoints };
