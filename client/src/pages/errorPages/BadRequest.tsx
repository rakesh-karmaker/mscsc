import { ErrorContent, ErrorLayout } from "@/layouts/errorLayout/ErrorLayout";
import Navbar from "@/layouts/navbar/Navbar";
import type { ReactNode } from "react";

export default function BadRequest(): ReactNode {
  return (
    <>
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
