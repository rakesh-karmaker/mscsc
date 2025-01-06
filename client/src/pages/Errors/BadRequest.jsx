import Header from "@/components/nav-bars/Header/Header";
import { Error, ErrorContent } from "@/components/UI/Error/Error";

const BadRequest = () => {
  return (
    <>
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
