import { useNavigate } from "react-router-dom";

const FilterError = ({ error }) => {
  const navigate = useNavigate();
  if (!error) return;
  navigate(`/${error.status}`, { replace: true });
  console.log(error);
  return;
};

export default FilterError;
