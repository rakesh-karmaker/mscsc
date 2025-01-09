import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/admin/dashboard");
  });

  return null;
};

export default Admin;
