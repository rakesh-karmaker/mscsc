import { PieChart } from "@mui/x-charts";
import Loader from "@/components/ui/loader/loader";

export default function CategoryDistributionChart({
  data,
}: {
  data: { categoryCounts: { [category: string]: number } } | null;
}) {
  if (!data) {
    return <Loader />;
  }

  // Category distribution data
  const categoryDistribution = Object.entries(data.categoryCounts).map(
    ([label, value]) => ({ label, value }),
  );

  const size =
    (1650 > window.innerWidth && window.innerWidth > 1530) ||
    (950 > window.innerWidth && window.innerWidth > 880) ||
    window.innerWidth < 400
      ? 120
      : 200;

  return (
    <div className="category-distribution w-full min-w-86.5 max-[880px]:w-full p-5! rounded-lg mb-6 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-medium px-5 mb-2">Category Distribution</h2>
      </div>
      <div className="flex justify-center items-center h-full">
        <PieChart
          series={[
            {
              data: categoryDistribution.map((item) => ({
                id: item.label,
                value: item.value,
                label: item.label,
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
