import { ErrorContent, ErrorLayout } from "@/layouts/error-layout/error-layout";
import Navbar from "@/layouts/navbar/navbar";
import type { ReactNode } from "react";
import { Helmet } from "react-helmet-async";

export default function NotFound(): ReactNode {
  return (
    <>
      {/* page metadata */}
      <Helmet>
        <title>MSCSC - Not Found</title>
        <meta property="og:title" content={`MSCSC - Not Found`} />
        <meta name="twitter:title" content={`MSCSC - Not Found`} />
      </Helmet>

      {/* page content */}
      <Navbar />
      <main className="page-error">
        <ErrorLayout heading="404" link="/" linkText="Go to Homepage">
          <ErrorContent message="OOPS! PAGE NOT FOUND">
            The page you are trying to access doesn’t exist or has been moved.
            <br />
            Try going back to homepage
          </ErrorContent>
        </ErrorLayout>
      </main>
    </>
  );
}
