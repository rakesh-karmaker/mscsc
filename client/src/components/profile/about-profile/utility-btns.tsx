import { useQueryClient } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

export default function UtilityBtns(): ReactNode {
  const queryClient = useQueryClient();
  const [copySuccess, setCopySuccess] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);

    setTimeout(() => {
      setCopySuccess(false);
    }, 2000);
  };

  const logout = () => {
    localStorage.removeItem("token");
    queryClient.invalidateQueries({ queryKey: ["user"] });
  };

  return (
    <div className="utility-btns">
      <button
        className="primary-button user-profile-link"
        onClick={copyLink}
        type="button"
      >
        {copySuccess ? "Link Copied!" : "Copy Profile Link"}
      </button>
      <button
        className="primary-button user-profile-link sign-out"
        onClick={logout}
        type="button"
      >
        Sign Out
      </button>
    </div>
  );
}
