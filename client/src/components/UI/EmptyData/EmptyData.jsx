import "./EmptyData.css";

const EmptyData = () => {
  return (
    <div className="empty-data col-center">
      <i className="fa-regular fa-face-frown-open"></i>
      <p>
        No <span className="highlighted-text">results</span> found
      </p>
    </div>
  );
};

export default EmptyData;
