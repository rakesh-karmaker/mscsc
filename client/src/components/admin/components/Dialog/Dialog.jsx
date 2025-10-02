import { Link } from "react-router-dom";
import "./Dialog.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaReply } from "react-icons/fa";

const Dialog = ({ data, setData }) => {
  console.log(data);
  return (
    <div className={`dialog-container ${data ? "open" : ""}`}>
      <dialog className="message-dialog" open={data ? true : false}>
        <div className="message-info">
          <div className="message-name-container">
            <h2>{data?.name}</h2>
            <button onClick={() => setData(null)} className="close">
              <FontAwesomeIcon icon="fa-solid fa-x" />
            </button>
          </div>
          <a
            href={`mailto:${data?.email}`}
            className="text-sm text-highlighted-color hover:underline"
          >
            {data?.email}
          </a>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-highlighted-color font-medium">Subject</h3>
          <p>{data?.subject}</p>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-highlighted-color font-medium">Message</h3>
          <p className="text-[1rem]/[145%]" style={{ whiteSpace: "pre-wrap" }}>
            {data?.message}
          </p>
        </div>
        <Link to={`mailto:${data?.email}`} className="reply primary-button">
          <FaReply />
          Reply
        </Link>
      </dialog>
    </div>
  );
};

export default Dialog;
