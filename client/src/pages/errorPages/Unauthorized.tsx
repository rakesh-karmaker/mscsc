import Navbar from "@/layouts/navbar/Navbar";
import { ErrorContent, ErrorLayout } from "@/layouts/errorLayout/ErrorLayout";
import type { ReactNode } from "react";

export default function Unauthorized(): ReactNode {
  return (
    <>
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
