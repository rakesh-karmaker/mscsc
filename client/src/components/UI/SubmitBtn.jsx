import { useEffect, useState } from "react";

const SubmitBtn = ({ isLoading, pendingText, children, ...rest }) => {
  const width = rest?.width ?? "fit-content";
  const [innerText, setInnerText] = useState(children);

  useEffect(() => {
    if (isLoading) {
      setInnerText(`${pendingText}...`);
    } else {
      setInnerText(children);
    }
  }, [isLoading]);

  return (
    <div>
      <button
        disabled={isLoading}
        type="submit"
        className="primary-button"
        style={{ width: width }}
      >
        {innerText}
      </button>
    </div>
  );
};

export default SubmitBtn;
