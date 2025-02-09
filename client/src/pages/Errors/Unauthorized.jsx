import Header from "@/layouts/Header/Header";
import { Error, ErrorContent } from "@/components/UI/Error/Error";

const Unauthorized = () => {
  return (
    <>
      <Header />
      <main className="page-error">
        <Error
          heading="HOLD ON!"
          link="/login"
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
