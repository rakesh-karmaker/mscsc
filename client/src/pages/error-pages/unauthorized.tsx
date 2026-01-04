import Navbar from "@/layouts/navbar/navbar";
import { ErrorContent, ErrorLayout } from "@/layouts/error-layout/error-layout";
import type { ReactNode } from "react";
import { Helmet } from "react-helmet-async";

export default function Unauthorized(): ReactNode {
  return (
    <>
      {/* page metadata */}
      <Helmet>
        <title>MSCSC - Unauthorized</title>
        <meta property="og:title" content={`MSCSC - Unauthorized`} />
        <meta name="twitter:title" content={`MSCSC - Unauthorized`} />
      </Helmet>

      {/* page content */}
      <Navbar />
      <main className="page-error">
        <ErrorLayout
          heading="HOLD ON!"
          link="/auth/login"
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
        </ErrorLayout>
      </main>
    </>
  );
}
