import { NavLink } from "react-router-dom";
import { IoKeySharp } from "react-icons/io5";
import { FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import type { ReactNode } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { Helmet } from "react-helmet-async";

export default function ForgotPasswordLayout({
  title,
  description,
  children,
  stage,
}: {
  title: string;
  description: string;
  children: ReactNode;
  stage: number;
}) {
  const urls = [
    <FaLock />,
    <MdEmail />,
    <IoKeySharp />,
    <IoMdCheckmarkCircleOutline />,
  ];
  return (
    <>
      {/* page metadata */}
      <Helmet>
        <title>MSCSC - Forgot Password</title>
        <meta property="og:title" content={`MSCSC - Forgot Password`} />
        <meta name="twitter:title" content={`MSCSC - Forgot Password`} />
        <meta
          name="og:url"
          content={`https://mscsc.netlify.app/auth/forgot-password`}
        />
        <link
          rel="canonical"
          href={`https://mscsc.netlify.app/auth/forgot-password`}
        />
      </Helmet>

      {/* page content */}
      <main className="page-forgot">
        <div>
          <div className="forgot-info">
            <div className="forgot-logo row-center">{urls[stage - 1]}</div>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>

          <div className="forgot-form">{children}</div>
          {stage !== 4 ? (
            <p className="back">
              <NavLink
                to="/auth/login"
                className="button-link flex gap-1 items-center"
              >
                <span>
                  <FaArrowLeft />
                </span>{" "}
                Back to Login
              </NavLink>
            </p>
          ) : null}
        </div>
      </main>
    </>
  );
}
