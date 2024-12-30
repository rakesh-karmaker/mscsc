import { Link } from "react-router-dom";
import "./Dialog.css";

const Dialog = ({ data, setData }) => {
  return (
    <div className={`dialog-container ${data ? "open" : ""}`}>
      <dialog className="message-dialog" open={data ? true : false}>
        <div className="message-info">
          <div className="message-name-container">
            <h2>{data?.name}</h2>
            <button onClick={() => setData(null)} className="close">
              <i className="fa-solid fa-x"></i>
            </button>
          </div>
          <p className="message-email highlighted-text">{data?.email}</p>
        </div>
        <div className="subject">
          <h3>Subject</h3>
          <p>{data?.subject}</p>
        </div>
        <div className="message">
          <h3>Message</h3>
          <p>{data?.message}</p>
        </div>
        <Link to={`mailto:${data?.email}`} className="reply primary-button">
          Reply
          <span className="reply-icon">
            <i className="fa-solid fa-reply fa-flip-horizontal"></i>
          </span>
        </Link>
      </dialog>
    </div>
  );
};

export default Dialog;
