import { useEffect, useRef, type ReactNode } from "react";

export default function MscscTag(): ReactNode {
  const tagRef = useRef<HTMLDivElement>(null);
  const delay = 300;
  useEffect(() => {
    setTimeout(() => {
      if (tagRef.current) tagRef.current.classList.add("active");
    }, delay);
  }, [tagRef]);
  return (
    <div ref={tagRef} className="mscsc-tag">
      <p>Science Club</p>
      <span className="name row-center">MSCSC</span>
    </div>
  );
}
