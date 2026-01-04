import { ErrorContent, ErrorLayout } from "@/layouts/error-layout/error-layout";
import Navbar from "@/layouts/navbar/navbar";
import type { ReactNode } from "react";
import { Helmet } from "react-helmet-async";

export default function BadRequest(): ReactNode {
  return (
    <>
      {/* page metadata */}
      <Helmet>
        <title>MSCSC - Bad Request</title>
        <meta property="og:title" content={`MSCSC - Bad Request`} />
        <meta name="twitter:title" content={`MSCSC - Bad Request`} />
      </Helmet>

      {/* page content */}
      <Navbar />
      <main className="page-error">
        <ErrorLayout heading="400" link="/" linkText="Go to Homepage">
          <ErrorContent message="BAD REQUEST">
            Your browser sent a request that the server could not understand.
            <br />
            Please check your request and try again
          </ErrorContent>
        </ErrorLayout>
      </main>
    </>
  );
}
