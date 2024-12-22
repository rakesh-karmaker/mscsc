const SubmitBtn = ({ isSubmitting, pendingText, children }) => {
  return (
    <div>
      <button
        disabled={isSubmitting}
        type="submit"
        className="primary-button"
        style={{ width: "fit-content" }}
      >
        {isSubmitting ? `${pendingText}...` : children}
      </button>
    </div>
  );
};

export default SubmitBtn;
