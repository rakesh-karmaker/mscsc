import Header from "@/layout/Header/Header";
import { Error, ErrorContent } from "@/components/UI/Error/Error";
import "@/components/UI/Error/Error.css";
import MetaTags from "@/layout/MetaTags";

const NotFound = () => {
  return (
    <>
      <MetaTags
        title="MSCSC - Page Not Found"
        description="The page you are trying to access doesn’t exist or has been moved."
      />
      <Header />
      <main className="page-error">
        <Error heading="404" link="/" linkText="Go to Homepage">
          <ErrorContent message="OOPS! PAGE NOT FOUND">
            The page you are trying to access doesn’t exist or has been moved.
            <br />
            Try going back to homepage
          </ErrorContent>
        </Error>
      </main>
    </>
  );
};

export default NotFound;
