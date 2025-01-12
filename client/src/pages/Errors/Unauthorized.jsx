import Header from "@/layouts/Header/Header";
import { Error, ErrorContent } from "@/components/UI/Error/Error";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Unauthorized = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user !== null && user?.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [user, navigate]);
  return (
    <>
      <Header />
      <main className="page-error">
        <Error
          heading="HOLD ON!"
          link="/register"
          linkText="Login"
          style={{
            fontSize: "128px",
            lineHeight: "125px",
          }}
        >
          <ErrorContent message="ERROR 401: UNAUTHORIZED">
            You are not authorized to access this page. <br />
            Please login to access this page
          </ErrorContent>
        </Error>
      </main>
    </>
  );
};

export default Unauthorized;
