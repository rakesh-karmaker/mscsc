import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  console.log("Admin.jsx");
  useEffect(() => {
    navigate("/admin/dashboard");
  });

  return null;
};

export default Admin;
