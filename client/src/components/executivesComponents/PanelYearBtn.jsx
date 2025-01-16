const YearPanel = (props) => {
  return (
    <button
      className={`panel-year ${props?.active && "active-year"}`}
      year={props?.panelYear}
      onClick={props?.onClick}
      type="button"
      aria-label={`Toggle executives panel of year ${props?.panelYear}`}
    >
      {props?.panelYear}
    </button>
  );
};

export default YearPanel;
