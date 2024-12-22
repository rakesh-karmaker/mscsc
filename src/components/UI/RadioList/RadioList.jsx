import "@/components/UI/RadioList/RadioList.css";

const RadioList = ({ register, errors, dataList, children }) => {
  return (
    <div className="radio-list-container">
      <p className="input-heading">{children}</p>
      <div className="radio-list">
        {dataList.map((item) => {
          return (
            <div key={item} className="radio-item">
              <input type="radio" id={item} {...register} value={item} />
              <label htmlFor={item} className="radio-label">
                <span className="checkMark"></span>
                {item}
              </label>
            </div>
          );
        })}
      </div>
      {errors && <p className="error-message">{errors.message}</p>}
    </div>
  );
};

export default RadioList;
