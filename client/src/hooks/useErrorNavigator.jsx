import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useErrorNavigator = (isError, error) => {
  const navigate = useNavigate();
  useEffect(() => {
    // if (isError) {
    //   if (error?.status === 400) {
    //     navigate("/400", { replace: true });
    //   }
    //   if (error?.status === 401) {
    //     navigate("/401", { replace: true });
    //   }
    //   if (error?.status === 404) {
    //     navigate("/404", { replace: true });
    //   }
    //   if (error?.status === 500) {
    //     navigate("/500", { replace: true });
    //   }
    //   if (error?.status === null || error?.status === undefined) {
    //     navigate("/500", { replace: true });
    //   }
    // }
    console.log(error);
  }, [isError, error]);
};

export default useErrorNavigator;
