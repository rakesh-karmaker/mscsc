export const QuickStat = ({ icon, title, value }) => {
  return (
    <div className="quickStat min-w-fit h-full !p-6 flex gap-5 items-center shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] rounded-lg">
      <div className="quick-stat-icon w-13 h-13 flex justify-center items-center !my-auto bg-secondary-bg rounded-sm">
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-[0.8em] text-gray-800 font-medium">{title}</p>
        <p className="font-semibold text-3xl">{value}</p>
      </div>
    </div>
  );
};
