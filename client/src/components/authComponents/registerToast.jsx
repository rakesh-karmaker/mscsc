import { registerUser } from "@/services/PostService";
import filterError from "@/utils/FilterError";
import { toast } from "react-hot-toast";
const registerToast = async (data, setError) => {
  toast.promise(registerUser(data), {
    loading: "Registering...",
    success: (res) => {
      if (res.status === 201) {
        localStorage.setItem("token", res.data.token);
      }
      return "Registered Successfully";
    },
    error: (err) => {
      if (err.status === 500) filterError(err);
      if (err.status === 400) {
        setError(err.response.data.subject, {
          message: err.response.data.message,
        });
        setError("root", {
          message: "Invalid Credentials",
        });
        console.log(err.response.data.message);
      }
      return err.response.data.message;
    },
  });
};

export default registerToast;
