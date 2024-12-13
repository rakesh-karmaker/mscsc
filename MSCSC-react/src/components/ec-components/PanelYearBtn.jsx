const YearPanel = (props) => {
  return (
    <button
      className="panel-year"
      year={props.panelYear}
      onClick={props.onClick}
    >
      {props.panelYear}
    </button>
  );
};

export default YearPanel;
