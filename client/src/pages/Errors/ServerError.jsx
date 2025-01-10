import Header from "@/layout/Header/Header";
import { Error, ErrorContent } from "@/components/UI/Error/Error";
import MetaTags from "@/layout/MetaTags";

const ServerError = ({ error }) => {
  return (
    <>
      <MetaTags
        title="MSCSC - Server Error"
        description="We are experiencing an internal server problem. Please try again later."
      />
      <Header />
      <main className="page-error">
        <Error heading="500" link="/" linkText="Go to Homepage">
          <ErrorContent message="SORRY, IT’S NOT YOU. IT’S US">
            We are experiencing an internal server problem. <br />
            Please try again later
          </ErrorContent>
        </Error>
      </main>
    </>
  );
};

export default ServerError;
