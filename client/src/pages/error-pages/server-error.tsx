import { ErrorContent, ErrorLayout } from "@/layouts/error-layout/error-layout";
import Navbar from "@/layouts/navbar/navbar";
import type { ReactNode } from "react";
import { Helmet } from "react-helmet-async";

export default function ServerError(): ReactNode {
  return (
    <>
      {/* page metadata */}
      <Helmet>
        <title>MSCSC - Server Error</title>
        <meta property="og:title" content={`MSCSC - Server Error`} />
        <meta name="twitter:title" content={`MSCSC - Server Error`} />
      </Helmet>

      {/* page content */}
      <Navbar />
      <main className="page-error">
        <ErrorLayout heading="500" link="/" linkText="Go to Homepage">
          <ErrorContent message="SORRY, IT'S NOT YOU. IT'S US">
            We are experiencing an internal server problem. <br />
            Please try again later
          </ErrorContent>
        </ErrorLayout>
      </main>
    </>
  );
}
