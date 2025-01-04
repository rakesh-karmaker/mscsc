import { useRef, useState } from "react";
import "./DeleteBtn.css";

const DeleteBtn = ({ id, deleteFunc, btnText, children }) => {
  console.log(id);
  const deleteDialog = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="delete-btn-container">
      <div className={`dialog-container ${isOpen ? "open" : ""}`}>
        <dialog className="delete-dialog" ref={deleteDialog}>
          <div>
            <h2>Delete Member</h2>
            <p>{children}</p>
          </div>
          <div className="delete-dialog-actions">
            <button
              type="button"
              className="primary-button"
              onClick={(e) => {
                e.stopPropagation();
                deleteDialog.current.close();
                setIsOpen(false);
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="danger-button primary-button"
              onClick={(e) => {
                e.stopPropagation();
                deleteFunc(id);
                deleteDialog.current.close();
                setIsOpen(false);
              }}
            >
              Delete
            </button>
          </div>
        </dialog>
      </div>
      <button
        className="danger-button primary-button"
        aria-label="Delete this data"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          deleteDialog.current.show();
          setIsOpen(true);
        }}
      >
        {btnText ? btnText : "Delete"}
      </button>
    </div>
  );
};

export default DeleteBtn;