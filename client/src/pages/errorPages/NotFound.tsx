import { ErrorContent, ErrorLayout } from "@/layouts/errorLayout/ErrorLayout";
import Navbar from "@/layouts/navbar/Navbar";
import type React from "react";

export default function NotFound(): React.ReactNode {
  return (
    <>
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
