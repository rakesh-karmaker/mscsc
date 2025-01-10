import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./EmptyData.css";

const EmptyData = () => {
  return (
    <div className="empty-data col-center">
      <FontAwesomeIcon icon="fa-regular fa-face-frown-open" />
      <p>
        No <span className="highlighted-text">results</span> found
      </p>
    </div>
  );
};

export default EmptyData;
