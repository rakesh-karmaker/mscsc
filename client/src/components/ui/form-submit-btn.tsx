import { useEffect, useState, type ReactNode } from "react";

type FormSubmitBtnProps = {
  isLoading: boolean;
  pendingText: string;
  children: ReactNode;
  className?: string;
  width?: string;
};

export default function FormSubmitBtn({
  isLoading,
  pendingText,
  className,
  children,
  ...rest
}: FormSubmitBtnProps): ReactNode {
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
    <div className="submit-btn-container">
      <button
        disabled={isLoading}
        type="submit"
        className={"primary-button" + (className ? ` ${className}` : "")}
        style={{ width: width }}
      >
        {innerText}
      </button>
    </div>
  );
}
