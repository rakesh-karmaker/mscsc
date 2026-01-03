import KeyPoints from "@/components/ui/terms-and-policy/key-points";
import TermsAndPolicyContent from "@/components/ui/terms-and-policy/terms-and-policy-content";
import { termsOfServiceData } from "@/services/data/terms-data";
import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

export default function TermsOfService(): ReactNode {
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
    <main className="terms-privacy w-full max-w-max-width min-h-screen !pt-[calc(var(--nav-height)+3rem)] !pb-25 flex flex-col gap-12 max-[450px]:!pt-[calc(var(--nav-height)+1rem)] max-[450px]:gap-6">
      <h1 className="section-heading">
        <span className="highlighted-text">Terms</span> of Service
      </h1>
      <div className="w-full flex gap-10 relative max-[830px]:flex-col">
        <KeyPoints content={termsOfServiceData} />
        <TermsAndPolicyContent content={termsOfServiceData} page="terms" />
      </div>
    </main>
  );
}
