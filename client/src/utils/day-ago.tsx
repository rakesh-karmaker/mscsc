import type { ReactNode } from "react";

export default function DayAgo({ date }: { date: string }): ReactNode {
  const time = Date.parse(date); // Ensure it's in UTC
  const now = Date.now(); // Current time in UTC
  const diff = now - time;

  if (diff < 0) return <span>Just now</span>; // Prevents negative values

  if (diff < 60 * 1000) {
    return (
      <>
        <span>{Math.floor(diff / 1000)}</span>
        <span className="text-black/50 text-sm font-medium !pb-0.25">sec</span>
      </>
    );
  }

  if (diff < 60 * 60 * 1000) {
    return (
      <>
        <span>{Math.floor(diff / (60 * 1000))}</span>
        <span className="text-black/50 text-sm font-medium !pb-0.25">m</span>
      </>
    );
  }

  if (diff < 24 * 60 * 60 * 1000) {
    return (
      <>
        <span>{Math.floor(diff / (60 * 60 * 1000))}</span>
        <span className="text-black/50 text-sm font-medium !pb-0.25">h</span>
      </>
    );
  }

  if (diff < 7 * 24 * 60 * 60 * 1000) {
    return (
      <>
        <span>{Math.floor(diff / (24 * 60 * 60 * 1000))}</span>
        <span className="text-black/50 text-sm font-medium !pb-0.25">d</span>
      </>
    );
  }

  if (diff < 30 * 24 * 60 * 60 * 1000) {
    return (
      <>
        <span>{Math.floor(diff / (7 * 24 * 60 * 60 * 1000))}</span>
        <span className="text-black/50 text-sm font-medium !pb-0.25">w</span>
      </>
    );
  }

  if (diff < 365 * 24 * 60 * 60 * 1000) {
    return (
      <>
        <span>{Math.floor(diff / (30 * 24 * 60 * 60 * 1000))}</span>
        <span className="text-black/50 text-sm font-medium !pb-0.25">mo</span>
      </>
    );
  }

  return (
    <>
      <span>{Math.floor(diff / (365 * 24 * 60 * 60 * 1000))}</span>
      <span className="text-black/50 text-sm font-medium !pb-0.25">y</span>
    </>
  );
}
