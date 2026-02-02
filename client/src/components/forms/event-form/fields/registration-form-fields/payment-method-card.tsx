import type { ReactNode } from "react";

type PaymentMethodCardProps = {
  platform: string;
  isSelected: boolean;
  onClick: (platform: string) => void;
};

type MethodData = {
  [key: string]: {
    name: string;
    border: string;
    color: string;
    logo: string;
  };
};

export default function PaymentMethodCard({
  platform,
  isSelected,
  onClick,
}: PaymentMethodCardProps): ReactNode {
  const methodData: MethodData = {
    bkash: {
      name: "bkash",
      border: "#E91E63",
      color: "#FCF5F8",
      logo: "/event-form/payment/bkash.png",
    },
    nagad: {
      name: "nagad",
      border: "#FFC107",
      color: "#FDFCF4",
      logo: "/event-form/payment/nagad.png",
    },
    rocket: {
      name: "rocket",
      border: "#e6caff",
      color: "#f8f4fd",
      logo: "/event-form/payment/rocket.png",
    },
  };

  const methodInfo = methodData[platform];

  return (
    <button
      className={`w-30 h-15 rounded-md flex justify-center items-center transition-all duration-200 ease-in-out border hover:border-[${methodInfo.border}] hover:bg-[${methodInfo.color}] cursor-pointer`}
      onClick={() => onClick(platform)}
      type="button"
      style={{
        borderColor: isSelected ? methodInfo.border : "var(--primary-color)",
        backgroundColor: isSelected ? methodInfo.color : "var(--primary-bg)",
        filter: isSelected ? "none" : "grayscale(80%)",
      }}
    >
      <img src={methodInfo.logo} alt={methodInfo.name} className="px-4!" />
    </button>
  );
}
