import { editUser } from "@/services/PutService";
import { toast } from "react-hot-toast";
const editProfileToast = async (data, setError) => {
  toast.promise(editUser(data), {
    loading: "Editing...",
    success: (res) => {
      if (res.status === 200) {
        return res.data.message + ". Reload the page";
      }
    },
    error: (err) => {
      setError("root", {
        message: err.response.data.message,
      });
      console.log(err.response.data.message);

      return err.response.data.message;
    },
  });
};

export default editProfileToast;