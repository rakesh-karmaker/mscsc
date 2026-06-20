import { PieChart } from "@mui/x-charts";
import Loader from "@/components/ui/loader/loader";
import { styled } from "@mui/material/styles";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { deSlugify } from "@/utils/de-slugify";

const StyledText = styled("text")(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 30,
}));

const PieCenterLabelText = styled("text")(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 14,
  opacity: 0.7,
}));

function PieCenterLabel({
  children,
  offsetY,
}: {
  children: React.ReactNode;
  offsetY?: number;
}) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2 + (offsetY || 0)}>
      {children}
    </StyledText>
  );
}

function PieSubLabel({
  children,
  offsetY,
}: {
  children: React.ReactNode;
  offsetY?: number;
}) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <PieCenterLabelText
      x={left + width / 2}
      y={top + height / 2 + (offsetY || 0)}
    >
      {children}
    </PieCenterLabelText>
  );
}

export default function SegmentsDistributionChart({
  data,
}: {
  data: { segmentCounts: { [segment: string]: number } } | null;
}) {
  if (!data) {
    return <Loader />;
  }

  // Segment distribution data
  const segmentDistribution = Object.entries(data.segmentCounts).map(
    ([label, value]) => ({ label, value }),
  );

  const size =
    (1650 > window.innerWidth && window.innerWidth > 1530) ||
    (950 > window.innerWidth && window.innerWidth > 880) ||
    window.innerWidth < 400
      ? 120
      : 200;

  return (
    <div className="segment-distribution w-full min-w-86.5 max-sm:min-w-0 max-[880px]:w-full p-5! rounded-lg mb-6 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-medium px-5 mb-2">Segment Distribution</h2>
      </div>
      <div className="flex justify-center items-center h-full max-sm:[&>div]:flex! max-sm:[&>div]:flex-col-reverse">
        <PieChart
          series={[
            {
              data: segmentDistribution.map((item) => ({
                id: item.label,
                value: item.value,
                label: deSlugify(item.label, false),
              })),
              innerRadius: 65,
            },
          ]}
          slotProps={{
            legend: {
              className:
                "gap-1.5! [&>li>div>span]:truncate [&>li>div>span]:max-w-[30ch] [&>li>div>span]:text-xs/[1rem]",
            },
          }}
          width={size}
          height={size}
        >
          <PieCenterLabel offsetY={-10}>
            {Object.keys(data.segmentCounts).length < 10
              ? `0${Object.keys(data.segmentCounts).length}`
              : Object.keys(data.segmentCounts).length}
          </PieCenterLabel>
          <PieSubLabel offsetY={13}>Segments</PieSubLabel>
        </PieChart>
      </div>
    </div>
  );
}
