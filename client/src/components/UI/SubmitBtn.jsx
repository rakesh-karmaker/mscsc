import { useEffect, useState } from "react";

const SubmitBtn = ({ isSubmitting, pendingText, children, ...rest }) => {
  const width = rest?.width ?? "fit-content";
  const [innerText, setInnerText] = useState(children);

  useEffect(() => {
    if (isSubmitting) {
      setInnerText(`${pendingText}...`);
    } else {
      setInnerText(children);
    }
  }, [isSubmitting]);

  return (
    <div>
      <button
        disabled={isSubmitting}
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
