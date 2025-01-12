import Header from "@/layouts/Header/Header";
import { Error, ErrorContent } from "@/components/UI/Error/Error";

const ServerError = () => {
  return (
    <>
      <Header />
      <main className="page-error">
        <Error heading="500" link="/" linkText="Go to Homepage">
          <ErrorContent message="SORRY, IT'S NOT YOU. IT'S US">
            We are experiencing an internal server problem. <br />
            Please try again later
          </ErrorContent>
        </Error>
      </main>
    </>
  );
};

export default ServerError;
