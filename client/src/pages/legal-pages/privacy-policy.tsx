import KeyPoints from "@/components/ui/terms-and-policy/key-points";
import TermsAndPolicyContent from "@/components/ui/terms-and-policy/terms-and-policy-content";
import { privacyPolicyData } from "@/services/data/terms-data";
import { useEffect, type ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

export default function PrivacyPolicy(): ReactNode {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.getElementById(location.hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 0);
    }
  }, [location]);

  return (
    <>
      {/* page metadata */}
      <Helmet>
        <title>MSCSC - Privacy Policy</title>
        <meta property="og:title" content={`MSCSC - Privacy Policy`} />
        <meta name="twitter:title" content={`MSCSC - Privacy Policy`} />
        <meta
          name="og:url"
          content={`https://mscsc.netlify.app/privacy-policy`}
        />
        <link
          rel="canonical"
          href={`https://mscsc.netlify.app/privacy-policy`}
        />
      </Helmet>

      {/* page content */}
      <main className="terms-privacy w-full max-w-max-width min-h-screen !pt-[calc(var(--nav-height)+3rem)] !pb-25 flex flex-col gap-12 max-[450px]:!pt-[calc(var(--nav-height)+1rem)] max-[450px]:gap-6">
        <h1 className="section-heading">
          <span className="highlighted-text">Privacy</span> Policy
        </h1>
        <div className="w-full flex gap-10 relative max-[830px]:flex-col">
          <KeyPoints content={privacyPolicyData} />
          <TermsAndPolicyContent content={privacyPolicyData} page="privacy" />
        </div>
      </main>
    </>
  );
}
