const SubmitBtn = ({ isSubmitting, pendingText, children, ...rest }) => {
  const width = rest?.width ?? "fit-content";
  return (
    <div>
      <button
        disabled={isSubmitting}
        type="submit"
        className="primary-button"
        style={{ width: width }}
      >
        {isSubmitting ? `${pendingText}...` : children}
      </button>
    </div>
  );
};

export default SubmitBtn;
