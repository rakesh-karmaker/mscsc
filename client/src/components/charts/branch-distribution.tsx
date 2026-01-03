import type { AdminDashboardDataType } from "@/types/admin-dashboard-types";
import { PieChart } from "@mui/x-charts";
import Loader from "@/components/ui/loader/loader";

export default function BranchDistributionChart({
  data,
}: {
  data: AdminDashboardDataType | null;
}) {
  if (!data) {
    return <Loader />;
  }

  // Branch distribution data
  const branchDistribution = data?.branchDistribution || [];

  const size =
    (1650 > window.innerWidth && window.innerWidth > 1530) ||
    (950 > window.innerWidth && window.innerWidth > 880) ||
    window.innerWidth < 400
      ? 120
      : 200;

  return (
    <div className="branch-distribution w-fit min-w-[346px] max-[880px]:w-full !p-5 rounded-lg mb-6 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] flex flex-col gap-6">
      <div className="!pl-5 flex items-center justify-between">
        <h2 className="font-medium px-5 mb-2">Branch Distribution</h2>
      </div>
      <div className="flex justify-center items-center h-full">
        <PieChart
          series={[
            {
              data: branchDistribution.map((item) => ({
                id: item._id,
                value: item.count,
                label: item._id,
              })),
            },
          ]}
          width={size}
          height={size}
        />
      </div>
    </div>
  );
}
