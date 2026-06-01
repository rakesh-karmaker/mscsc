import { NavLink } from "react-router-dom";
import IoKeySharp from "~icons/ion/key-sharp";
import FaLock from "~icons/fa/lock";
import MdEmail from "~icons/material-symbols/mail";
import IoMdCheckmarkCircleOutline from "~icons/ion/md-checkmark-circle-outline";
import FaArrowLeft from "~icons/fa6-solid/arrow-left";
import type { ReactNode } from "react";
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
