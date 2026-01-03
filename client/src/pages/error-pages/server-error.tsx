import { ErrorContent, ErrorLayout } from "@/layouts/error-layout/error-layout";
import Navbar from "@/layouts/navbar/navbar";
import type { ReactNode } from "react";

export default function ServerError(): ReactNode {
  return (
    <>
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
