import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const useLoadingToast = (isLoading, text) => {
  const [loadingToastId, setLoadingToastId] = useState(null);
  useEffect(() => {
    if (isLoading) {
      const id = toast.loading(text);
      setLoadingToastId(id);
    } else {
      toast.dismiss(loadingToastId);
    }
  }, [isLoading]);
};

export default useLoadingToast;
