import Header from "@/layout/Header/Header";
import { Error, ErrorContent } from "@/components/UI/Error/Error";
import MetaTags from "@/layout/MetaTags";

const BadRequest = () => {
  return (
    <>
      <MetaTags
        title="MSCSC - Bad Request"
        description="Your browser sent a request that the server could not understand."
      />
      <Header />
      <main className="page-error">
        <Error heading="400" link="/" linkText="Go to Homepage">
          <ErrorContent message="BAD REQUEST">
            Your browser sent a request that the server could not understand.
            <br />
            Please check your request and try again
          </ErrorContent>
        </Error>
      </main>
    </>
  );
};

export default BadRequest;
